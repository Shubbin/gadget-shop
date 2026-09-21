import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { formatNGN } from '@/data/products';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const navigate = useNavigate();
  const { products } = useAdmin();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const TRENDING_KEYWORDS = ['iPhone 16', 'MacBook Air M3', 'PlayStation 5', 'Galaxy S25', 'AirPods Pro', 'London Used'];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut listener: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via custom event if closed
          const event = new CustomEvent('open-search-modal');
          window.dispatchEvent(event);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const handleSelectProduct = (id: string) => {
    onClose();
    navigate(`/products/${id}`);
  };

  const handleKeywordClick = (kw: string) => {
    setQuery(kw);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#7c3aed] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search gadgets by name, specs, brand (e.g. iPhone, M3, Sony)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
            ESC
          </span>
        </div>

        {/* Trending Keywords Strip */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 flex-shrink-0">
            <TrendingUp className="w-3.5 h-3.5 text-[#7c3aed]" /> Trending:
          </span>
          {TRENDING_KEYWORDS.map((kw) => (
            <button
              key={kw}
              onClick={() => handleKeywordClick(kw)}
              className="text-[11px] bg-white border border-slate-200 hover:border-purple-300 text-slate-600 hover:text-[#7c3aed] px-2.5 py-0.5 rounded-full transition-colors flex-shrink-0"
            >
              {kw}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div className="max-h-96 overflow-y-auto p-4">
          {query.trim() === '' ? (
            <div className="text-center py-10 space-y-2">
              <Sparkles className="w-8 h-8 text-[#7c3aed] mx-auto opacity-75" />
              <p className="text-xs text-slate-500">
                Type any gadget name, condition (e.g. "London Used"), or category.
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-sm font-bold text-slate-700">No gadgets found for "{query}"</p>
              <p className="text-xs text-slate-400">
                Can't find what you need? You can submit a swap or repair request!
              </p>
              <Link
                to="/services"
                onClick={onClose}
                className="mt-2 inline-block text-xs font-bold text-[#7c3aed] hover:underline"
              >
                Go to Gadget Services & Swap Hub →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Found {filteredProducts.length} matching gadget(s)
              </p>
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProduct(p.id)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-purple-50/60 cursor-pointer border border-transparent hover:border-purple-100 transition-all group"
                >
                  <div className="relative w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                    <img src={p.image} alt={p.name} className="object-contain p-1 w-full h-full" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#7c3aed] transition-colors truncate">
                        {p.name}
                      </h4>
                      {p.condition && (
                        <span className="text-[9px] font-bold bg-purple-100 text-[#7c3aed] px-1.5 py-0.5 rounded">
                          {p.condition.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{p.category}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-extrabold text-slate-900">{formatNGN(p.price)}</div>
                    <span
                      className={`text-[10px] font-bold ${
                        p.stockStatus === 'sold'
                          ? 'text-rose-600'
                          : p.inStock
                          ? 'text-emerald-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {p.stockStatus === 'sold' ? 'Sold Out' : 'Available'}
                    </span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#7c3aed] group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
