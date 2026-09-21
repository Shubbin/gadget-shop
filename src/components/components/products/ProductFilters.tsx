import React from 'react';
import { ProductCategory } from '@/types';

interface ProductFiltersProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
}

const CATEGORY_ITEMS: { name: string; label: string; icon?: string }[] = [
  { name: 'All Products', label: 'All Products' },
  { name: 'Smartphones', label: 'Smartphones' },
  { name: 'Laptops', label: 'Laptops' },
  { name: 'Headphones & Earbuds', label: 'Headphones & Earbuds' },
  { name: 'Smartwatches', label: 'Smartwatches' },
  { name: 'Gaming', label: 'Gaming' },
  { name: 'Accessories', label: 'Accessories' },
  { name: 'Cameras', label: 'Cameras' },
  { name: 'Monitors', label: 'Monitors' },
  { name: 'Power Banks', label: 'Power Banks' },
  { name: 'Other', label: 'Other' },
];

export default function ProductFilters({
  selectedCategory,
  onSelectCategory,
  maxPrice,
  onMaxPriceChange,
}: ProductFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-6">
      {/* Categories Header */}
      <div>
        <h3 className="font-bold text-slate-900 text-sm mb-3 uppercase tracking-wider">
          Categories
        </h3>
        <ul className="space-y-1">
          {CATEGORY_ITEMS.map((item) => {
            const isSelected = selectedCategory === item.name;
            return (
              <li key={item.name}>
                <button
                  onClick={() => onSelectCategory(item.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <h3 className="font-bold text-slate-900 text-sm mb-3 uppercase tracking-wider">
          Price Range
        </h3>
        <div className="space-y-3">
          <input
            type="range"
            min="50000"
            max="2500000"
            step="50000"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer"
          />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>₦0</span>
            <span>Up to ₦{maxPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
