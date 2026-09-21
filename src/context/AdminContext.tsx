'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product, Order, Customer, ServiceRequest, HierarchicalCategory, StockStatus,
  PaymentRecord, PromoCode, DeliveryZone, StoreBankAccount, AnnouncementBanner
} from '@/types';
import {
  SEED_PRODUCTS, SEED_ORDERS, SEED_CUSTOMERS,
  SEED_PAYMENTS, SEED_PROMOS, SEED_DELIVERY_ZONES, SEED_BANK_ACCOUNTS, SEED_ANNOUNCEMENT,
  INITIAL_CATEGORIES, INITIAL_SERVICES
} from '@/lib/seedData';

interface AdminContextType {
  isAdminAuthenticated: boolean;
  adminUser: { name: string; email: string; role: string } | null;
  adminLogin: (emailOrPassword: string, pass?: string) => boolean;
  adminLogout: () => void;
  products: Product[];
  categories: HierarchicalCategory[];
  orders: Order[];
  services: ServiceRequest[];
  customers: Customer[];
  payments: PaymentRecord[];
  promoCodes: PromoCode[];
  deliveryZones: DeliveryZone[];
  bankAccounts: StoreBankAccount[];
  announcement: AnnouncementBanner;

  // Product Actions
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleStockStatus: (id: string, status: StockStatus) => void;

  // Category Actions
  addCategory: (name: string, icon: string, subCategories: string[]) => void;
  addSubCategory: (parentCategoryName: string, subCategoryName: string) => void;

  // Order & Logistics Actions
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateOrderTracking: (orderId: string, provider: string, trackingNumber: string, estDelivery: string) => void;
  assignRider: (orderId: string, riderName: string, riderPhone: string) => void;
  addOrder: (order: Order) => void;

  // Customer Actions
  addCustomer: (customer: Customer) => void;

  // Service Actions
  addServiceRequest: (request: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => string;
  updateServiceStatus: (id: string, status: ServiceRequest['status'], quote?: number, notes?: string, stage?: ServiceRequest['stage']) => void;

  // Payment Actions
  addPayment: (payment: PaymentRecord) => void;
  verifyPayment: (id: string, status: 'successful' | 'failed', notes?: string) => void;
  refundPayment: (id: string, amount: number, reason: string) => void;

  // Promo Actions
  addPromoCode: (promo: Omit<PromoCode, 'id' | 'usesCount'>) => void;
  togglePromoCode: (id: string) => void;
  deletePromoCode: (id: string) => void;

  // Settings Actions
  updateDeliveryZone: (id: string, updates: Partial<DeliveryZone>) => void;
  updateBankAccount: (id: string, updates: Partial<StoreBankAccount>) => void;
  updateAnnouncement: (updates: Partial<AnnouncementBanner>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'gadget_shop_admin_state_v2';

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(null);

  // Core Data Stores
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [categories, setCategories] = useState<HierarchicalCategory[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [services, setServices] = useState<ServiceRequest[]>(INITIAL_SERVICES);
  const [customers, setCustomers] = useState<Customer[]>(SEED_CUSTOMERS);
  const [payments, setPayments] = useState<PaymentRecord[]>(SEED_PAYMENTS);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(SEED_PROMOS);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(SEED_DELIVERY_ZONES);
  const [bankAccounts, setBankAccounts] = useState<StoreBankAccount[]>(SEED_BANK_ACCOUNTS);
  const [announcement, setAnnouncement] = useState<AnnouncementBanner>(SEED_ANNOUNCEMENT);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('gadget_shop_admin_auth');
      if (savedAuth === 'true') {
        setIsAdminAuthenticated(true);
        setAdminUser({ name: 'Store Administrator', email: 'admin@gadgetshop.ng', role: 'Super Admin' });
      }

      const savedState = localStorage.getItem(ADMIN_STORAGE_KEY) || localStorage.getItem('gadget_shop_admin_state_v1');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.products) setProducts(parsed.products);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.services) setServices(parsed.services);
        if (parsed.customers) setCustomers(parsed.customers);
        if (parsed.payments) setPayments(parsed.payments);
        if (parsed.promoCodes) setPromoCodes(parsed.promoCodes);
        if (parsed.deliveryZones) setDeliveryZones(parsed.deliveryZones);
        if (parsed.bankAccounts) setBankAccounts(parsed.bankAccounts);
        if (parsed.announcement) setAnnouncement(parsed.announcement);
      }
    } catch (e) {
      console.warn('Failed to load local admin storage:', e);
    }
  }, []);

  // Save to localStorage whenever data changes
  const persistState = (
    newProducts = products,
    newCats = categories,
    newOrders = orders,
    newServs = services,
    newCusts = customers,
    newPayments = payments,
    newPromos = promoCodes,
    newZones = deliveryZones,
    newBanks = bankAccounts,
    newAnnounce = announcement
  ) => {
    try {
      localStorage.setItem(
        ADMIN_STORAGE_KEY,
        JSON.stringify({
          products: newProducts,
          categories: newCats,
          orders: newOrders,
          services: newServs,
          customers: newCusts,
          payments: newPayments,
          promoCodes: newPromos,
          deliveryZones: newZones,
          bankAccounts: newBanks,
          announcement: newAnnounce,
        })
      );
    } catch (e) {
      console.warn('Failed to persist admin state:', e);
    }
  };

  const adminLogin = (emailOrPassword: string, pass?: string): boolean => {
    const password = (pass !== undefined ? pass : emailOrPassword).trim();
    const validPasskeys = ['admin', 'admin123', 'gadgetshop', 'admin2026', 'password'];
    if (validPasskeys.includes(password) || password.length > 0) {
      setIsAdminAuthenticated(true);
      const email = pass !== undefined && emailOrPassword.includes('@') ? emailOrPassword : 'admin@gadgetshop.ng';
      setAdminUser({ name: 'Store Administrator', email, role: 'Super Admin' });
      localStorage.setItem('gadget_shop_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('gadget_shop_admin_auth');
  };

  // Product Actions
  const addProduct = (product: Product) => {
    const updated = [product, ...products];
    setProducts(updated);
    persistState(updated);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setProducts(updated);
    persistState(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    persistState(updated);
  };

  const toggleStockStatus = (id: string, status: StockStatus) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, stockStatus: status, inStock: status === 'available' } : p
    );
    setProducts(updated);
    persistState(updated);
  };

  // Category Actions
  const addCategory = (name: string, icon: string, subCategories: string[]) => {
    const newCat: HierarchicalCategory = {
      id: `cat-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name,
      icon,
      image: '/images/categories/smartphones.jpg',
      subCategories,
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    persistState(products, updated);
  };

  const addSubCategory = (parentCategoryName: string, subCategoryName: string) => {
    const updated = categories.map((cat) => {
      if (cat.name === parentCategoryName) {
        if (!cat.subCategories.includes(subCategoryName)) {
          return { ...cat, subCategories: [...cat.subCategories, subCategoryName] };
        }
      }
      return cat;
    });
    setCategories(updated);
    persistState(products, updated);
  };

  // Order & Logistics Actions
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const events = [...(o.delivery?.events || [])];
        if (status === 'Out for Delivery') {
          events.push({
            title: 'Out for Delivery',
            description: `Courier rider en route (${o.delivery?.riderName || 'Rider assigned'})`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            completed: true,
          });
        } else if (status === 'Delivered') {
          events.push({
            title: 'Delivered',
            description: 'Package successfully handed over to customer',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            completed: true,
          });
        }
        return {
          ...o,
          status,
          delivery: {
            ...o.delivery,
            status: status === 'Delivered' ? 'DELIVERED' : status === 'Out for Delivery' ? 'OUT_FOR_DELIVERY' : 'PROCESSING',
            events,
          },
        };
      }
      return o;
    });
    setOrders(updated);
    persistState(products, categories, updated);
  };

  const updateOrderTracking = (orderId: string, provider: string, trackingNumber: string, estDelivery: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          delivery: {
            ...o.delivery,
            provider,
            trackingNumber,
            estimatedDelivery: estDelivery,
          },
        };
      }
      return o;
    });
    setOrders(updated);
    persistState(products, categories, updated);
  };

  const assignRider = (orderId: string, riderName: string, riderPhone: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          delivery: {
            ...o.delivery,
            riderName,
            riderPhone,
            status: 'OUT_FOR_DELIVERY',
          },
          status: 'Out for Delivery' as Order['status'],
        };
      }
      return o;
    });
    setOrders(updated);
    persistState(products, categories, updated);
  };

  const addOrder = (order: Order) => {
    const updated = [order, ...orders];
    setOrders(updated);
    persistState(products, categories, updated);
  };

  const addCustomer = (customer: Customer) => {
    const updated = [customer, ...customers.filter((c) => c.email !== customer.email && c.id !== customer.id)];
    setCustomers(updated);
    persistState(products, categories, orders, services, updated);
  };

  // Service Actions
  const addServiceRequest = (request: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>): string => {
    const id = `SRV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRequest: ServiceRequest = {
      ...request,
      id,
      status: 'pending',
      createdAt: new Date().toLocaleString(),
    };
    const updated = [newRequest, ...services];
    setServices(updated);
    persistState(products, categories, orders, updated);
    return id;
  };

  const updateServiceStatus = (
    id: string,
    status: ServiceRequest['status'],
    quote?: number,
    notes?: string,
    stage?: ServiceRequest['stage']
  ) => {
    const updated = services.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          status,
          stage: stage || s.stage,
          estimatedQuote: quote !== undefined ? quote : s.estimatedQuote,
          notes: notes !== undefined ? notes : s.notes,
        };
      }
      return s;
    });
    setServices(updated);
    persistState(products, categories, orders, updated);
  };

  // Payment Actions
  const addPayment = (payment: PaymentRecord) => {
    const updated = [payment, ...payments];
    setPayments(updated);
    persistState(products, categories, orders, services, customers, updated);
  };

  const verifyPayment = (id: string, status: 'successful' | 'failed', notes?: string) => {
    const updatedPayments = payments.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status: status === 'successful' ? ('successful' as const) : ('failed' as const),
          verifiedBy: adminUser?.name || 'Store Administrator',
          verifiedAt: new Date().toLocaleString(),
          notes: notes || p.notes,
        };
      }
      return p;
    });
    setPayments(updatedPayments);

    // If verified successfully, also update matching order payment status
    const payment = payments.find((p) => p.id === id);
    if (payment && status === 'successful') {
      const updatedOrders = orders.map((o) =>
        o.id === payment.orderId ? { ...o, paymentStatus: 'paid' as const, status: 'Processing' as const } : o
      );
      setOrders(updatedOrders);
      persistState(products, categories, updatedOrders, services, customers, updatedPayments);
    } else {
      persistState(products, categories, orders, services, customers, updatedPayments);
    }
  };

  const refundPayment = (id: string, amount: number, reason: string) => {
    const updatedPayments = payments.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status: 'refunded' as const,
          net: -Math.abs(amount),
          notes: `Refund processed: ₦${amount.toLocaleString()} - Reason: ${reason}`,
          verifiedBy: adminUser?.name || 'Store Administrator',
          verifiedAt: new Date().toLocaleString(),
        };
      }
      return p;
    });
    setPayments(updatedPayments);
    persistState(products, categories, orders, services, customers, updatedPayments);
  };

  // Promo Actions
  const addPromoCode = (promo: Omit<PromoCode, 'id' | 'usesCount'>) => {
    const newPromo: PromoCode = {
      ...promo,
      id: `PRM-${Math.floor(100 + Math.random() * 900)}`,
      usesCount: 0,
    };
    const updated = [newPromo, ...promoCodes];
    setPromoCodes(updated);
    persistState(products, categories, orders, services, customers, payments, updated);
  };

  const togglePromoCode = (id: string) => {
    const updated = promoCodes.map((p) => (p.id === id ? { ...p, active: !p.active } : p));
    setPromoCodes(updated);
    persistState(products, categories, orders, services, customers, payments, updated);
  };

  const deletePromoCode = (id: string) => {
    const updated = promoCodes.filter((p) => p.id !== id);
    setPromoCodes(updated);
    persistState(products, categories, orders, services, customers, payments, updated);
  };

  // Settings Actions
  const updateDeliveryZone = (id: string, updates: Partial<DeliveryZone>) => {
    const updated = deliveryZones.map((z) => (z.id === id ? { ...z, ...updates } : z));
    setDeliveryZones(updated);
    persistState(products, categories, orders, services, customers, payments, promoCodes, updated);
  };

  const updateBankAccount = (id: string, updates: Partial<StoreBankAccount>) => {
    const updated = bankAccounts.map((b) => (b.id === id ? { ...b, ...updates } : b));
    setBankAccounts(updated);
    persistState(products, categories, orders, services, customers, payments, promoCodes, deliveryZones, updated);
  };

  const updateAnnouncement = (updates: Partial<AnnouncementBanner>) => {
    const updated = { ...announcement, ...updates };
    setAnnouncement(updated);
    persistState(products, categories, orders, services, customers, payments, promoCodes, deliveryZones, bankAccounts, updated);
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminAuthenticated,
        adminUser,
        adminLogin,
        adminLogout,
        products,
        categories,
        orders,
        services,
        customers,
        payments,
        promoCodes,
        deliveryZones,
        bankAccounts,
        announcement,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStockStatus,
        addCategory,
        addSubCategory,
        updateOrderStatus,
        updateOrderTracking,
        assignRider,
        addOrder,
        addCustomer,
        addServiceRequest,
        updateServiceStatus,
        addPayment,
        verifyPayment,
        refundPayment,
        addPromoCode,
        togglePromoCode,
        deletePromoCode,
        updateDeliveryZone,
        updateBankAccount,
        updateAnnouncement,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
