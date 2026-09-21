import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '@/components/components/products/ProductGrid';
import ProductFilters from '@/components/components/products/ProductFilters';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All Products';
  const initialSearch = searchParams.get('search') || '';
  const initialDeals = searchParams.get('deals') === 'true';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [maxPrice, setMaxPrice] = useState<number>(2500000);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const isFirstLoad = React.useRef(true);

  useEffect(() => {
    let isCancelled = false;
    async function loadProducts() {
      setLoading(true);
      try {
        const res = await api.products.list({ category: selectedCategory, search: searchQuery, maxPrice, sortBy, deals: initialDeals });
        if (!isCancelled && res.success) setProducts(res.products);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    if (isFirstLoad.current) { isFirstLoad.current = false; loadProducts(); return; }
    const timer = setTimeout(loadProducts, 120);
    return () => { isCancelled = true; clearTimeout(timer); };
  }, [selectedCategory, maxPrice, searchQuery, sortBy, initialDeals]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">All Products</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Find the best gadgets for your lifestyle.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Sort by:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] cursor-pointer">
              <option value="featured">Featured</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          <button onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-lg">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="hidden md:block col-span-1">
          <ProductFilters selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} maxPrice={maxPrice} onMaxPriceChange={setMaxPrice} />
        </div>
        {mobileFilterOpen && (
          <div className="md:hidden col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-lg mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="text-xs text-[#7c3aed] font-semibold">Close</button>
            </div>
            <ProductFilters selectedCategory={selectedCategory} onSelectCategory={(cat) => { setSelectedCategory(cat); setMobileFilterOpen(false); }} maxPrice={maxPrice} onMaxPriceChange={setMaxPrice} />
          </div>
        )}
        <div className="col-span-1 md:col-span-3">
          <div className="mb-4 text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>Showing <span className="text-slate-900 font-bold">{products.length}</span> gadgets</span>
            {loading && <span className="flex items-center gap-1.5 text-xs text-[#7c3aed]"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating catalog...</span>}
          </div>
          {loading && products.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#7c3aed] mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading catalog...</p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </div>
  );
}
