import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, Menu, X, Wrench, RefreshCw, Shield, User, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCartDrawer } from '@/context/CartDrawerContext';
import { useAuth } from '@/context/AuthContext';
import SearchModal from '@/components/components/layout/SearchModal';

import GadgetShopLogo from '@/components/components/ui/Logo';

export default function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();
  const { openCart } = useCartDrawer();
  const { user, isAuthenticated } = useAuth();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
            {/* Official Brand Logo */}
            <Link to="/" className="flex items-center flex-shrink-0 group">
              <GadgetShopLogo />
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-700">
              <Link to="/" className="hover:text-[#7c3aed] transition-colors">
                Home
              </Link>
              <Link to="/products" className="hover:text-[#7c3aed] transition-colors">
                Catalog
              </Link>
              <Link to="/services" className="hover:text-[#7c3aed] transition-colors flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#7c3aed]" />
                Services & Fix
              </Link>
              <Link
                to="/swap"
                className="hover:text-[#7c3aed] transition-colors flex items-center gap-1.5 text-[#7c3aed] font-extrabold"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#7c3aed]" />
                Swap Gadget
              </Link>
              <Link to="/track" className="hover:text-[#7c3aed] transition-colors flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-slate-500" />
                Track Order
              </Link>
            </nav>

            {/* Search Trigger Button (Spotlight style) */}
            <div
              onClick={() => setSearchModalOpen(true)}
              className="flex-1 max-w-md mx-2 hidden md:flex items-center bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-full py-2 pl-4 pr-3 text-xs text-slate-400 cursor-pointer transition-all hover:border-purple-300"
            >
              <Search className="w-4 h-4 mr-2 text-[#7c3aed]" />
              <span className="flex-1">Search gadgets, brands, London Used...</span>
              <kbd className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500 shadow-2xs">
                Ctrl K
              </kbd>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                to="/account"
                className="hidden sm:flex items-center gap-2 p-1.5 text-slate-600 hover:text-[#7c3aed] transition-colors"
                title="Wishlist"
              >
                <div className="relative">
                  <Heart className="w-5 h-5" />
                  {totalWishlist > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {totalWishlist}
                    </span>
                  )}
                </div>
              </Link>

              {/* Slide-over Cart Trigger */}
              <button
                onClick={openCart}
                className="relative p-2 text-slate-700 hover:text-[#7c3aed] transition-colors flex items-center gap-1.5"
                title="Open Cart"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#7c3aed] text-white text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                      {totalItems}
                    </span>
                  )}
                </div>
              </button>

              {/* Customer Profile Avatar / Sign In */}
              {isAuthenticated && user ? (
                <Link to="/account" className="flex items-center" title="My Account">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center hover:bg-purple-700 transition-colors shadow-sm">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-bold transition-all"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 text-slate-700 hover:text-slate-900"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Field Trigger */}
          <div className="pb-3 md:hidden">
            <div
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-400 cursor-pointer"
            >
              <Search className="w-4 h-4 mr-2 text-[#7c3aed]" />
              <span>Search gadgets, London used...</span>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-4 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-bold hover:text-[#7c3aed]"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-bold hover:text-[#7c3aed]"
            >
              Products Catalog
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-bold hover:text-[#7c3aed] flex items-center gap-2"
            >
              <Wrench className="w-4 h-4 text-[#7c3aed]" />
              Services & Repair
            </Link>
            <Link
              to="/swap"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#7c3aed] font-extrabold flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Swap & Trade-In
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-bold hover:text-[#7c3aed]"
            >
              My Orders & History
            </Link>
            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-bold hover:text-[#7c3aed] flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-[#7c3aed]" />
              Track Shipment / Waybill
            </Link>
            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-bold hover:text-[#7c3aed]"
            >
              My Account
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-purple-700 font-bold hover:text-[#7c3aed] border-t border-slate-100 pt-3 flex items-center gap-1.5 text-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Management Portal
            </Link>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
