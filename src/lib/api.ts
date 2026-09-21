import { Product, Category, Order, Customer, DeliveryAddress, PaymentMethodType, DeliveryMethodType } from '@/types';
import { SEED_PRODUCTS, SEED_CATEGORIES, SEED_ORDERS, SEED_CUSTOMER } from '@/lib/seedData';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const ADMIN_STORAGE_KEY = 'gadget_shop_admin_state_v1';
const ORDERS_STORAGE_KEY = 'gadgetshop_orders';

// Helper to get active products (from admin localStorage if modified, otherwise seed)
function getActiveProducts(): Product[] {
  try {
    const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.products) && parsed.products.length > 0) {
        return parsed.products;
      }
    }
  } catch (e) {
    // fallback
  }
  return SEED_PRODUCTS;
}

// Helper to get active orders
function getActiveOrders(): Order[] {
  try {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    // fallback
  }
  return SEED_ORDERS;
}

export function clearApiCache() {
  // No-op for client-side store
}

export const api = {
  // Products API
  products: {
    list: async (params: {
      category?: string;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
      deals?: boolean;
      featured?: boolean;
    } = {}): Promise<{ success: boolean; count: number; products: Product[] }> => {
      if (API_BASE_URL) {
        try {
          const searchParams = new URLSearchParams();
          if (params.category && params.category !== 'All Products') searchParams.append('category', params.category);
          if (params.search) searchParams.append('search', params.search);
          if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
          if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());
          if (params.sortBy) searchParams.append('sortBy', params.sortBy);
          if (params.deals) searchParams.append('deals', 'true');
          if (params.featured) searchParams.append('featured', 'true');

          const qs = searchParams.toString();
          const res = await fetch(`${API_BASE_URL}/api/products${qs ? `?${qs}` : ''}`);
          if (res.ok) {
            const data = await res.json();
            return data;
          }
        } catch (e) {
          // Fall back to client data
        }
      }

      let list = [...getActiveProducts()];

      if (params.category && params.category !== 'All Products') {
        list = list.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      if (params.minPrice !== undefined) {
        list = list.filter((p) => p.price >= params.minPrice!);
      }
      if (params.maxPrice !== undefined) {
        list = list.filter((p) => p.price <= params.maxPrice!);
      }
      if (params.deals) {
        list = list.filter((p) => !!p.oldPrice && p.oldPrice > p.price);
      }
      if (params.featured) {
        list = list.filter((p) => !!p.isFeatured);
      }

      if (params.sortBy === 'price-low') {
        list.sort((a, b) => a.price - b.price);
      } else if (params.sortBy === 'price-high') {
        list.sort((a, b) => b.price - a.price);
      } else if (params.sortBy === 'rating') {
        list.sort((a, b) => b.rating - a.rating);
      }

      return {
        success: true,
        count: list.length,
        products: list,
      };
    },

    getById: async (id: string): Promise<{ success: boolean; product: Product }> => {
      if (API_BASE_URL) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
          if (res.ok) {
            const data = await res.json();
            return data;
          }
        } catch (e) {
          // Fallback
        }
      }

      const products = getActiveProducts();
      const product = products.find((p) => p.id === id || p.id.toLowerCase() === id.toLowerCase());
      if (!product) {
        throw new Error('Product not found');
      }
      return { success: true, product };
    },
  },

  // Categories API
  categories: {
    list: async (): Promise<{ success: boolean; count: number; categories: Category[] }> => {
      return {
        success: true,
        count: SEED_CATEGORIES.length,
        categories: SEED_CATEGORIES,
      };
    },
  },

  // Checkout API
  checkout: {
    validate: async (
      items: Array<{ productId: string; quantity: number; selectedColor?: string }>,
      deliveryMethod: DeliveryMethodType = 'standard'
    ) => {
      const allProducts = getActiveProducts();
      let subtotal = 0;
      const validatedItems = items.map((item) => {
        const prod = allProducts.find((p) => p.id === item.productId) || {
          id: item.productId,
          name: 'Tech Gadget',
          price: 50000,
          image: '/images/products/iphone-16-pro.jpg',
        };
        const itemSubtotal = prod.price * item.quantity;
        subtotal += itemSubtotal;
        return {
          productId: prod.id,
          name: prod.name,
          price: prod.price,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          image: prod.image,
          subtotal: itemSubtotal,
        };
      });

      const deliveryFee = deliveryMethod === 'express' ? 4500 : 2000;
      const discount = subtotal > 500000 ? Math.round(subtotal * 0.05) : 0;
      const total = subtotal + deliveryFee - discount;

      return {
        success: true,
        subtotal,
        deliveryFee,
        discount,
        total,
        itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
        items: validatedItems,
      };
    },
  },

  // Payments API
  payments: {
    create: async (payload: {
      orderId?: string;
      amount: number;
      currency?: string;
      method: PaymentMethodType;
      cardDetails?: { cardNumber: string; expiry: string; cvv: string };
    }) => {
      const txId = `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;
      return {
        success: true,
        payment: {
          id: `pay_${Date.now()}`,
          orderId: payload.orderId || `GS-${Math.floor(1000 + Math.random() * 9000)}`,
          amount: payload.amount,
          currency: payload.currency || 'NGN',
          status: 'successful',
          transactionId: txId,
        },
      };
    },
  },

  // Orders API
  orders: {
    list: async (): Promise<{ success: boolean; count: number; orders: Order[] }> => {
      const orders = getActiveOrders();
      return {
        success: true,
        count: orders.length,
        orders,
      };
    },

    getById: async (id: string): Promise<{ success: boolean; order: Order }> => {
      const orders = getActiveOrders();
      const order = orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
      if (!order) {
        throw new Error('Order not found');
      }
      return { success: true, order };
    },

    create: async (payload: {
      items: any[];
      subtotal: number;
      deliveryFee: number;
      discount: number;
      address: DeliveryAddress;
      paymentMethod: PaymentMethodType;
      deliveryMethod: DeliveryMethodType;
    }): Promise<{ success: boolean; order: Order }> => {
      const newOrderId = `GS-${Math.floor(1000 + Math.random() * 9000)}`;
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      const newOrder: Order = {
        id: newOrderId,
        date: today,
        items: payload.items,
        subtotal: payload.subtotal,
        deliveryFee: payload.deliveryFee,
        discount: payload.discount,
        total: payload.subtotal + payload.deliveryFee - payload.discount,
        status: 'Processing',
        paymentMethod: payload.paymentMethod,
        delivery: {
          deliveryId: `DEL-${Math.floor(10000 + Math.random() * 90000)}`,
          provider: 'GadgetShop Express Logistics',
          status: 'PROCESSING',
          trackingNumber: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
          address: payload.address,
          estimatedDelivery: '2-4 Business Days',
          events: [
            {
              title: 'Order Confirmed',
              description: 'Payment verified and order created',
              timestamp: `${today}, Just now`,
              completed: true,
            },
            {
              title: 'Processing',
              description: 'Order being prepared at GadgetShop fulfillment hub',
              timestamp: `${today}, In Progress`,
              completed: true,
            },
            {
              title: 'Out for Delivery',
              description: 'Courier assigned for dispatch',
              timestamp: 'Pending',
              completed: false,
            },
            {
              title: 'Delivered',
              description: 'Package delivered to recipient',
              timestamp: 'Pending',
              completed: false,
            },
          ],
        },
      };

      try {
        const existing = getActiveOrders();
        const updated = [newOrder, ...existing];
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        // storage fallback
      }

      return { success: true, order: newOrder };
    },

    updateStatus: async (
      id: string,
      status: Order['status'],
      note?: string
    ): Promise<{ success: boolean; order: Order }> => {
      const orders = getActiveOrders();
      const order = orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
      if (!order) {
        throw new Error('Order not found');
      }
      order.status = status;
      if (order.delivery && status === 'Delivered') {
        order.delivery.status = 'DELIVERED';
        order.delivery.events.forEach((ev) => (ev.completed = true));
      }
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      } catch (e) {
        // fallback
      }
      return { success: true, order };
    },
  },

  // Account API
  account: {
    getProfile: async (): Promise<{ success: boolean; profile: Customer }> => {
      return {
        success: true,
        profile: SEED_CUSTOMER,
      };
    },
  },
};
