import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  isDark?: boolean;
}

export default function GadgetShopLogo({ className = "h-9 w-auto", isDark = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none font-sans ${className}`}>
      {/* Sleek Tech Brand Icon */}
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6d28d9] via-[#7c3aed] to-[#a855f7] flex items-center justify-center shadow-md shadow-purple-600/25 shrink-0 group-hover:scale-105 transition-transform">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white"
        >
          {/* Tech device frame + lightning power curve */}
          <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
          <path d="M12 18h.01" />
          <path d="M10 8l4 3-2 1 3 3" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center">
          <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Gadget
          </span>
          <span className="text-xl font-black tracking-tight text-[#7c3aed]">
            Shop
          </span>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
          Tech & Services
        </span>
      </div>
    </div>
  );
}
