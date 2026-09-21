import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Headphones, RotateCcw, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/components/products/ProductCard';
import { CATEGORIES } from '@/data/products';
import { Product, Category } from '@/types';
import { fetchProducts, fetchCategories } from '@/lib/supabase';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES as Category[]);

  useEffect(() => {
    fetchProducts({ featured: true })
      .then(setFeaturedProducts)
      .catch(() => setFeaturedProducts([]));

    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories(CATEGORIES as Category[]));
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-[#1e0836] text-white overflow-hidden rounded-b-2xl lg:rounded-2xl max-w-7xl mx-auto my-0 lg:mt-4 shadow-2xl border border-purple-950">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-banner.png"
            alt="Flagship Gadgets Showcase"
            className="w-full h-full object-cover object-right opacity-80 md:opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e0836] via-[#1e0836]/85 md:via-[#1e0836]/70 to-transparent max-w-2xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              Smart Gadgets.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-200 to-pink-200">
                Better Living.
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              Discover the latest gadgets, top brands and amazing deals — all in one place.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/products"
                className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-purple-950/60 transition-all flex items-center gap-2 group text-sm"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products?deals=true"
                className="bg-[#581c87]/80 hover:bg-[#581c87] text-slate-200 font-semibold px-6 py-3.5 rounded-xl border border-purple-800/80 transition-colors text-sm backdrop-blur-sm"
              >
                Explore Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Highlights Strip */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-900 text-xs font-bold">Free Delivery</h4>
              <p className="text-[11px] text-slate-500">On all orders over ₦50,000</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-900 text-xs font-bold">Secure Payment</h4>
              <p className="text-[11px] text-slate-500">100% safe and encrypted</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center flex-shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-900 text-xs font-bold">24/7 Support</h4>
              <p className="text-[11px] text-slate-500">We're here to help anytime</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-900 text-xs font-bold">Easy Returns</h4>
              <p className="text-[11px] text-slate-500">Hassle-free within 7 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Shop by Category</h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-[#7c3aed] hover:text-[#6d28d9] flex items-center gap-1"
          >
            View all categories <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white rounded-xl border border-slate-200/80 p-4 text-center hover:border-purple-300 hover:shadow-md transition-all flex flex-col items-center justify-between"
            >
              <div className="relative w-24 h-24 mb-3 rounded-lg overflow-hidden bg-slate-50 p-2 flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-xs group-hover:text-[#7c3aed] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 block mt-0.5">{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Featured Products</h2>
            <p className="text-xs text-slate-500">Top picked flagship gadgets for you</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-[#7c3aed] hover:text-[#6d28d9] flex items-center gap-1"
          >
            Explore all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-500">
            Connecting to Gadget Shop inventory...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
