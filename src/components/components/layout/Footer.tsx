import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Headphones, RotateCcw } from 'lucide-react';
import GadgetShopLogo from '@/components/components/ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-[#1e0836] text-slate-400 text-sm mt-16 border-t border-purple-950">
      {/* Trust Highlights */}
      <div className="border-b border-purple-950/80 bg-[#120422] py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-950/60 text-purple-400 flex items-center justify-center flex-shrink-0 border border-purple-900/40">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs font-bold">Free Delivery</h4>
              <p className="text-xs text-slate-400">On all orders over ₦50,000</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-950/60 text-purple-400 flex items-center justify-center flex-shrink-0 border border-purple-900/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs font-bold">Tested & Warrantied</h4>
              <p className="text-xs text-slate-400">90-day guarantee on all devices</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-950/60 text-purple-400 flex items-center justify-center flex-shrink-0 border border-purple-900/40">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs font-bold">WhatsApp Direct Desk</h4>
              <p className="text-xs text-slate-400">Live support & technician chat</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-950/60 text-purple-400 flex items-center justify-center flex-shrink-0 border border-purple-900/40">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs font-bold">Swap & Buyouts</h4>
              <p className="text-xs text-slate-400">Trade-in or instant cash payout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="inline-block mb-4">
            <GadgetShopLogo isDark={true} />
          </Link>
          <p className="text-xs leading-relaxed text-slate-400">
            Gadget Shop is Nigeria's premier destination for genuine smartphones, laptops, gaming consoles, certified device repairs, and instant trade-in upgrades.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/products" className="hover:text-white transition-colors">All Products Catalog</Link></li>
            <li><Link to="/swap" className="hover:text-white transition-colors">Swap & Trade-In</Link></li>
            <li><Link to="/services/repair" className="hover:text-white transition-colors">Book Device Repair</Link></li>
            <li><Link to="/services/sell" className="hover:text-white transition-colors">Sell Gadget for Cash</Link></li>
            <li><Link to="/orders" className="hover:text-white transition-colors">Track Your Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Customer Care</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/account" className="hover:text-white transition-colors">My Account</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
            <li><Link to="/compare" className="hover:text-white transition-colors">Device Comparison</Link></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Warranty & Return Policy</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Store Locations</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-2">
            Flagship Center: 12 Freedom Street, Computer Village, Ikeja, Lagos State
          </p>
          <p className="text-xs text-slate-400 mb-1">Abuja Hub: Suite 12, Wuse 2 Commercial Plaza, Abuja</p>
          <p className="text-xs text-slate-400">Email: support@gadgetshop.ng</p>
          <p className="text-xs text-slate-400">Phone: +234 801 234 5678</p>
        </div>
      </div>

      <div className="border-t border-purple-950 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Gadget Shop Nigeria. All rights reserved.
      </div>
    </footer>
  );
}
