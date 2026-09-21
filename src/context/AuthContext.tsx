'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer } from '@/types';
import { SEED_CUSTOMERS } from '@/lib/seedData';
import { useAdmin } from './AdminContext';

interface AuthContextType {
  user: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    address?: string;
    city?: string;
    state?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<Customer>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_SESSION_KEY = 'gadget_shop_user_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { customers, addCustomer } = useAdmin();

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(USER_SESSION_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        setUser(parsed);
      } else {
        // Default to first seed customer for a seamless first-time customer experience
        const defaultCustomer = SEED_CUSTOMERS[0];
        setUser(defaultCustomer);
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(defaultCustomer));
      }
    } catch (e) {
      console.warn('Failed to restore customer session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    // Simulate swift network verification
    await new Promise((resolve) => setTimeout(resolve, 400));

    const cleanEmail = email.trim().toLowerCase();
    // Search in existing registered/seed customers
    const existing = customers.find((c) => c.email.toLowerCase() === cleanEmail);

    if (existing) {
      setUser(existing);
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(existing));
      setIsLoading(false);
      return { success: true };
    }

    // If new email, automatically create profile seamlessly so they can continue shopping
    const newCustomer: Customer = {
      id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
      name: cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      email: cleanEmail,
      phone: '+234 800 000 0000',
      walletBalance: 10000, // Welcome bonus
      totalSpent: 0,
      ordersCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      address: {
        fullName: cleanEmail.split('@')[0],
        phone: '+234 800 000 0000',
        email: cleanEmail,
        address: 'Mainland, Lagos',
        city: 'Ikeja',
        state: 'Lagos',
      },
      savedAddresses: [],
    };

    addCustomer(newCustomer);
    setUser(newCustomer);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(newCustomer));
    setIsLoading(false);
    return { success: true };
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    address?: string;
    city?: string;
    state?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const cleanEmail = data.email.trim().toLowerCase();
    const existing = customers.find((c) => c.email.toLowerCase() === cleanEmail);

    if (existing) {
      setIsLoading(false);
      return { success: false, message: 'An account with this email address already exists. Please sign in.' };
    }

    const newCustomer: Customer = {
      id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      walletBalance: 15000, // ₦15,000 new shopper credit
      totalSpent: 0,
      ordersCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      address: {
        fullName: data.name.trim(),
        phone: data.phone.trim(),
        email: cleanEmail,
        address: data.address || 'Lagos Address',
        city: data.city || 'Ikeja',
        state: data.state || 'Lagos',
      },
      savedAddresses: [
        {
          fullName: data.name.trim(),
          phone: data.phone.trim(),
          email: cleanEmail,
          address: data.address || 'Lagos Address',
          city: data.city || 'Ikeja',
          state: data.state || 'Lagos',
        },
      ],
    };

    addCustomer(newCustomer);
    setUser(newCustomer);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(newCustomer));
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_SESSION_KEY);
  };

  const updateProfile = (data: Partial<Customer>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    addCustomer(updated);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
