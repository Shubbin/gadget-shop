import React, { useState, useMemo } from 'react';

import { Link } from 'react-router-dom';
import {
  Repeat,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Smartphone,
  Sparkles,
  MessageCircle,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Product } from '@/types';
import { formatNGN } from '@/data/products';

interface PresetDevice {
  name: string;
  category: string;
  baseValuation: number;
}

const COMMON_TRADE_IN_DEVICES: PresetDevice[] = [
  { name: 'iPhone 11 (64GB/128GB)', category: 'Smartphones', baseValuation: 220000 },
  { name: 'iPhone 12 (128GB)', category: 'Smartphones', baseValuation: 310000 },
  { name: 'iPhone 12 Pro Max (128GB)', category: 'Smartphones', baseValuation: 450000 },
  { name: 'iPhone 13 (128GB)', category: 'Smartphones', baseValuation: 460000 },
  { name: 'iPhone 13 Pro Max (256GB)', category: 'Smartphones', baseValuation: 620000 },
  { name: 'iPhone 14 Pro (128GB)', category: 'Smartphones', baseValuation: 720000 },
  { name: 'Samsung Galaxy S21 Ultra (128GB)', category: 'Smartphones', baseValuation: 330000 },
  { name: 'Samsung Galaxy S22 Ultra (256GB)', category: 'Smartphones', baseValuation: 480000 },
  { name: 'Samsung Galaxy S23 Ultra (256GB)', category: 'Smartphones', baseValuation: 700000 },
  { name: 'MacBook Air M1 2020 (8GB/256GB)', category: 'Laptops', baseValuation: 420000 },
  { name: 'MacBook Pro M1 2020 (16GB/512GB)', category: 'Laptops', baseValuation: 650000 },
  { name: 'PlayStation 4 Pro (1TB)', category: 'Gaming', baseValuation: 210000 },
];

const CONDITIONS = [
  {
    id: 'pristine',
    label: 'Brand New / Flawless (10/10)',
    description: 'No scratches, 90%+ battery, all sensors and FaceID/TouchID 100% operational.',
    multiplier: 1.0,
  },
  {
    id: 'london_used',
    label: 'London Used / Clean (8.5 - 9.5/10)',
    description: 'Minor invisible micro-hairlines, original screen, everything 100% working.',
    multiplier: 0.88,
  },
  {
    id: 'fairly_used',
    label: 'Nigerian Used / Good (7 - 8/10)',
    description: 'Noticeable signs of usage, light body scuffs, fully functional hardware.',
    multiplier: 0.72,
  },
  {
    id: 'flawed',
    label: 'Cracked Glass / Minor Fault',
    description: 'Back glass cracked or screen glass chipped, but display and touch still work.',
    multiplier: 0.50,
  },
];

export default function SwapCalculator() {
  const { products, addServiceRequest } = useAdmin();

  // Current Device State
  const [selectedPreset, setSelectedPreset] = useState<string>(COMMON_TRADE_IN_DEVICES[4].name);
  const [isCustomDevice, setIsCustomDevice] = useState(false);
  const [customDeviceName, setCustomDeviceName] = useState('');
  const [customBaseEstimate, setCustomBaseEstimate] = useState<number>(300000);
  const [conditionId, setConditionId] = useState<string>('london_used');
  const [currentStorage, setCurrentStorage] = useState('128GB');

  // Desired Target Device State
  const [targetProductId, setTargetProductId] = useState<string>(
    products[0]?.id || 'stx-iphone-15-pro-max'
  );

  // Submission Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [serviceMethod, setServiceMethod] = useState<'doorstep' | 'walkin'>('walkin');
  const [swapSubmitted, setSwapSubmitted] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState('');

  // Selected Target Product Object
  const targetProduct = useMemo(() => {
    return products.find((p) => p.id === targetProductId) || products[0];
  }, [products, targetProductId]);

  // Compute Current Device Value
  const estimatedCurrentValue = useMemo(() => {
    let base = 0;
    if (isCustomDevice) {
      base = customBaseEstimate || 0;
    } else {
      const preset = COMMON_TRADE_IN_DEVICES.find((d) => d.name === selectedPreset);
      base = preset ? preset.baseValuation : 300000;
    }

    const cond = CONDITIONS.find((c) => c.id === conditionId) || CONDITIONS[1];
    return Math.round(base * cond.multiplier);
  }, [isCustomDevice, customDeviceName, customBaseEstimate, selectedPreset, conditionId]);

  // Price Difference
  const targetPrice = targetProduct?.price || 0;
  const priceDifference = targetPrice - estimatedCurrentValue;
  const isPayMore = priceDifference > 0;

  const handleSwapSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    const deviceName = isCustomDevice ? customDeviceName : selectedPreset;
    const condObj = CONDITIONS.find((c) => c.id === conditionId);

    const newId = addServiceRequest({
      type: 'swap',
      customerName,
      customerPhone,
      customerEmail: customerEmail || 'unspecified@gadgetshop.ng',
      deviceCategory: 'Smartphones',
      deviceModel: `${deviceName} (${currentStorage})`,
      deviceCondition: condObj ? condObj.label : conditionId,
      desiredGadget: targetProduct ? `${targetProduct.name} (₦${targetProduct.price.toLocaleString()})` : 'Target Product',
      estimatedQuote: Math.abs(priceDifference),
      serviceMethod,
      notes: `Estimated valuation: ₦${estimatedCurrentValue.toLocaleString()}. Target gadget: ${targetProduct?.name}. Calculated Difference: ${isPayMore ? 'Customer pays' : 'Customer receives'} ₦${Math.abs(priceDifference).toLocaleString()}`,
    });

    setSubmittedRequestId(newId);
    setSwapSubmitted(true);
  };

  const currentDeviceDisplay = isCustomDevice ? customDeviceName || 'Custom Device' : selectedPreset;

  return (
    <div className="bg-white rounded-3xl border border-purple-100 shadow-xl overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-950 p-6 md:p-8 text-white relative">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Gadget Swap Calculator
          </h2>
          <p className="text-purple-200 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Turn your old device into cash credit towards any brand new or London-used gadget in our store. Real-time valuation with no hidden fees.
          </p>
        </div>
      </div>

      {swapSubmitted ? (
        <div className="p-8 md:p-12 text-center max-w-lg mx-auto space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-wider uppercase text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Reference #{submittedRequestId}
            </span>
            <h3 className="text-2xl font-black text-gray-900">Swap Application Submitted!</h3>
            <p className="text-sm text-gray-600">
              Thank you, <strong className="text-gray-900">{customerName}</strong>! Our technician team has received your swap proposal.
            </p>
          </div>

          <div className="bg-purple-50/60 p-5 rounded-2xl border border-purple-100 text-left text-xs space-y-2">
            <div className="flex justify-between py-1 border-b border-purple-100">
              <span className="text-gray-500">Your Current Device:</span>
              <span className="font-semibold text-gray-800">{currentDeviceDisplay}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-purple-100">
              <span className="text-gray-500">Estimated Trade-in Credit:</span>
              <span className="font-bold text-emerald-600">{formatNGN(estimatedCurrentValue)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-purple-100">
              <span className="text-gray-500">Target Upgrade:</span>
              <span className="font-semibold text-purple-900">{targetProduct?.name}</span>
            </div>
            <div className="flex justify-between py-1 pt-2 font-bold text-sm">
              <span className="text-gray-800">
                {isPayMore ? 'Balance to Pay:' : 'Balance We Pay You:'}
              </span>
              <span className="text-purple-700">{formatNGN(Math.abs(priceDifference))}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/2348000000000?text=Hello%20Gadget%20Shop,%20I%20just%20submitted%20Swap%20Request%20%23${submittedRequestId}%20to%20swap%20my%20${encodeURIComponent(currentDeviceDisplay)}%20for%20${encodeURIComponent(targetProduct?.name || '')}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Direct WhatsApp Follow-Up
            </a>
            <button
              onClick={() => setSwapSubmitted(false)}
              className="py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors"
            >
              Calculate Another
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Your Current Device */}
            <div className="space-y-6 bg-purple-50/40 p-6 rounded-2xl border border-purple-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <h3 className="font-bold text-gray-900">What Device Do You Have?</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCustomDevice(!isCustomDevice)}
                  className="text-xs font-semibold text-purple-700 hover:text-purple-800 underline"
                >
                  {isCustomDevice ? 'Select from Popular List' : 'Device not listed? Enter manually'}
                </button>
              </div>

              {!isCustomDevice ? (
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">
                    Select Your Current Device Model
                  </label>
                  <select
                    value={selectedPreset}
                    onChange={(e) => setSelectedPreset(e.target.value)}
                    className="w-full p-3.5 bg-white border border-purple-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all shadow-sm"
                  >
                    {COMMON_TRADE_IN_DEVICES.map((dev) => (
                      <option key={dev.name} value={dev.name}>
                        {dev.name} — Base ~{formatNGN(dev.baseValuation)}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      Type Your Device Brand & Exact Model
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Google Pixel 7 Pro or HP Envy x360"
                      value={customDeviceName}
                      onChange={(e) => setCustomDeviceName(e.target.value)}
                      className="w-full p-3.5 bg-white border border-purple-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      Your Initial Value Estimate (₦)
                    </label>
                    <input
                      type="number"
                      value={customBaseEstimate}
                      onChange={(e) => setCustomBaseEstimate(Number(e.target.value))}
                      className="w-full p-3 bg-white border border-purple-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
              )}

              {/* Storage Capacity Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">
                  Storage Capacity
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['64GB', '128GB', '256GB', '512GB / 1TB'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setCurrentStorage(st)}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                        currentStorage === st
                          ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Physical Condition Tier */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">
                  Physical & Operational Condition
                </label>
                <div className="space-y-2">
                  {CONDITIONS.map((cond) => (
                    <label
                      key={cond.id}
                      onClick={() => setConditionId(cond.id)}
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                        conditionId === cond.id
                          ? 'bg-purple-50 border-purple-600 shadow-sm'
                          : 'bg-white border-gray-200 hover:border-purple-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="conditionTier"
                        checked={conditionId === cond.id}
                        onChange={() => setConditionId(cond.id)}
                        className="mt-1 text-purple-600 focus:ring-purple-500"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-gray-900">{cond.label}</div>
                        <div className="text-gray-500 mt-0.5">{cond.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Trade-In Credit Callout */}
              <div className="p-4 bg-purple-100/70 rounded-2xl border border-purple-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800 block">
                    Estimated Trade-in Credit
                  </span>
                  <span className="text-xs text-purple-900">
                    Applicable immediately on any gadget
                  </span>
                </div>
                <div className="text-xl font-black text-purple-900">
                  {formatNGN(estimatedCurrentValue)}
                </div>
              </div>
            </div>

            {/* Right: Desired Upgrade Target */}
            <div className="space-y-6 bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <h3 className="font-bold text-gray-900">What Gadget Do You Want to Upgrade To?</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">
                  Select Upgrade from Our Store Inventory
                </label>
                <select
                  value={targetProductId}
                  onChange={(e) => setTargetProductId(e.target.value)}
                  className="w-full p-3.5 bg-white border border-purple-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.condition || 'London Used'}) — {formatNGN(p.price)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Gadget Preview Card */}
              {targetProduct && (
                <div className="p-4 rounded-2xl border border-purple-100 bg-purple-50/30 flex gap-4 items-center">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-purple-100">
                    <img src={targetProduct.image} alt={targetProduct.name} className="object-contain p-2 w-full h-full" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider bg-purple-100 px-2 py-0.5 rounded-full">
                      {targetProduct.category}
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm">{targetProduct.name}</h4>
                    <div className="text-base font-extrabold text-purple-900">
                      {formatNGN(targetProduct.price)}
                    </div>
                  </div>
                </div>
              )}

              {/* Real-time Math Difference Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950 to-indigo-950 text-white space-y-3 shadow-lg shadow-purple-950/20">
                <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Calculated Swap Balance
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-purple-200">
                    {isPayMore ? 'You Only Pay Difference:' : 'We Pay You Cash Difference:'}
                  </span>
                  <span className="text-2xl md:text-3xl font-black text-amber-300">
                    {formatNGN(Math.abs(priceDifference))}
                  </span>
                </div>
                <p className="text-[11px] text-purple-300 border-t border-purple-800 pt-2">
                  * Final value subject to standard physical verification at our Lagos/Abuja experience centers or upon doorstep dispatch.
                </p>
              </div>

              {/* Contact & Confirmation Form */}
              <form onSubmit={handleSwapSubmit} className="space-y-4 pt-2">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  3. Enter Details to Reserve Your Swap
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Babatunde Fashola"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">WhatsApp / Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+234 800 000 0000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Preferred Swap Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setServiceMethod('walkin')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        serviceMethod === 'walkin'
                          ? 'bg-purple-50 border-purple-600 text-purple-900'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-purple-200'
                      }`}
                    >
                      🏬 Walk-in to Store (Ikeja / Wuse)
                    </button>
                    <button
                      type="button"
                      onClick={() => setServiceMethod('doorstep')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        serviceMethod === 'doorstep'
                          ? 'bg-purple-50 border-purple-600 text-purple-900'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-purple-200'
                      }`}
                    >
                      🛵 Doorstep Pickup & Swap (Lagos)
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Repeat className="w-4 h-4" />
                  Lock In Trade-In & Reserve Target Device
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
