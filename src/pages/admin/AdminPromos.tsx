import React, { useState } from 'react';
import {
  Tag, Plus, ToggleLeft, ToggleRight, Trash2, Calendar, CheckCircle2,
  Percent, DollarSign, Megaphone, Save, Eye, X, AlertCircle
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { PromoCode } from '@/types';
import { formatNGN } from '@/data/products';

export default function AdminPromosPage() {
  const { promoCodes, addPromoCode, togglePromoCode, deletePromoCode, announcement, updateAnnouncement } = useAdmin();

  // Banner State
  const [bannerEnabled, setBannerEnabled] = useState(announcement.enabled);
  const [bannerMessage, setBannerMessage] = useState(announcement.message);
  const [bannerLinkText, setBannerLinkText] = useState(announcement.linkText || 'Shop Deals');
  const [bannerLinkUrl, setBannerLinkUrl] = useState(announcement.linkUrl || '/products');
  const [bannerSaved, setBannerSaved] = useState(false);

  // New Promo Modal State
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minSpend, setMinSpend] = useState(100000);
  const [maxUses, setMaxUses] = useState(100);
  const [expiresAt, setExpiresAt] = useState('2026-12-31');
  const [description, setDescription] = useState('');

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    updateAnnouncement({
      enabled: bannerEnabled,
      message: bannerMessage,
      linkText: bannerLinkText,
      linkUrl: bannerLinkUrl,
    });
    setBannerSaved(true);
    setTimeout(() => setBannerSaved(false), 3000);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addPromoCode({
      code: code.trim().toUpperCase(),
      discountType,
      value: Number(discountValue),
      minOrderAmount: Number(minSpend),
      maxUses: Number(maxUses),
      active: true,
      expiresAt,
      description,
    });

    setShowModal(false);
    setCode('');
    setDescription('');
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Promotions &amp; Marketing Banners</h1>
          <p className="text-xs text-slate-500 mt-1">
            Create discount vouchers, promo codes, and manage the live storefront announcement bar.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-purple-900/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Promo Code
        </button>
      </div>

      {/* Storefront Announcement Bar Controller */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#7c3aed] flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Live Storefront Announcement Bar</h2>
              <p className="text-[11px] text-slate-500">Visible across the top header of the customer store.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setBannerEnabled(!bannerEnabled)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer"
          >
            <span>{bannerEnabled ? 'Enabled' : 'Disabled'}</span>
            {bannerEnabled ? (
              <ToggleRight className="w-6 h-6 text-[#7c3aed]" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-slate-400" />
            )}
          </button>
        </div>

        {/* Live Preview Box */}
        {bannerEnabled && (
          <div className="bg-[#7c3aed] text-white p-3 rounded-xl text-xs flex items-center justify-between shadow-inner">
            <div className="truncate flex-1 font-medium mr-4">
              {bannerMessage || 'Announcement message preview here...'}
            </div>
            {bannerLinkText && (
              <span className="text-[11px] font-bold bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg shrink-0">
                {bannerLinkText} →
              </span>
            )}
          </div>
        )}

        <form onSubmit={handleSaveBanner} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Banner Announcement Text</label>
            <input
              type="text"
              value={bannerMessage}
              onChange={(e) => setBannerMessage(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
              placeholder="e.g. 🔥 Flash Sale: 10% OFF all MacBooks this weekend only!"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Action Button Text</label>
              <input
                type="text"
                value={bannerLinkText}
                onChange={(e) => setBannerLinkText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Action Destination URL</label>
              <input
                type="text"
                value={bannerLinkUrl}
                onChange={(e) => setBannerLinkUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] text-emerald-600 font-semibold">
              {bannerSaved && '✓ Banner settings updated successfully!'}
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Announcement
            </button>
          </div>
        </form>
      </div>

      {/* Promo Codes Engine */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#7c3aed]" /> Active Promo &amp; Voucher Codes
          </h2>
          <span className="text-xs text-slate-500">{promoCodes.length} vouchers configured</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {promoCodes.map((promo) => (
            <div
              key={promo.id}
              className={`bg-white rounded-2xl border p-5 space-y-4 transition-all ${
                promo.active ? 'border-purple-200 shadow-sm' : 'border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="px-3 py-1 bg-purple-50 text-[#7c3aed] border border-purple-200 font-mono font-black text-sm rounded-xl tracking-wider">
                  {promo.code}
                </div>
                <button
                  onClick={() => togglePromoCode(promo.id)}
                  title="Toggle Active"
                  className="cursor-pointer"
                >
                  {promo.active ? (
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      Paused
                    </span>
                  )}
                </button>
              </div>

              <div>
                <div className="text-xl font-black text-slate-900">
                  {promo.discountType === 'percentage' ? `${promo.value}% OFF` : `${formatNGN(promo.value)} OFF`}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{promo.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Min. Order:</span>
                  <span className="font-semibold text-slate-800">{formatNGN(promo.minOrderAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Redemptions:</span>
                  <span className="font-semibold text-slate-800">{promo.usesCount} / {promo.maxUses}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expires:</span>
                  <span className="font-medium text-slate-500">{promo.expiresAt}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => deletePromoCode(promo.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Promo Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#7c3aed]" /> New Discount Voucher
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Coupon Code (e.g. APPLEPROMO)</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="GADGETDEAL"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₦)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Value {discountType === 'percentage' ? '(%)' : '(₦)'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Min. Order Spend (₦)</label>
                  <input
                    type="number"
                    required
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Max Redemptions</label>
                  <input
                    type="number"
                    required
                    value={maxUses}
                    onChange={(e) => setMaxUses(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Expiration Date</label>
                <input
                  type="date"
                  required
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description / Customer Label</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 10% off smartphones for Easter sale"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Save Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
