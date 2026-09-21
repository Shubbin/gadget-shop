import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench, Repeat, DollarSign, ShieldCheck, Cpu, Clock,
  CheckCircle2, ArrowRight, PhoneCall, MessageCircle, Truck, Building2, ThumbsUp
} from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-8 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Repair, Swap & Sell <br />
            <span className="text-purple-600">All in One Trusted Destination</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Whether your iPhone screen is cracked, you want to trade in your Samsung for a MacBook,
            or you need instant cash for an old PlayStation, our certified technicians have you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wrench className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">Original Parts • 90-Day Warranty</span>
                <h2 className="text-2xl font-bold text-gray-900">Device Repairs & Fixes</h2>
                <p className="text-xs text-gray-500 leading-relaxed">Fix cracked AMOLED screens, dying batteries, charging ports, speaker issues, and board-level micro-soldering with genuine replacement parts.</p>
              </div>
              <ul className="space-y-2 text-xs text-gray-600 pt-2 border-t border-purple-50">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />Screen replacement in under 45 minutes</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />Free diagnostic check before any work</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />Doorstep pickup or Ikeja/Abuja walk-in</li>
              </ul>
            </div>
            <div className="pt-6">
              <Link to="/services/repair" className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition-all">
                Diagnose & Book Repair <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-b from-purple-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-purple-600/20 rounded-full blur-2xl"></div>
            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform backdrop-blur-sm">
                <Repeat className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-300/30">Popular Upgrade Option</span>
                <h2 className="text-2xl font-bold text-white">Gadget Swap (Trade-In)</h2>
                <p className="text-xs text-purple-200 leading-relaxed">Exchange your current phone, laptop, or console for any brand new or London Used device. Compute the exact difference and upgrade today.</p>
              </div>
              <ul className="space-y-2 text-xs text-purple-200 pt-2 border-t border-purple-800">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />Instant valuation calculator online</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />Same-day handover & warranty transfer</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />Accepts cracked or used units</li>
              </ul>
            </div>
            <div className="pt-6 relative z-10">
              <Link to="/swap" className="w-full py-3.5 bg-white text-purple-900 hover:bg-purple-50 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all">
                Launch Swap Calculator <ArrowRight className="w-4 h-4 text-purple-900" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Instant Bank Wire Payout</span>
                <h2 className="text-2xl font-bold text-gray-900">Sell for Instant Cash</h2>
                <p className="text-xs text-gray-500 leading-relaxed">Don't want to buy anything? Cash out immediately. We buy London Used and Nigerian Used electronics at fair market value with zero delays.</p>
              </div>
              <ul className="space-y-2 text-xs text-gray-600 pt-2 border-t border-purple-50">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />Direct bank transfer in under 15 minutes</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />Free doorstep pickup across Lagos</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />No buyer haggling or marketplace scams</li>
              </ul>
            </div>
            <div className="pt-6">
              <Link to="/services/sell" className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition-all">
                Get Cash Valuation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: ShieldCheck, title: 'Certified Engineers', desc: 'Apple & Android micro-soldering certified.' },
              { icon: Clock, title: 'Rapid Turnaround', desc: 'Most screen & battery repairs completed in 45m.' },
              { icon: ThumbsUp, title: '90-Day Warranty', desc: 'Full warranty coverage on replaced components.' },
              { icon: MessageCircle, title: 'Live WhatsApp Desk', desc: 'Direct consultation with lead technician.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">{title}</h4>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
