import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, X, ArrowRight } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import { formatNGN } from '@/data/products';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <BarChart2 className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">No Products to Compare</h2>
        <p className="text-xs text-slate-500">Browse products and click the compare icon to add up to 3 devices side-by-side.</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-purple-600 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md">
          Browse Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const allSpecs = Array.from(
    new Set(compareList.flatMap((p) => Object.keys(p.specs || {})))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-purple-600" /> Compare Gadgets
        </h1>
        <button onClick={clearCompare} className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1">
          <X className="w-3.5 h-3.5" /> Clear All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left text-slate-500 font-bold text-[11px] uppercase tracking-wider w-40">Feature</th>
              {compareList.map((product) => (
                <th key={product.id} className="py-3 px-4 text-center min-w-[200px]">
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 relative">
                    <button onClick={() => removeFromCompare(product.id)}
                      className="absolute right-2 top-2 p-1 rounded-full hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                    <div className="h-20 flex items-center justify-center">
                      <img src={product.image} alt={product.name} className="max-h-full object-contain" />
                    </div>
                    <div className="font-bold text-slate-900 text-xs line-clamp-2">{product.name}</div>
                    <div className="font-black text-purple-600">{formatNGN(product.price)}</div>
                    <Link to={`/products/${product.id}`}
                      className="block w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-[11px] transition-all">
                      View Product
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-3 px-4 font-bold text-slate-600 bg-slate-50/60">Category</td>
              {compareList.map((p) => <td key={p.id} className="py-3 px-4 text-center text-slate-700">{p.category}</td>)}
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-3 px-4 font-bold text-slate-600 bg-slate-50/60">Condition</td>
              {compareList.map((p) => <td key={p.id} className="py-3 px-4 text-center text-slate-700 capitalize">{(p.condition || 'N/A').replace(/_/g, ' ')}</td>)}
            </tr>
            {allSpecs.map((spec) => (
              <tr key={spec} className="border-t border-slate-100">
                <td className="py-3 px-4 font-bold text-slate-600 bg-slate-50/60 capitalize">{spec}</td>
                {compareList.map((p) => (
                  <td key={p.id} className="py-3 px-4 text-center text-slate-700">{p.specs?.[spec] || '—'}</td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-slate-100">
              <td className="py-3 px-4 font-bold text-slate-600 bg-slate-50/60">Price</td>
              {compareList.map((p) => <td key={p.id} className="py-3 px-4 text-center font-black text-purple-700">{formatNGN(p.price)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
