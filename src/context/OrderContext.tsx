import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, CartItem, DeliveryAddress, PaymentMethodType, DeliveryMethodType } from '@/types';
import { SEED_ORDERS } from '@/lib/seedData';

interface CreateOrderParams {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  address: DeliveryAddress;
  deliveryMethod: DeliveryMethodType;
  paymentMethod: PaymentMethodType;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (params: CreateOrderParams) => Promise<Order>;
  getOrderById: (id: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
  isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const ORDERS_STORAGE_KEY = 'gadgetshop_orders';

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch orders from localStorage or seed
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const cached = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (cached) {
        setOrders(JSON.parse(cached));
      } else {
        setOrders(SEED_ORDERS);
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(SEED_ORDERS));
      }
    } catch (e) {
      console.warn('[GadgetShop OrderContext] Error loading orders cache:', e);
      setOrders(SEED_ORDERS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const createOrder = async (params: CreateOrderParams): Promise<Order> => {
    const newOrderId = `GS-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newOrder: Order = {
      id: newOrderId,
      date: today,
      items: params.items,
      subtotal: params.subtotal,
      deliveryFee: params.deliveryFee,
      discount: params.discount,
      total: params.subtotal + params.deliveryFee - params.discount,
      status: 'Processing',
      paymentMethod: params.paymentMethod,
      delivery: {
        deliveryId: `DEL-${Math.floor(10000 + Math.random() * 90000)}`,
        provider: 'GadgetShop Express Logistics',
        status: 'PROCESSING',
        trackingNumber: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
        address: params.address,
        estimatedDelivery: '2-4 Business Days',
        events: [
          {
            title: 'Order Confirmed',
            description: 'Payment verified and order created successfully',
            timestamp: `${today}, Just now`,
            completed: true,
          },
          {
            title: 'Processing',
            description: 'Package being prepared at GadgetShop fulfillment hub',
            timestamp: `${today}, In Progress`,
            completed: true,
          },
          {
            title: 'Out for Delivery',
            description: 'Courier rider will be assigned for dispatch',
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

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to persist order:', err);
      }
      return updated;
    });

    return newOrder;
  };

  const getOrderById = (id: string) => {
    return orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById,
        refreshOrders: fetchOrders,
        isLoading,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
