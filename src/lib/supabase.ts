import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Category, Order, Customer } from '@/types';
import { SEED_PRODUCTS, SEED_CATEGORIES, SEED_ORDERS, SEED_CUSTOMER } from '@/lib/seedData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;
  if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project')) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
    return supabaseInstance;
  }
  return null;
}

// In-browser memory store for orders
const inMemoryProducts: Map<string, Product> = new Map(SEED_PRODUCTS.map((p) => [p.id, { ...p }]));
const inMemoryCustomer: Customer = { ...SEED_CUSTOMER };

let ordersStore: Order[] = [...SEED_ORDERS];

export function invalidateOrdersCache() {
  // No-op for client — we use live state
}

export async function getAllProducts(): Promise<Product[]> {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client.from('products').select('*');
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          price: Number(item.price),
          oldPrice: item.old_price ? Number(item.old_price) : undefined,
          discountBadge: item.discount_badge || undefined,
          rating: Number(item.rating || 5),
          reviewCount: Number(item.review_count || 0),
          inStock: Boolean(item.in_stock),
          isNew: Boolean(item.is_new),
          isFeatured: Boolean(item.is_featured),
          image: item.image,
          images: item.images || [item.image],
          description: item.description,
          specs: item.specs || [],
          colors: item.colors || [],
        }));
      }
    } catch (err) {
      console.warn('[Supabase] Error fetching products, using fallback:', err);
    }
  }
  return Array.from(inMemoryProducts.values());
}

export async function fetchProducts(filters?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  deals?: boolean;
  featured?: boolean;
}): Promise<Product[]> {
  const allProducts = await getAllProducts();
  let list = [...allProducts];

  if (filters?.category && filters.category !== 'All Products') {
    const cat = filters.category.toLowerCase();
    list = list.filter((p) => p.category.toLowerCase() === cat);
  }
  if (filters?.featured) list = list.filter((p) => Boolean(p.isFeatured));
  if (filters?.deals) list = list.filter((p) => Boolean(p.discountBadge || ((p as any).oldPrice && (p as any).oldPrice > p.price)));
  if (typeof filters?.minPrice === 'number') list = list.filter((p) => p.price >= filters.minPrice!);
  if (typeof filters?.maxPrice === 'number') list = list.filter((p) => p.price <= filters.maxPrice!);
  if (filters?.search?.trim()) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case 'price-low': list.sort((a, b) => a.price - b.price); break;
      case 'price-high': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case 'newest': list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      default: list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }

  return list;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const allProducts = await getAllProducts();
  return allProducts.find((p) => p.id === id) || inMemoryProducts.get(id) || null;
}

export async function fetchCategories(): Promise<Category[]> {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client.from('categories').select('*');
      if (!error && data && data.length > 0) {
        return data.map((c: any) => ({ name: c.name, icon: c.icon, count: c.count, image: c.image }));
      }
    } catch (e) {
      console.warn('[Supabase] Failed to fetch categories:', e);
    }
  }
  return SEED_CATEGORIES;
}

export async function fetchOrders(): Promise<Order[]> {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id, date: d.date, items: d.items,
          subtotal: Number(d.subtotal), deliveryFee: Number(d.delivery_fee || 0),
          discount: Number(d.discount || 0), total: Number(d.total),
          status: d.status, paymentMethod: d.payment_method, delivery: d.delivery,
        }));
      }
    } catch (e) {
      console.warn('[Supabase] Failed to fetch orders:', e);
    }
  }
  return [...ordersStore];
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client.from('orders').select('*').eq('id', id).maybeSingle();
      if (!error && data) {
        return { id: data.id, date: data.date, items: data.items, subtotal: Number(data.subtotal), deliveryFee: Number(data.delivery_fee || 0), discount: Number(data.discount || 0), total: Number(data.total), status: data.status, paymentMethod: data.payment_method, delivery: data.delivery };
      }
    } catch (e) {
      console.warn('[Supabase] Failed to fetch order:', e);
    }
  }
  return ordersStore.find((o) => o.id === id) || null;
}

export async function insertOrder(order: Order): Promise<Order> {
  ordersStore.unshift(order);

  const client = getSupabase();
  if (client) {
    try {
      await client.from('orders').insert({
        id: order.id, date: order.date, items: order.items,
        subtotal: order.subtotal, delivery_fee: order.deliveryFee,
        discount: order.discount, total: order.total,
        status: order.status, payment_method: order.paymentMethod, delivery: order.delivery,
      });
    } catch (e) {
      console.warn('[Supabase] Error saving order:', e);
    }
  }
  return order;
}

export async function fetchCustomerProfile(): Promise<Customer> {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client.from('profiles').select('*').maybeSingle();
      if (!error && data) {
        return {
          id: data.id, name: data.name, email: data.email, phone: data.phone || '',
          address: data.address, walletBalance: Number(data.wallet_balance || 0),
          savedAddresses: data.saved_addresses || [], createdAt: data.created_at || new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn('[Supabase] Error fetching profile:', e);
    }
  }
  return inMemoryCustomer;
}

export async function updateOrderStatusInDb(id: string, status: Order['status'], deliveryStatus: any, event?: any): Promise<Order | null> {
  const existing = await fetchOrderById(id);
  if (!existing) return null;
  existing.status = status;
  if (existing.delivery) { existing.delivery.status = deliveryStatus; if (event) existing.delivery.events?.push(event); }
  ordersStore = ordersStore.map((o) => (o.id === id ? existing : o));
  const client = getSupabase();
  if (client) { try { await client.from('orders').update({ status, delivery: existing.delivery }).eq('id', id); } catch { } }
  return existing;
}

export async function recordPayment(payment: { id: string; orderId: string; amount: number; currency: string; status: string; transactionId: string; method: string }) {
  const client = getSupabase();
  if (client) {
    try {
      await client.from('payments').insert({ id: payment.id, order_id: payment.orderId, amount: payment.amount, currency: payment.currency, status: payment.status, transaction_id: payment.transactionId, method: payment.method });
    } catch (e) {
      console.warn('[Supabase] Error saving payment:', e);
    }
  }
}
