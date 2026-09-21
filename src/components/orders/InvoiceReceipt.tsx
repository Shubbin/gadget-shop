import React from 'react';
import { Link } from 'react-router-dom';
import {
  Printer,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Package,
  Truck,
  Building2,
  Calendar,
  CreditCard,
  QrCode,
  Check
} from 'lucide-react';
import { Order } from '@/types';
import { formatNGN } from '@/data/products';

interface InvoiceReceiptProps {
  order: Order;
  showActions?: boolean;
}

export default function InvoiceReceipt({ order, showActions = true }: InvoiceReceiptProps) {
  const items = order.items || [];
  const address = order.delivery?.address;
  const recipientName = address?.fullName || order.customerName || 'Valued Customer';
  const recipientPhone = address?.phone || order.customerPhone || '+234 801 234 5678';
  const recipientEmail = address?.email || order.customerEmail || 'customer@gadgetshop.ng';
  const destinationAddress = address
    ? `${address.address}, ${address.city}, ${address.state}`
    : 'In-Store Pickup (Ikeja Hub)';

  // Calculate VAT (7.5% included in subtotal)
  const vatAmount = Math.round((order.subtotal * 7.5) / 107.5);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Top Notification / Action Bar (Screen Only) */}
      {showActions && (
        <div className="print:hidden mb-6 bg-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base flex items-center gap-2">
                Order Confirmed #{order.id}
                <span className="text-[10px] bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border border-purple-400/30">
                  Electronic Waybill Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Your gadget reservation is locked and ready for fulfillment.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-900/30 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Save Invoice
            </button>
            <a
              href={`https://wa.me/2348012345678?text=${encodeURIComponent(
                `Hello GadgetShop, I just placed Order #${order.id} (Waybill: ${order.waybillNumber || 'Pending'}). Total: ₦${order.total?.toLocaleString()}. Please confirm dispatch status.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-900/30"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Dispatch
            </a>
            <Link
              to={`/orders/${order.id}`}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
            >
              Track Order <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OFFICIAL COMMERCIAL INVOICE & SALES RECEIPT (PRINT & SCREEN) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl print:shadow-none print:border-none print:rounded-none p-6 sm:p-10 text-slate-900 print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            {/* Brand & Corporate Metadata */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#7c3aed] text-white flex items-center justify-center font-black text-xl shadow-xs">
                  G
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                    Gadget<span className="text-[#7c3aed]">Shop</span>
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Tech &amp; Hardware Diagnostics Ltd.
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-slate-600 space-y-0.5 pt-2">
                <p className="font-semibold text-slate-800">
                  RC: 1849204 • Tax Identification Number (TIN): 2849102-001
                </p>
                <p>Corporate HQ: Suite 4B, Ikeja Computer Village Tech Complex</p>
                <p>Otigba Street, Ikeja, Lagos State, Nigeria</p>
                <p>Tel: +234 801 234 5678 • Email: orders@gadgetshop.ng</p>
              </div>
            </div>

            {/* Invoice Meta Box */}
            <div className="sm:text-right space-y-1 bg-slate-50 print:bg-white p-4 rounded-xl border border-slate-200 print:border-none">
              <span className="inline-block px-2.5 py-0.5 bg-purple-100 print:border print:border-purple-300 text-purple-900 rounded font-black text-[10px] tracking-wider uppercase">
                Official Commercial Invoice
              </span>
              <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                INV-{order.id}
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Issue Date: <span className="font-bold text-slate-900">{order.date || 'Today'}</span>
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Waybill No:{' '}
                <span className="font-mono font-bold text-purple-900">
                  {order.waybillNumber || `WB-GS-${order.id}-HQ`}
                </span>
              </div>
              <div className="pt-1">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                    order.paymentStatus === 'paid' || order.paymentMethod === 'card'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}
                >
                  Payment:{' '}
                  {order.paymentStatus === 'paid' || order.paymentMethod === 'card'
                    ? 'Confirmed / Settled'
                    : 'Pending Bank Statement Audit'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
          {/* Billed & Shipped To */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7c3aed] bg-purple-50 px-2 py-0.5 rounded">
              Customer &amp; Delivery Details
            </span>
            <div className="space-y-1 text-slate-700">
              <p className="font-bold text-slate-900 text-sm">{recipientName}</p>
              <p className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Phone:</span>
                <span className="font-semibold text-slate-800">{recipientPhone}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Email:</span>
                <span className="font-semibold text-slate-800">{recipientEmail}</span>
              </p>
              <p className="pt-1">
                <span className="text-slate-400 font-medium block">Dispatch Address:</span>
                <span className="font-semibold text-slate-900">{destinationAddress}</span>
              </p>
            </div>
          </div>

          {/* Fulfillment & Courier Specs */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              Logistics &amp; Payment Specifications
            </span>
            <div className="space-y-1 text-slate-700">
              <p className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="font-bold text-slate-900 uppercase">
                  {order.paymentMethod?.replace(/_/g, ' ') || 'Direct Transfer'}
                </span>
              </p>
              <p className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Dispatch Logistics Mode:</span>
                <span className="font-bold text-slate-900">
                  {order.delivery?.method === 'pickup'
                    ? 'In-Store Pickup (Ikeja Tech Hub)'
                    : 'Doorstep Courier Dispatch'}
                </span>
              </p>
              <p className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Estimated Delivery:</span>
                <span className="font-bold text-slate-900">
                  {order.delivery?.estimatedDelivery || '1 - 2 Business Days'}
                </span>
              </p>
              <p className="flex justify-between pt-0.5">
                <span className="text-slate-500">Packaging Protocol:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Anti-Tamper Security Boxed
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* ITEMIZED GADGETS TABLE */}
        {/* ===================================================================== */}
        <div className="py-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-900">
              Purchased Gadget Inventory &amp; Specifications
            </h3>
            <span className="text-[11px] text-slate-500">
              {items.length} {items.length === 1 ? 'Device' : 'Devices'} Registered
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-y border-slate-200 bg-slate-50 text-slate-700 uppercase font-extrabold text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Device / Model &amp; Configuration</th>
                  <th className="py-2.5 px-3">Condition &amp; Warranty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length > 0 ? (
                  items.map((item, idx) => {
                    const product = item.product;
                    const itemTotal = (product.price || 0) * (item.quantity || 1);
                    return (
                      <tr key={product.id || idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-bold text-slate-400 align-top">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3 align-top max-w-xs">
                          <div className="font-black text-slate-900 text-xs sm:text-sm">
                            {product.name}
                          </div>
                          <div className="text-[11px] text-purple-700 font-semibold mt-0.5 flex flex-wrap gap-2">
                            {item.selectedStorage && (
                              <span className="bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                                Storage: {item.selectedStorage}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                                Finish: {item.selectedColor}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1 space-y-0.5">
                            <p>
                              Serial / IMEI:{' '}
                              <span className="font-mono font-medium text-slate-700">
                                {product.serialNumber || `IMEI-35${Math.floor(1000000000000 + Math.random() * 9000000000000)}`}
                              </span>
                            </p>
                            <p className="text-slate-400">
                              Accessories: 1x Fast Charger, USB-C Braided Cable, SIM Ejector
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-3 align-top">
                          <div className="font-bold text-slate-800">
                            {product.cosmeticGrade || (product.condition ? product.condition.replace(/_/g, ' ') : 'London Used (Grade A)')}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            {product.batteryHealth ? `${product.batteryHealth}% Battery Health` : '100% Tested Genuine'}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            1-Year Hardware Warranty
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-slate-800 align-top">
                          {formatNGN(product.price)}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-900 align-top">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-3 text-right font-black text-slate-900 text-xs sm:text-sm align-top">
                          {formatNGN(itemTotal)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-slate-400">
                      Standard Gadget Reservation Order #{order.id}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Breakdown & Quality Seal Block */}
        <div className="py-6 border-b border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Quality Assurance & Warranty Certification */}
          <div className="bg-slate-50 print:bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-black text-slate-900 text-xs uppercase tracking-wide">
                45-Point Hardware Inspection Guarantee
              </h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Every gadget listed on GadgetShop has been rigorously tested by our certified technicians. Includes full board diagnostics, battery discharge benchmarks, TrueTone, biometrics, camera sensors, and network unlocks.
            </p>
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
              <div>
                <p className="font-bold text-slate-800">Engr. K. Balogun</p>
                <p>Lead Diagnostics Officer</p>
              </div>
              <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-black rounded-lg uppercase tracking-wider text-[9px]">
                QC PASSED &amp; CERTIFIED
              </div>
            </div>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Gadgets Subtotal</span>
              <span className="font-bold text-slate-900">{formatNGN(order.subtotal || order.total)}</span>
            </div>

            {order.discount ? (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Voucher / Promotional Discount</span>
                <span>-{formatNGN(order.discount)}</span>
              </div>
            ) : null}

            <div className="flex justify-between text-slate-600">
              <span>
                Shipping &amp; Logistics (
                {order.delivery?.method === 'pickup' ? 'In-Store Pickup' : 'Regional Doorstep'}
                )
              </span>
              <span className="font-bold text-slate-900">
                {order.deliveryFee === 0 || !order.deliveryFee ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  formatNGN(order.deliveryFee)
                )}
              </span>
            </div>

            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Value Added Tax (VAT 7.5% Included)</span>
              <span>{formatNGN(vatAmount)}</span>
            </div>

            <div className="border-t-2 border-slate-900 pt-3 flex justify-between items-baseline">
              <div>
                <div className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Total Payable / Settled
                </div>
                <div className="text-[10px] text-slate-400">All prices in Nigerian Naira (NGN)</div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#7c3aed]">
                {formatNGN(order.total)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer & Warranty Terms */}
        <div className="pt-6 space-y-3 text-[10px] text-slate-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
            <p className="font-semibold text-slate-700">
              1-Year Official Hardware Warranty Coverage Included
            </p>
            <p className="font-mono text-slate-400">
              Document Authenticity Hash: GS-CERT-{order.id.slice(0, 8).toUpperCase()}-NG
            </p>
          </div>
          <p className="leading-relaxed">
            <strong className="text-slate-700">Warranty &amp; Return Terms:</strong> Gadgets are eligible for replacement within 30 days if hardware defects occur under standard manufacturer use. 1-Year motherboard and logic chip warranty applies. Warranty does not cover liquid immersion, accidental screen destruction from falls, or uncertified third-party repair alterations. Keep this invoice for claim validation.
          </p>
          <div className="pt-2 text-center text-slate-400 text-[9px] uppercase tracking-widest font-bold">
            Thank you for choosing GadgetShop • Nigeria's Most Trusted Pre-Owned &amp; Brand New Tech Hub
          </div>
        </div>
      </div>
    </div>
  );
}
