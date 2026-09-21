import React from 'react';
import { Link } from 'react-router-dom';
import { Repeat, ShieldCheck, Zap, CheckCircle2, ArrowRight, HelpCircle, Truck, Building2, BadgeCheck } from 'lucide-react';
import SwapCalculator from '@/components/components/services/SwapCalculator';

export default function SwapPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Swap Your Phone, Laptop or Console in <span className="text-purple-600">Minutes</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Upgrade seamlessly. We accept iPhones, Samsung Galaxys, MacBooks, Dell laptops, PlayStations, and iPads.
            Get high valuation credit instantly towards any device in our stock.
          </p>
        </div>

        <SwapCalculator />

        <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900">How Our Gadget Swap Works</h2>
            <p className="text-xs text-gray-500 mt-1">Zero hassle, 100% transparent pricing and guaranteed security.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: 1, title: 'Calculate & Choose', desc: 'Select your old gadget, choose its current condition, and pick any new or London Used device you desire from our inventory.' },
              { step: 2, title: 'Quick Device Inspection', desc: 'Drop by our physical store in Ikeja/Abuja or request our doorstep technician to run a 5-minute hardware and battery check.' },
              { step: 3, title: 'Pay Difference & Swap', desc: 'Pay the cash difference via transfer or card, or receive cash if downgrading, and walk away with your freshly warrantied gadget!' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-purple-600/20">{step}</div>
                <h3 className="font-bold text-gray-900 text-base">{title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BadgeCheck, bg: 'bg-emerald-50', color: 'text-emerald-600', title: 'Highest Valuations', desc: 'We offer competitive market trade-in credit.' },
            { icon: ShieldCheck, bg: 'bg-purple-50', color: 'text-purple-600', title: 'Data Privacy Guarantee', desc: 'Military-grade data wipe on all traded devices.' },
            { icon: Building2, bg: 'bg-blue-50', color: 'text-blue-600', title: 'Walk-In Centers', desc: 'Physical hub in Computer Village, Ikeja & Abuja.' },
            { icon: Truck, bg: 'bg-amber-50', color: 'text-amber-600', title: 'Doorstep Exchange', desc: 'Available across Lagos State mainland & island.' },
          ].map(({ icon: Icon, bg, color, title, desc }) => (
            <div key={title} className="p-5 bg-white rounded-2xl border border-purple-100 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}><Icon className="w-5 h-5" /></div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">{title}</h4>
                <p className="text-[11px] text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
