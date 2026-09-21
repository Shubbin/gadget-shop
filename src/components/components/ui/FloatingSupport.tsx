import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Wrench, RefreshCw, PackageCheck, ShieldCheck, X, Sparkles, ChevronUp } from 'lucide-react';

export default function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false);

  const WHATSAPP_NUMBER = '2348012345678';
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hello Gadget Shop! I would like to make an inquiry regarding buying, repairing, or swapping a gadget.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Expanded Menu */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white/95 backdrop-blur-md rounded-2xl border border-purple-200 shadow-2xl p-3 space-y-1.5 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#7c3aed]" />
              <span className="text-xs font-extrabold text-slate-900">Gadget Quick Hub</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live Online
            </span>
          </div>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Chat on WhatsApp</div>
              <div className="text-[10px] text-slate-400">Instant technician support</div>
            </div>
          </a>

          <Link
            to="/services/repair"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-[#7c3aed] transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#7c3aed] text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Book Device Repair</div>
              <div className="text-[10px] text-slate-400">Screen, battery & fix diagnostic</div>
            </div>
          </Link>

          <Link
            to="/swap"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-[#7c3aed] transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1e0836] text-purple-300 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Swap & Trade-In</div>
              <div className="text-[10px] text-slate-400">Calculate upgrade difference</div>
            </div>
          </Link>

          <Link
            to="/orders"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Track An Order</div>
              <div className="text-[10px] text-slate-400">Live courier progression</div>
            </div>
          </Link>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] px-2 text-slate-400">
            <Link to="/admin" className="hover:text-[#7c3aed] font-medium">
              Admin Portal
            </Link>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3 h-3 text-[#7c3aed]" /> Verified Techs
            </span>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-xl shadow-purple-950/40 flex items-center justify-center transition-all hover:scale-105 active:scale-95 group relative"
        aria-label="Quick Actions and Support"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-pulse" />
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
      </button>
    </div>
  );
}
