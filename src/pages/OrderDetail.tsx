import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Package, MapPin, Phone, Truck, CheckCircle2, Clock,
  Printer, MessageCircle, FileText, UserCheck, ShieldCheck
} from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { useAdmin } from '@/context/AdminContext';
import { formatNGN } from '@/data/products';
import InvoiceReceipt from '@/components/orders/InvoiceReceipt';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders: clientOrders } = useOrders();
  const { orders: adminOrders } = useAdmin();

  // Find order from client orders or admin orders (for live sync)
  const order = adminOrders.find((o) => o.id === id) || clientOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <Package className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
        <p className="text-xs text-slate-500">
          We couldn't locate order #{id}. It may have been removed or the ID is incorrect.
        </p>
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:underline text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>
      </div>
    );
  }

  const statusColor = (s: string) => {
    if (s === 'Delivered') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (s === 'Out for Delivery') return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    if (s === 'Cancelled') return 'text-rose-700 bg-rose-50 border-rose-200';
    return 'text-amber-700 bg-amber-50 border-amber-200';
  };

  const steps = [
    { title: 'Order Registered', desc: 'Order received and logged in system', completed: true },
    {
      title: 'Payment Verification',
      desc: order.paymentStatus === 'paid' ? 'Payment confirmed' : 'Awaiting payment audit',
      completed: order.paymentStatus === 'paid' || order.paymentMethod === 'card',
    },
    {
      title: 'Quality & Diagnostic Check',
      desc: 'Hardware benchmark and pre-dispatch testing',
      completed: order.status === 'Out for Delivery' || order.status === 'Delivered',
    },
    {
      title: 'Dispatched with Courier',
      desc: order.riderName ? `Assigned to ${order.riderName}` : 'Handed to logistics courier',
      completed: order.status === 'Out for Delivery' || order.status === 'Delivered',
    },
    {
      title: 'Delivered',
      desc: 'Package delivered to recipient',
      completed: order.status === 'Delivered',
    },
  ];

  return (
    <>
      {/* Hidden during screen, displayed exclusively during window.print() */}
      <div className="hidden print:block">
        <InvoiceReceipt order={order} showActions={false} />
      </div>

      <div className="print:hidden max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
        <div>
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-600 font-semibold mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Order #{order.id}
            </h1>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Placed on {order.date}</p>
        </div>

        <button
          onClick={() => window.print()}
          className="self-start sm:self-auto py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <Printer className="w-3.5 h-3.5" /> Print Order Details
        </button>
      </div>

      {/* Official Waybill Docket Card */}
      {order.waybillNumber && (
        <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                Official Waybill Docket Number
              </div>
              <div className="font-mono font-extrabold text-slate-900 text-sm">
                {order.waybillNumber}
              </div>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
            Carrier: {order.delivery?.provider || 'GadgetShop Express'}
          </span>
        </div>
      )}

      {/* Assigned Courier Dispatch Rider */}
      {order.riderName && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="font-bold text-sm">Assigned Courier Dispatch Rider</h2>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
              Dispatched
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-800">
            <div>
              <div className="font-extrabold text-white text-sm">{order.riderName}</div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3 h-3 text-slate-500" />
                {order.riderPhone || 'Contact Ikeja Dispatch Hub'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {order.riderPhone && (
                <>
                  <a
                    href={`tel:${order.riderPhone}`}
                    className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Rider
                  </a>
                  <a
                    href={`https://wa.me/${order.riderPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(order.riderName)},%20I'm%20tracking%20my%20GadgetShop%20Order%20%23${order.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5-Stage Live Milestone Progress Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-purple-600" />
            <h2 className="font-bold text-slate-900 text-sm">Live Milestone Tracking</h2>
          </div>
          {order.delivery?.estimatedDelivery && (
            <span className="text-xs text-slate-500 font-medium">
              ETA: <span className="font-bold text-slate-800">{order.delivery.estimatedDelivery}</span>
            </span>
          )}
        </div>

        <div className="space-y-4 relative pl-6 border-l-2 border-slate-100 ml-2">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div
                className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  step.completed
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
              </div>
              <div className={step.completed ? 'opacity-100' : 'opacity-50'}>
                <div className="text-xs font-bold text-slate-900">{step.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Destination */}
      {order.delivery?.address && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-600" /> Delivery Destination
          </h2>
          <div className="text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800">{order.delivery.address.fullName}</div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Phone className="w-3 h-3" />
              {order.delivery.address.phone}
            </div>
            <div className="text-slate-600">
              {order.delivery.address.address}, {order.delivery.address.city}, {order.delivery.address.state}
            </div>
          </div>
        </div>
      )}

      {/* Order Manifest Items */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <h2 className="font-bold text-slate-900 text-sm">Package Manifest</h2>
        <div className="divide-y divide-slate-100">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="py-3 flex items-center gap-3 text-xs">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                <img src={item.product.image} alt={item.product.name} className="object-contain w-full h-full p-1" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 truncate">{item.product.name}</div>
                <div className="text-slate-400">
                  Qty: {item.quantity}{item.selectedColor ? ` · ${item.selectedColor}` : ''}
                </div>
              </div>
              <div className="font-bold text-slate-900 shrink-0">
                {formatNGN(item.product.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-800">{formatNGN(order.subtotal)}</span>
          </div>
          {order.discount && order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Voucher Discount</span>
              <span>-{formatNGN(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-500">
            <span>Delivery Fee</span>
            <span className="font-semibold text-slate-800">
              {order.deliveryFee === 0 ? 'Free' : formatNGN(order.deliveryFee || 0)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
            <span>Total Payable</span>
            <span className="text-purple-700">{formatNGN(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
        <h2 className="font-bold text-slate-900 text-sm">Payment Details</h2>
        <div className="text-xs space-y-1 text-slate-600">
          <div>
            Payment Mode: <span className="font-semibold uppercase text-purple-700">{order.paymentMethod?.replace(/_/g, ' ')}</span>
          </div>
          <div>
            Payment Status:{' '}
            <span className={`font-semibold capitalize ${order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
              {order.paymentStatus === 'paid' ? 'Verified / Settled' : 'Pending Verification'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <a
          href={`https://wa.me/2348012345678?text=Hello%20GadgetShop,%20I'm%20inquiring%20about%20Order%20%23${order.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp Fulfillment Support
        </a>
        <Link
          to="/products"
          className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center justify-center transition-colors shadow-sm"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
    </>
  );
}
