import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Package, Truck, CheckCircle2, Clock, MapPin, Phone,
  ArrowRight, ShieldCheck, AlertCircle, UserCheck, MessageCircle
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useOrders } from '@/context/OrderContext';
import { formatNGN } from '@/data/products';
import { Order } from '@/types';

export default function TrackOrderPage() {
  const navigate = useNavigate();
  const { orders: adminOrders } = useAdmin();
  const { orders: clientOrders } = useOrders();

  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toUpperCase();
    if (!clean) return;

    setSearched(true);
    const allOrders = [...adminOrders, ...clientOrders];
    const found = allOrders.find(
      (o) =>
        o.id.toUpperCase() === clean ||
        (o.waybillNumber && o.waybillNumber.toUpperCase() === clean) ||
        (o.delivery?.trackingNumber && o.delivery.trackingNumber.toUpperCase() === clean)
    );
    setMatchedOrder(found || null);
  };

  const statusColor = (s: string) => {
    if (s === 'Delivered') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (s === 'Out for Delivery') return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    if (s === 'Cancelled') return 'text-rose-700 bg-rose-50 border-rose-200';
    return 'text-amber-700 bg-amber-50 border-amber-200';
  };

  const steps = matchedOrder
    ? [
        { title: 'Order Registered', desc: 'Order received and logged in system', completed: true },
        {
          title: 'Payment Verification',
          desc: matchedOrder.paymentStatus === 'paid' ? 'Payment confirmed' : 'Awaiting payment verification',
          completed: matchedOrder.paymentStatus === 'paid' || matchedOrder.paymentMethod === 'card',
        },
        {
          title: 'Diagnostic Quality Inspection',
          desc: 'Hardware benchmark and pre-dispatch testing',
          completed: matchedOrder.status === 'Out for Delivery' || matchedOrder.status === 'Delivered',
        },
        {
          title: 'Dispatched with Courier',
          desc: matchedOrder.riderName ? `Assigned to ${matchedOrder.riderName}` : 'Handed to logistics courier',
          completed: matchedOrder.status === 'Out for Delivery' || matchedOrder.status === 'Delivered',
        },
        {
          title: 'Delivered',
          desc: 'Package delivered to recipient',
          completed: matchedOrder.status === 'Delivered',
        },
      ]
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Live Fulfillment Telemetry
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Track Your Order or Waybill
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your Order ID (e.g. GS-1042) or official Waybill Docket Number to inspect real-time courier status.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. GS-1042 or WB-GS-1042-819"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 uppercase font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-600/20 flex items-center gap-1.5"
          >
            Track Parcel <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Results View */}
      {searched && (
        <div className="space-y-6 pt-4">
          {!matchedOrder ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 max-w-md mx-auto">
              <Package className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-900 text-sm">No Matching Shipment Found</h3>
              <p className="text-xs text-slate-500">
                We couldn't locate any package matching "{query}". Please double-check your Order ID or contact support.
              </p>
              <a
                href="https://wa.me/2348012345678"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-1"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Contact Dispatch Hub on WhatsApp
              </a>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              {/* Order Header Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-extrabold text-slate-900">
                      Order #{matchedOrder.id}
                    </h2>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColor(matchedOrder.status)}`}>
                      {matchedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Placed on {matchedOrder.date} · Destination: {matchedOrder.delivery?.address?.city}, {matchedOrder.delivery?.address?.state}
                  </p>
                </div>

                {matchedOrder.waybillNumber && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl px-3 py-1.5 text-right">
                    <div className="text-[10px] font-bold text-purple-700 uppercase">Waybill Docket</div>
                    <div className="font-mono font-extrabold text-slate-900 text-xs">
                      {matchedOrder.waybillNumber}
                    </div>
                  </div>
                )}
              </div>

              {/* Courier Rider Banner (if assigned) */}
              {matchedOrder.riderName && (
                <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5" /> Assigned Courier Dispatch Rider
                    </div>
                    <div className="font-extrabold text-white text-sm mt-0.5">
                      {matchedOrder.riderName}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Direct Contact: {matchedOrder.riderPhone || 'Contact Ikeja Dispatch Hub'}
                    </div>
                  </div>

                  {matchedOrder.riderPhone && (
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${matchedOrder.riderPhone}`}
                        className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3 h-3" /> Call Rider
                      </a>
                      <a
                        href={`https://wa.me/${matchedOrder.riderPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(matchedOrder.riderName)},%20I'm%20tracking%20my%20Order%20%23${matchedOrder.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" /> WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Milestone Tracker */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Milestone Progress
                  </h3>
                  {matchedOrder.delivery?.estimatedDelivery && (
                    <span className="text-xs text-slate-500">
                      ETA: <span className="font-semibold text-slate-800">{matchedOrder.delivery.estimatedDelivery}</span>
                    </span>
                  )}
                </div>

                <div className="space-y-4 relative pl-6 border-l-2 border-slate-100 ml-2">
                  {steps.map((s, i) => (
                    <div key={i} className="relative">
                      <div
                        className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          s.completed ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {s.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <div className={s.completed ? 'opacity-100' : 'opacity-50'}>
                        <div className="text-xs font-bold text-slate-900">{s.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itemized Contents */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="text-xs font-bold text-slate-900">Shipment Contents</div>
                <div className="divide-y divide-slate-100">
                  {matchedOrder.items.map((it: any, i: number) => (
                    <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={it.product.image} alt={it.product.name} className="w-9 h-9 object-contain bg-slate-50 rounded-lg p-1 border border-slate-100" />
                        <div>
                          <div className="font-bold text-slate-900">{it.product.name}</div>
                          <div className="text-slate-400 text-[11px]">Qty: {it.quantity}</div>
                        </div>
                      </div>
                      <div className="font-bold text-slate-900">{formatNGN(it.product.price * it.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Details Link */}
              <div className="border-t border-slate-100 pt-3 flex justify-end">
                <Link
                  to={`/orders/${matchedOrder.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700"
                >
                  View Full Invoice & Waybill <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
