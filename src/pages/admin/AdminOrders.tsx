import React, { useState } from 'react';
import {
  Search, Package, Truck, CheckCircle2, Clock, MapPin, Phone, Edit, X,
  MessageCircle, Filter, Printer, UserCheck, ShieldCheck, QrCode, FileText
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Order, OrderStatus } from '@/types';
import { formatNGN } from '@/data/products';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, updateOrderTracking, assignRider } = useAdmin();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Tracking Modal State
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);
  const [courierProvider, setCourierProvider] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estDelivery, setEstDelivery] = useState('');

  // Rider Assignment State
  const [riderModalOrder, setRiderModalOrder] = useState<Order | null>(null);
  const [riderName, setRiderName] = useState('');
  const [riderPhone, setRiderPhone] = useState('');

  // Waybill Slip State
  const [waybillOrder, setWaybillOrder] = useState<Order | null>(null);

  const handleOpenTrackingModal = (order: Order) => {
    setTrackingModalOrder(order);
    setCourierProvider(order.delivery?.provider || 'GadgetShop Express Logistics');
    setTrackingNumber(order.delivery?.trackingNumber || `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`);
    setEstDelivery(order.delivery?.estimatedDelivery || 'Next-Day Dispatch');
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingModalOrder) {
      updateOrderTracking(trackingModalOrder.id, courierProvider.trim(), trackingNumber.trim(), estDelivery.trim());
      if (selectedOrder && selectedOrder.id === trackingModalOrder.id) {
        setSelectedOrder({
          ...selectedOrder,
          delivery: {
            ...selectedOrder.delivery,
            provider: courierProvider.trim(),
            trackingNumber: trackingNumber.trim(),
            estimatedDelivery: estDelivery.trim(),
          },
        });
      }
      setTrackingModalOrder(null);
    }
  };

  const handleOpenRiderModal = (order: Order) => {
    setRiderModalOrder(order);
    setRiderName(order.delivery?.riderName || 'Ibrahim Saliu (Rider #03)');
    setRiderPhone(order.delivery?.riderPhone || '+234 812 456 7890');
  };

  const handleSaveRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (riderModalOrder) {
      assignRider(riderModalOrder.id, riderName.trim(), riderPhone.trim());
      setRiderModalOrder(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(q) ||
      o.delivery?.address?.fullName?.toLowerCase().includes(q) ||
      o.delivery?.address?.phone?.toLowerCase().includes(q) ||
      o.delivery?.address?.city?.toLowerCase().includes(q);
    const matchesStatus = selectedStatus === 'all' ? true : o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const STATUS_PILLS: { label: string; value: string; color: string }[] = [
    { label: 'All Orders', value: 'all', color: 'bg-slate-600' },
    { label: 'Processing', value: 'Processing', color: 'bg-amber-500' },
    { label: 'Out for Delivery', value: 'Out for Delivery', color: 'bg-blue-500' },
    { label: 'Delivered', value: 'Delivered', color: 'bg-emerald-500' },
    { label: 'Cancelled', value: 'Cancelled', color: 'bg-rose-500' },
  ];

  const statusConfig: Record<string, { bg: string; text: string }> = {
    Processing: { bg: 'bg-amber-50', text: 'text-amber-700' },
    'Out for Delivery': { bg: 'bg-blue-50', text: 'text-blue-700' },
    Delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    Cancelled: { bg: 'bg-rose-50', text: 'text-rose-700' },
    Pending: { bg: 'bg-slate-100', text: 'text-slate-700' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Orders, Waybills &amp; Dispatch</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time fulfillment, rider assignment, tracking history, and printable customer dispatch notes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
            {orders.length} Total Orders
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by order ID, customer name, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {STATUS_PILLS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSelectedStatus(value)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedStatus === value
                  ? 'bg-[#7c3aed] text-white shadow-md shadow-purple-900/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            No orders match your filters.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const sc = statusConfig[order.status] || statusConfig['Pending'];
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 space-y-3 hover:border-purple-200 transition-all shadow-sm"
              >
                {/* Top Row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900 text-sm">#{order.id}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                      {order.status}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                      {order.paymentMethod ? order.paymentMethod.replace(/_/g, ' ').toUpperCase() : 'PAID'}
                    </span>
                    {order.delivery?.riderName && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <UserCheck className="w-3 h-3" /> {order.delivery.riderName}
                      </span>
                    )}
                  </div>
                  <div className="font-black text-slate-900 text-base">{formatNGN(order.total)}</div>
                </div>

                {/* Customer + Items */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <span>{order.delivery?.address?.fullName || 'Muhammed Adegoke'}</span>
                    </div>
                    <div className="text-slate-400 flex items-center gap-1.5">
                      <Phone className="w-3 h-3" /> {order.delivery?.address?.phone || '—'}
                      {order.delivery?.address?.city && (
                        <>
                          <MapPin className="w-3 h-3 ml-1" /> {order.delivery.address.city}, {order.delivery.address.state}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center"
                      >
                        <img src={item.product.image} alt={item.product.name} className="object-contain w-full h-full p-1" />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-[10px] font-bold text-slate-400">+{order.items.length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => handleOpenRiderModal(order)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:text-[#7c3aed] hover:border-purple-200 transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#7c3aed]" /> Assign Rider
                  </button>

                  <button
                    onClick={() => handleOpenTrackingModal(order)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:text-[#7c3aed] hover:border-purple-200 transition-colors cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5" /> Tracking
                  </button>

                  <button
                    onClick={() => setWaybillOrder(order)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 text-[#7c3aed] border border-purple-200 text-xs font-bold hover:bg-purple-100 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Waybill
                  </button>

                  <button
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:text-[#7c3aed] transition-colors cursor-pointer"
                  >
                    <Package className="w-3.5 h-3.5" /> {selectedOrder?.id === order.id ? 'Hide' : 'Details'}
                  </button>

                  <a
                    href={`https://wa.me/${(order.delivery?.address?.phone || '+2348012345678').replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hello ${order.delivery?.address?.fullName || 'Customer'}, this is GadgetShop Support regarding your Order #${order.id}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors hover:bg-emerald-100"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                </div>

                {/* Expanded Details */}
                {selectedOrder?.id === order.id && (
                  <div className="mt-2 bg-slate-50/70 rounded-xl border border-slate-200/80 p-4 text-xs space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="font-bold text-slate-700 mb-1">Delivery Destination</div>
                        <div className="text-slate-600 leading-relaxed">
                          {order.delivery?.address?.fullName}<br />
                          {order.delivery?.address?.address}<br />
                          {order.delivery?.address?.city}, {order.delivery?.address?.state}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-slate-700 mb-1">Dispatch Logistics</div>
                        <div className="text-slate-600 space-y-0.5">
                          <div>Carrier: <span className="font-semibold text-slate-800">{order.delivery?.provider || 'GadgetShop Express'}</span></div>
                          <div>Rider: <span className="font-semibold text-slate-800">{order.delivery?.riderName || 'Unassigned'}</span> ({order.delivery?.riderPhone || '—'})</div>
                          <div>Tracking: <span className="font-mono text-[#7c3aed]">{order.delivery?.trackingNumber || 'Pending'}</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 space-y-1.5">
                      <div className="font-bold text-slate-700 mb-2">Package Contents</div>
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                              <img src={item.product.image} alt={item.product.name} className="object-contain w-full h-full p-0.5" />
                            </div>
                            <span className="text-slate-800 font-medium">
                              {item.product.name} <span className="text-slate-400">x{item.quantity}</span>
                            </span>
                          </div>
                          <span className="font-bold text-slate-900">{formatNGN(item.product.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Rider Assignment Modal */}
      {riderModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#7c3aed]" /> Assign Delivery Rider — #{riderModalOrder.id}
              </h3>
              <button onClick={() => setRiderModalOrder(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRider} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rider / Courier Name</label>
                <input
                  type="text"
                  required
                  value={riderName}
                  onChange={(e) => setRiderName(e.target.value)}
                  placeholder="e.g. Ibrahim Saliu (GadgetShop Rider #03)"
                  className="w-full border border-slate-200 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rider Phone Number</label>
                <input
                  type="text"
                  required
                  value={riderPhone}
                  onChange={(e) => setRiderPhone(e.target.value)}
                  placeholder="+234 812 345 6789"
                  className="w-full border border-slate-200 rounded-xl p-2.5"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRiderModalOrder(null)}
                  className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#7c3aed] text-white rounded-xl font-bold shadow-md"
                >
                  Assign &amp; Set Out for Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Update Courier Tracking — #{trackingModalOrder.id}</h3>
              <button onClick={() => setTrackingModalOrder(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveTracking} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Courier Provider</label>
                <input
                  type="text"
                  value={courierProvider}
                  onChange={(e) => setCourierProvider(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Delivery</label>
                <input
                  type="text"
                  value={estDelivery}
                  onChange={(e) => setEstDelivery(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTrackingModalOrder(null)}
                  className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#7c3aed] text-white rounded-xl font-bold shadow-md"
                >
                  Save Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Waybill Slip Modal */}
      {waybillOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-8 shadow-2xl border border-slate-200 space-y-6 my-8 animate-in fade-in">
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#7c3aed]" /> Official Courier Dispatch Waybill
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#7c3aed] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#6d28d9] cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Waybill
                </button>
                <button
                  onClick={() => setWaybillOrder(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Waybill Document Body */}
            <div className="border-2 border-slate-900 rounded-2xl p-6 space-y-6 text-xs text-slate-800">
              {/* Waybill Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                <div>
                  <div className="text-xl font-black tracking-tight text-slate-950">
                    Gadget<span className="text-[#7c3aed]">Shop</span> Express
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Logistics &amp; Fulfillment Hub, Ikeja, Lagos</div>
                  <div className="text-[11px] text-slate-500">Tel: +234 800 423 4387 &middot; www.gadgetshop.ng</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Waybill / Docket Number</div>
                  <div className="font-mono text-base font-black text-slate-900">
                    WB-{waybillOrder.id.replace('#', '')}-{Math.floor(100 + Math.random() * 900)}
                  </div>
                  <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                    PAYMENT VERIFIED &middot; APPROVED FOR DISPATCH
                  </div>
                </div>
              </div>

              {/* Recipient & Dispatch Info */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Deliver To (Consignee)</div>
                  <div className="font-black text-slate-900 text-sm">{waybillOrder.delivery?.address?.fullName || 'Muhammed Adegoke'}</div>
                  <div className="font-medium text-slate-700 mt-0.5 leading-relaxed">
                    {waybillOrder.delivery?.address?.address}<br />
                    {waybillOrder.delivery?.address?.city}, {waybillOrder.delivery?.address?.state}
                  </div>
                  <div className="font-bold text-slate-900 mt-1">Tel: {waybillOrder.delivery?.address?.phone}</div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Dispatch / Carrier Info</div>
                  <div className="font-bold text-slate-900">Rider: {waybillOrder.delivery?.riderName || 'Ibrahim Saliu (#03)'}</div>
                  <div className="font-medium text-slate-700">Rider Phone: {waybillOrder.delivery?.riderPhone || '+234 812 456 7890'}</div>
                  <div className="font-mono text-slate-800 mt-1">Tracking: {waybillOrder.delivery?.trackingNumber || 'TRK-90428402'}</div>
                  <div className="text-slate-500 mt-0.5">Order Date: {waybillOrder.date}</div>
                </div>
              </div>

              {/* Items in Package */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Package Manifest &amp; Verified Serials</div>
                <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 font-bold text-slate-600 text-[11px]">
                    <tr>
                      <th className="p-2">Item Description</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2">Assigned Serial / IMEI</th>
                      <th className="p-2 text-right">Value (NGN)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[11px]">
                    {waybillOrder.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-bold text-slate-900">{it.product.name}</td>
                        <td className="p-2 text-center font-medium">{it.quantity}</td>
                        <td className="p-2 font-mono text-slate-600">
                          {it.product.serialNumber || `SN: GS-${it.product.id.slice(-4).toUpperCase()}-9481`}
                        </td>
                        <td className="p-2 text-right font-bold">{formatNGN(it.product.price * it.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Totals */}
              <div className="flex justify-between items-center bg-slate-100 p-3 rounded-xl font-bold">
                <span>Total Invoice Settlement:</span>
                <span className="text-base text-slate-950 font-black">{formatNGN(waybillOrder.total)}</span>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 text-[11px]">
                <div className="border-t border-dashed border-slate-400 pt-2 text-center text-slate-500">
                  Dispatcher / Courier Rider Signature
                </div>
                <div className="border-t border-dashed border-slate-400 pt-2 text-center text-slate-500">
                  Recipient Signature &amp; Date Received
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
