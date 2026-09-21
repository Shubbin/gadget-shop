import React, { useState } from 'react';
import {
  Search, Users, Phone, Mail, MapPin, ShoppingBag, Calendar,
  MessageCircle, ExternalLink, ShieldCheck, X, ChevronRight, Star
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Customer, Order } from '@/types';
import { formatNGN } from '@/data/products';

export default function AdminCustomersPage() {
  const { customers, orders } = useAdmin();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.address?.city?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer CRM &amp; Direct WhatsApp</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse registered customer profiles, lifetime spend (LTV), purchase history, and initiate direct communication.
          </p>
        </div>
        <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg">
          {customers.length} Registered Accounts
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, email, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-xs text-slate-400">{search ? 'No customers match your search.' : 'No registered customers yet.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => {
            const customerOrders = orders.filter(
              (o) =>
                o.customerEmail === customer.email ||
                o.customerPhone === customer.phone ||
                o.delivery?.address?.email === customer.email
            );
            const totalSpend = customer.totalSpent || customerOrders.reduce((s, o) => s + (o.total || 0), 0);
            const initials = (customer.name || 'U')
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase();

            const isVip = totalSpend > 1500000;

            return (
              <div
                key={customer.id || customer.email}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 hover:border-purple-200 transition-all shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center flex-shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-sm truncate">{customer.name || 'Unknown'}</div>
                        <div className="text-[11px] text-slate-400 truncate">{customer.email}</div>
                      </div>
                    </div>
                    {isVip && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> VIP
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    {customer.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{customer.phone}</span>
                      </div>
                    )}
                    {customer.address?.city && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{customer.address.city}, {customer.address.state}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Customer since {customer.createdAt?.slice(0, 10) || '2026-01-15'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="bg-purple-50/60 rounded-xl p-2.5">
                      <div className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider">Orders Placed</div>
                      <div className="font-black text-purple-900 text-base mt-0.5">
                        {customer.ordersCount || customerOrders.length || 1}
                      </div>
                    </div>
                    <div className="bg-emerald-50/60 rounded-xl p-2.5">
                      <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Lifetime LTV</div>
                      <div className="font-black text-emerald-800 text-xs mt-0.5">{formatNGN(totalSpend)}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => setSelectedCustomer(customer)}
                    className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Order History
                  </button>
                  <a
                    href={`https://wa.me/${(customer.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hello ${customer.name}, thank you for choosing GadgetShop! How may we assist you today?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Customer 360 Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedCustomer.name}&apos;s Account History</h3>
                <p className="text-[11px] text-slate-400">{selectedCustomer.email}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1">
                <div className="text-slate-500 font-semibold">Registered Shipping Address:</div>
                <div className="text-slate-800">
                  {selectedCustomer.address?.fullName}<br />
                  {selectedCustomer.address?.address}<br />
                  {selectedCustomer.address?.city}, {selectedCustomer.address?.state}
                </div>
                <div className="font-mono text-[#7c3aed] pt-1">{selectedCustomer.phone}</div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-800">Associated Orders</div>
                {orders.slice(0, 3).map((ord) => (
                  <div key={ord.id} className="p-3 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-slate-900">#{ord.id}</div>
                      <div className="text-[11px] text-slate-400">{ord.date} &middot; {ord.status}</div>
                    </div>
                    <div className="font-black text-slate-900">{formatNGN(ord.total)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
