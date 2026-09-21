import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, Package, ShoppingCart, Wrench, Users, ArrowUpRight,
  ChevronRight, Plus, CreditCard, AlertTriangle, Clock, Tag, Settings,
  Building2, CheckCircle2, ShieldCheck, DollarSign
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { formatNGN } from '@/data/products';

export default function AdminDashboardPage() {
  const { products, orders, services, customers, payments, updateOrderStatus } = useAdmin();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const availableGadgets = products.filter((p) => p.stockStatus !== 'sold' && p.inStock).length;
  const soldGadgets = products.filter((p) => p.stockStatus === 'sold').length;
  const pendingRepairs = services.filter((s) => s.status === 'pending').length;
  const processingOrders = orders.filter((o) => o.status === 'Processing').length;

  // Payments Telemetry
  const pendingPayments = payments.filter((p) => p.status === 'pending_verification');
  const successfulPayments = payments.filter((p) => p.status === 'successful');
  const netSettled = successfulPayments.reduce((s, p) => s + p.net, 0);

  // Low stock items
  const lowStockItems = products.filter(
    (p) => (p.stockQuantity !== undefined && p.stockQuantity <= 2 && p.stockQuantity > 0) || p.id.includes('macbook')
  );

  const recentOrders = orders.slice(0, 4);
  const recentPayments = payments.slice(0, 4);
  const recentServices = services.slice(0, 3);

  const WEEKLY_DATA = [
    { day: 'Mon', revenue: 820000, height: '42%' },
    { day: 'Tue', revenue: 1150000, height: '60%' },
    { day: 'Wed', revenue: 940000, height: '48%' },
    { day: 'Thu', revenue: 1420000, height: '72%' },
    { day: 'Fri', revenue: 1800000, height: '92%' },
    { day: 'Sat', revenue: 1650000, height: '84%' },
    { day: 'Sun', revenue: 1200000, height: '62%' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Operations Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Executive Operations Hub</h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time control center for payments, waybills, device serials, and customer services.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/payments"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#7c3aed]" /> Payment Tracklet
          </Link>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg shadow-purple-900/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Upload Device
          </Link>
        </div>
      </div>

      {/* Action Banners for Unverified Payments & Low Stock */}
      {(pendingPayments.length > 0 || lowStockItems.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingPayments.length > 0 && (
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-black text-amber-900">
                    {pendingPayments.length} Bank Transfer Verification Needed
                  </div>
                  <div className="text-[11px] text-amber-700 mt-0.5">
                    Customer transfer receipts awaiting account credit verification.
                  </div>
                </div>
              </div>
              <Link
                to="/admin/payments"
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
              >
                Review &rarr;
              </Link>
            </div>
          )}

          {lowStockItems.length > 0 && (
            <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <div className="text-xs font-black text-rose-900">
                    {lowStockItems.length} Low Stock Gadgets
                  </div>
                  <div className="text-[11px] text-rose-700 mt-0.5">
                    Inventory threshold warning (&le; 2 units left in stock).
                  </div>
                </div>
              </div>
              <Link
                to="/admin/products"
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
              >
                Restock &rarr;
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Net Settled Revenue',
            value: formatNGN(netSettled),
            sub: '+18.4% vs last period',
            subColor: 'text-emerald-700',
            icon: DollarSign,
            iconBg: 'bg-purple-50',
            iconColor: 'text-[#7c3aed]',
          },
          {
            label: 'Total Orders',
            value: orders.length,
            sub: `${processingOrders} pending fulfillment`,
            subColor: 'text-slate-500',
            icon: ShoppingCart,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
          },
          {
            label: 'In Stock Catalog',
            value: `${availableGadgets} / ${products.length}`,
            sub: `${soldGadgets} marked SOLD`,
            subColor: 'text-slate-500',
            icon: Package,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
          },
          {
            label: 'Service Tickets',
            value: services.length,
            sub: `${pendingRepairs} pending evaluations`,
            subColor: 'text-amber-700',
            icon: Wrench,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600',
          },
        ].map(({ label, value, sub, subColor, icon: Icon, iconBg, iconColor }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
              <div className={`w-8 h-8 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
              <div className={`text-[11px] ${subColor} font-semibold flex items-center gap-1 mt-1`}>
                {label === 'Net Settled Revenue' && <ArrowUpRight className="w-3.5 h-3.5" />}
                {sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue & Inflow Trends */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900">Revenue &amp; Payment Inflow</h3>
            <p className="text-xs text-slate-500">Gross transaction values cleared over the past 7 days</p>
          </div>
          <Link to="/admin/payments" className="text-xs text-[#7c3aed] font-bold hover:underline flex items-center gap-1">
            Ledger Details &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-6 h-44 items-end border-b border-slate-100 pb-2">
          {WEEKLY_DATA.map((bar, i) => (
            <div key={bar.day} className="flex flex-col items-center gap-2 group h-full justify-end">
              <div className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-[#7c3aed] transition-colors">
                ₦{(bar.revenue / 1000).toFixed(0)}k
              </div>
              <div
                className={`w-full rounded-t-lg transition-all duration-300 ${
                  i === 4 ? 'bg-[#7c3aed] shadow-md shadow-purple-950/20' : 'bg-slate-200 group-hover:bg-purple-300'
                }`}
                style={{ height: bar.height }}
              />
              <span className="text-[11px] font-bold text-slate-600">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders & Payments Ledger Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
            </div>
            <Link to="/admin/orders" className="text-xs font-semibold text-[#7c3aed] hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">#{order.id}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700'
                          : order.status === 'Processing'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-purple-50 text-purple-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {order.delivery?.address?.fullName} &bull; {order.items.length} item(s)
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-slate-900">{formatNGN(order.total)}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{order.paymentMethod}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments Ledger */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#7c3aed]" />
              <h3 className="text-sm font-bold text-slate-900">Recent Payment Transactions</h3>
            </div>
            <Link to="/admin/payments" className="text-xs font-semibold text-[#7c3aed] hover:underline flex items-center gap-1">
              Full Ledger <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentPayments.map((pay) => (
              <div key={pay.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 truncate">{pay.transactionRef}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        pay.status === 'successful'
                          ? 'bg-emerald-50 text-emerald-700'
                          : pay.status === 'pending_verification'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {pay.status === 'pending_verification' ? 'Pending Check' : pay.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {pay.customerName} &bull; {pay.channel}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-black text-slate-900">{formatNGN(pay.amount)}</div>
                  <div className="text-[10px] text-slate-400">{pay.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
