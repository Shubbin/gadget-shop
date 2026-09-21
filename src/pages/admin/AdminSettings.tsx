import React, { useState } from 'react';
import {
  Settings, Truck, Building2, Store, Save, CheckCircle2,
  Edit2, MapPin, Phone, Mail, Clock, Shield, Plus
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { DeliveryZone, StoreBankAccount } from '@/types';
import { formatNGN } from '@/data/products';

export default function AdminSettingsPage() {
  const { deliveryZones, updateDeliveryZone, bankAccounts, updateBankAccount } = useAdmin();

  const [savedNotice, setSavedNotice] = useState('');
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [editingBank, setEditingBank] = useState<StoreBankAccount | null>(null);

  // Store profile mock states
  const [storeName, setStoreName] = useState('GadgetShop HQ');
  const [storeAddress, setStoreAddress] = useState('12 Freedom Way, Computer Village, Ikeja, Lagos');
  const [storePhone, setStorePhone] = useState('+234 800 423 4387');
  const [storeEmail, setStoreEmail] = useState('support@gadgetshop.ng');

  const triggerSaveNotice = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(''), 3000);
  };

  const handleSaveZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingZone) return;
    updateDeliveryZone(editingZone.id, {
      fee: Number(editingZone.fee),
      estimatedDays: editingZone.estimatedDays,
      active: editingZone.active,
    });
    setEditingZone(null);
    triggerSaveNotice(`Shipping rate for ${editingZone.region} updated.`);
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBank) return;
    updateBankAccount(editingBank.id, {
      bankName: editingBank.bankName,
      accountName: editingBank.accountName,
      accountNumber: editingBank.accountNumber,
      active: editingBank.active,
    });
    setEditingBank(null);
    triggerSaveNotice(`Bank account ${editingBank.bankName} updated.`);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Store Settings &amp; Operations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure delivery zones, shipping rates, customer checkout bank transfer accounts, and store contact info.
          </p>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* 1. Delivery Rates & Zones */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Regional Delivery Zones &amp; Shipping Rates</h2>
            <p className="text-[11px] text-slate-500">Configured fees applied automatically during customer checkout.</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden text-xs">
          {deliveryZones.map((zone) => (
            <div key={zone.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span>{zone.region}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({zone.state})</span>
                  {zone.active ? (
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold border border-emerald-200">Active</span>
                  ) : (
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">Inactive</span>
                  )}
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> Est: {zone.estimatedDays}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="font-black text-slate-900 text-sm">{formatNGN(zone.fee)}</div>
                <button
                  onClick={() => setEditingZone(zone)}
                  className="px-2.5 py-1 text-xs text-[#7c3aed] bg-purple-50 hover:bg-purple-100 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Edit2 className="w-3 h-3" /> Edit Rate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Direct Bank Transfer Accounts */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#7c3aed] flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Direct Bank Transfer Accounts (Manual Checkout)</h2>
            <p className="text-[11px] text-slate-500">Official company account numbers presented to customers choosing Bank Transfer payment.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bankAccounts.map((acc) => (
            <div key={acc.id} className="p-4 border border-slate-200/80 rounded-xl space-y-3 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{acc.bankName}</span>
                {acc.active ? (
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold border border-emerald-200">Active</span>
                ) : (
                  <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">Disabled</span>
                )}
              </div>
              <div className="space-y-1">
                <div className="text-[11px] text-slate-500">Account Number:</div>
                <div className="font-mono text-base font-black text-slate-900 tracking-wider">{acc.accountNumber}</div>
                <div className="text-[11px] font-medium text-slate-600 truncate">{acc.accountName}</div>
              </div>
              <div className="pt-2 border-t border-slate-200/80 flex justify-end">
                <button
                  onClick={() => setEditingBank(acc)}
                  className="text-xs text-[#7c3aed] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" /> Edit Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Physical Storefront & Contact Profiles */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Store Profile &amp; Pickup Hub Info</h2>
            <p className="text-[11px] text-slate-500">Printed on dispatch waybills and invoices.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Official Business Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Support Phone Hotline</label>
            <input
              type="text"
              value={storePhone}
              onChange={(e) => setStorePhone(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Physical Fulfillment &amp; Inspection Hub</label>
            <input
              type="text"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => triggerSaveNotice('Store profile saved successfully.')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> Save Business Info
          </button>
        </div>
      </div>

      {/* Edit Zone Modal */}
      {editingZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Update Shipping Rate: {editingZone.region}</h3>
            <form onSubmit={handleSaveZone} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Delivery Fee (₦)</label>
                <input
                  type="number"
                  required
                  value={editingZone.fee}
                  onChange={(e) => setEditingZone({ ...editingZone, fee: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Delivery Window</label>
                <input
                  type="text"
                  required
                  value={editingZone.estimatedDays}
                  onChange={(e) => setEditingZone({ ...editingZone, estimatedDays: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="zoneActive"
                  checked={editingZone.active}
                  onChange={(e) => setEditingZone({ ...editingZone, active: e.target.checked })}
                  className="rounded text-purple-600"
                />
                <label htmlFor="zoneActive" className="text-slate-700 font-semibold cursor-pointer">
                  Zone Available for Shipping
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingZone(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl font-bold"
                >
                  Save Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Bank Modal */}
      {editingBank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Update Bank Account: {editingBank.bankName}</h3>
            <form onSubmit={handleSaveBank} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  required
                  value={editingBank.bankName}
                  onChange={(e) => setEditingBank({ ...editingBank, bankName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Number (10 Digits)</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={editingBank.accountNumber}
                  onChange={(e) => setEditingBank({ ...editingBank, accountNumber: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Beneficiary Name</label>
                <input
                  type="text"
                  required
                  value={editingBank.accountName}
                  onChange={(e) => setEditingBank({ ...editingBank, accountName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="bankActive"
                  checked={editingBank.active}
                  onChange={(e) => setEditingBank({ ...editingBank, active: e.target.checked })}
                  className="rounded text-purple-600"
                />
                <label htmlFor="bankActive" className="text-slate-700 font-semibold cursor-pointer">
                  Display on Checkout Page
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBank(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl font-bold"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
