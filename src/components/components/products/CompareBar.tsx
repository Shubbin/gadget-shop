import React from 'react';
import { Link } from 'react-router-dom';

import { X, ArrowRight, GitCompare } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import { formatNGN } from '@/data/products';

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl bg-white/95 backdrop-blur-md rounded-2xl border border-purple-200 p-3 sm:p-4 shadow-2xl shadow-purple-950/20 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left Info & Items */}
        <div className="flex items-center gap-3 overflow-x-auto py-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#7c3aed] flex-shrink-0">
            <GitCompare className="w-4 h-4" />
            <span className="hidden sm:inline">Compare</span> ({compareList.length}/3)
          </div>

          <div className="flex items-center gap-2">
            {compareList.map((product) => (
              <div
                key={product.id}
                className="relative group w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-purple-100 bg-slate-50 p-1 flex-shrink-0"
              >
                <img src={product.image} alt={product.name} className="object-contain p-1 w-full h-full" />
                <button
                  onClick={() => removeFromCompare(product.id)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[9px] hover:bg-rose-600 transition-colors shadow-sm"
                  title="Remove"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={clearCompare}
            className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 px-2 py-1"
          >
            Clear
          </button>
          <Link
            to="/compare"
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-purple-900/20 transition-all flex items-center gap-1.5"
          >
            Compare <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
