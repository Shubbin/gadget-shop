'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, PromoCode } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  appliedPromo: PromoCode | null;
  discount: number;
  applyPromo: (code: string, activePromos: PromoCode[]) => { success: boolean; message: string };
  removePromo: () => void;
  totalAfterDiscount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('gadgetshop_cart') || localStorage.getItem('storex_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedPromo = localStorage.getItem('gadgetshop_applied_promo');
      if (savedPromo) {
        setAppliedPromo(JSON.parse(savedPromo));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('gadgetshop_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedPromo) {
        localStorage.setItem('gadgetshop_applied_promo', JSON.stringify(appliedPromo));
      } else {
        localStorage.removeItem('gadgetshop_applied_promo');
      }
    } catch (e) {
      console.error(e);
    }
  }, [appliedPromo]);

  const addToCart = (product: Product, quantity: number = 1, selectedColor?: string) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        if (selectedColor) updated[existingIndex].selectedColor = selectedColor;
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedColor }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate discount based on subtotal and applied promo
  let discount = 0;
  if (appliedPromo && appliedPromo.active) {
    if (appliedPromo.minOrderAmount && subtotal < appliedPromo.minOrderAmount) {
      // Ineligible if below minimum spend
      discount = 0;
    } else if (appliedPromo.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedPromo.value) / 100);
    } else {
      discount = Math.min(subtotal, appliedPromo.value);
    }
  }

  const totalAfterDiscount = Math.max(0, subtotal - discount);

  const applyPromo = (code: string, activePromos: PromoCode[]) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a voucher code.' };
    }
    const found = activePromos.find(
      (p) => p.code.toUpperCase() === cleanCode && p.active
    );
    if (!found) {
      return { success: false, message: 'Invalid or expired voucher code.' };
    }
    if (found.minOrderAmount && subtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Order must be at least ₦${found.minOrderAmount.toLocaleString()} to apply this code.`,
      };
    }
    setAppliedPromo(found);
    return {
      success: true,
      message: `Coupon code "${found.code}" applied successfully!`,
    };
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        appliedPromo,
        discount,
        applyPromo,
        removePromo,
        totalAfterDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
