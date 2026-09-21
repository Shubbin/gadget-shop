'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gadget_shop_compare');
      if (saved) {
        setCompareList(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load compare items:', e);
    }
  }, []);

  const addToCompare = (product: Product): boolean => {
    if (compareList.some((p) => p.id === product.id)) {
      removeFromCompare(product.id);
      return false;
    }
    if (compareList.length >= 3) {
      alert('You can compare up to 3 gadgets at a time. Please remove an item first.');
      return false;
    }
    const updated = [...compareList, product];
    setCompareList(updated);
    localStorage.setItem('gadget_shop_compare', JSON.stringify(updated));
    return true;
  };

  const removeFromCompare = (productId: string) => {
    const updated = compareList.filter((p) => p.id !== productId);
    setCompareList(updated);
    localStorage.setItem('gadget_shop_compare', JSON.stringify(updated));
  };

  const clearCompare = () => {
    setCompareList([]);
    localStorage.removeItem('gadget_shop_compare');
  };

  const isInCompare = (productId: string): boolean => {
    return compareList.some((p) => p.id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
