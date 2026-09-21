import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, CreditCard, Building2, Wallet, ArrowRight, CheckCircle2,
  Lock, Truck, Store, DollarSign, Smartphone, Printer, MessageCircle,
  Clock, Copy, Check, Upload, Tag, AlertCircle
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { useAdmin } from '@/context/AdminContext';
import { formatNGN } from '@/data/products';
import { DeliveryAddress, DeliveryMethodType, PaymentMethodType, Order, PaymentRecord } from '@/types';
import InvoiceReceipt from '@/components/orders/InvoiceReceipt';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    cart,
    subtotal,
    clearCart,
    appliedPromo,
    discount,
    applyPromo,
    removePromo,
    totalAfterDiscount,
  } = useCart();
  const { createOrder } = useOrders();
  const {
    addOrder: addAdminOrder,
    deliveryZones,
    bankAccounts,
    addPayment,
    promoCodes,
  } = useAdmin();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: 'Muhammed Adegoke',
    phone: '+234 801 234 5678',
    email: 'muhammed@example.com',
    address: '12, Freedom Street, Ikeja',
    city: 'Ikeja',
    state: 'Lagos State',
    postalCode: '100001',
  });

  // Delivery Zone Selection
  const [selectedZoneId, setSelectedZoneId] = useState<string>(
    deliveryZones[0]?.id || 'ZONE-01'
  );
  const [isPickup, setIsPickup] = useState(false);

  const activeZone = deliveryZones.find((z) => z.id === selectedZoneId) || deliveryZones[0];
  const activeZoneFee = activeZone ? (activeZone.fee ?? (activeZone as any).rate ?? 2500) : 2500;
  const activeZoneName = activeZone ? (activeZone.region || (activeZone as any).name || 'Standard Regional Delivery') : 'Standard Regional Delivery';
  const deliveryFee = isPickup ? 0 : (subtotal >= 50000 ? 0 : activeZoneFee);
  const finalTotal = totalAfterDiscount + deliveryFee;

  // Payment Options
  const [paymentCategory, setPaymentCategory] = useState<'physical' | 'transfer' | 'gateway'>('transfer');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('transfer');

  // Bank Transfer Form State
  const [senderName, setSenderName] = useState(address.fullName);
  const [senderBank, setSenderBank] = useState('GTBank');
  const [transferRef, setTransferRef] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Promo Input in Summary
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const handleCopyAccount = (accNum: string) => {
    navigator.clipboard.writeText(accNum);
    setCopiedAccount(accNum);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCheckoutPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyPromo(promoInput, promoCodes);
    setPromoMsg({ text: res.message, isError: !res.success });
    if (res.success) setPromoInput('');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    const orderId = `GS-${Math.floor(1000 + Math.random() * 9000)}`;
    const waybillNum = `WB-GS-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}`;
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const enrichedOrder: Order = {
      id: orderId,
      date: today,
      items: cart.map(item => ({ ...item })),
      subtotal,
      deliveryFee,
      discount,
      total: finalTotal,
      status: paymentCategory === 'transfer' ? 'Processing' : 'Processing',
      paymentMethod,
      paymentType: paymentCategory === 'physical' ? 'physical' : 'gateway',
      paymentStatus: paymentCategory === 'transfer' ? 'pending_verification' : (paymentCategory === 'gateway' ? 'paid' : 'pending_verification'),
      customerName: address.fullName,
      customerEmail: address.email,
      customerPhone: address.phone,
      waybillNumber: waybillNum,
      delivery: {
        deliveryId: `DEL-${Math.floor(10000 + Math.random() * 90000)}`,
        provider: 'GadgetShop Express Logistics',
        status: 'PROCESSING',
        trackingNumber: waybillNum,
        address,
        estimatedDelivery: isPickup ? 'Ready for Pickup' : (activeZone?.estimatedDays || '2-3 Business Days'),
        events: [
          {
            title: 'Order Registered',
            description: paymentCategory === 'transfer'
              ? 'Bank transfer details received. Proof awaiting verification in ledger.'
              : (paymentCategory === 'physical' ? 'Order confirmed via In-Person Payment.' : 'Online payment verified.'),
            timestamp: 'Just now',
            completed: true,
          },
          {
            title: 'Fulfillment & Diagnostic Inspection',
            description: 'Item reserved at Ikeja Hub. Undergoing pre-dispatch testing.',
            timestamp: 'In Progress',
            completed: true,
          },
        ],
      },
    };

    // If customer paid via Direct Bank Transfer, register into Admin Payments Ledger
    if (paymentCategory === 'transfer') {
      const pmtRecord: PaymentRecord = {
        id: `PMT-${Math.floor(10000 + Math.random() * 90000)}`,
        orderId: orderId,
        customerName: address.fullName,
        customerEmail: address.email,
        amount: finalTotal,
        fee: 0,
        net: finalTotal,
        channel: 'bank_transfer',
        status: 'pending_verification',
        createdAt: new Date().toLocaleString(),
        reference: transferRef.trim() || `TRF-${Math.floor(100000 + Math.random() * 900000)}`,
        senderBank: senderBank || 'Bank Transfer',
        senderName: senderName || address.fullName,
        receiptUrl: receiptImage || undefined,
        notes: 'Customer submitted payment proof via checkout. Awaiting verification against store account statement.',
      };
      addPayment(pmtRecord);
    } else if (paymentCategory === 'gateway') {
      const pmtRecord: PaymentRecord = {
        id: `PMT-${Math.floor(10000 + Math.random() * 90000)}`,
        orderId: orderId,
        customerName: address.fullName,
        customerEmail: address.email,
        amount: finalTotal,
        fee: Math.round(finalTotal * 0.015),
        net: Math.round(finalTotal * 0.985),
        channel: 'paystack',
        status: 'successful',
        createdAt: new Date().toLocaleString(),
        reference: `PSTK-${Math.floor(1000000 + Math.random() * 9000000)}`,
        notes: 'Payment settled instantly via card gateway.',
      };
      addPayment(pmtRecord);
    }

    addAdminOrder(enrichedOrder);
    setPlacedOrder(enrichedOrder);
    clearCart();
    setIsProcessing(false);
  };

  if (placedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <InvoiceReceipt order={placedOrder} showActions={true} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Progress Stepper */}
      <div className="max-w-xl mx-auto flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-10" />
        {[
          { num: 1, label: 'Delivery & Address' },
          { num: 2, label: 'Payment Method' },
          { num: 3, label: 'Review & Confirm' },
        ].map(({ num, label }) => (
          <div key={num} className="flex items-center gap-2 bg-white px-3">
            <div
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                step >= num ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {num}
            </div>
            <span className={`text-xs font-bold ${step >= num ? 'text-purple-700' : 'text-slate-400'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Address & Regional Delivery Zone */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                1. Delivery & Contact Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600 bg-slate-50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600 bg-slate-50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">City / Area</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">State</label>
                  <select
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600 bg-slate-50"
                  >
                    <option>Lagos State</option>
                    <option>Abuja (FCT)</option>
                    <option>Rivers (Port Harcourt)</option>
                    <option>Oyo (Ibadan)</option>
                    <option>Ogun State</option>
                    <option>Kano State</option>
                    <option>Enugu State</option>
                    <option>Delta State</option>
                    <option>Edo State</option>
                    <option>Other States (Interstate)</option>
                  </select>
                </div>
              </div>

              {/* Regional Delivery Zones */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Regional Delivery Zone & Shipping Rate
                  </h3>
                  <span className="text-[11px] text-slate-400">Doorstep courier dispatch</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {deliveryZones.filter(z => z.active).map((zone) => {
                    const isSelected = !isPickup && selectedZoneId === zone.id;
                    const zoneTitle = zone.region || (zone as any).name || 'Delivery Zone';
                    const zoneFee = zone.fee ?? (zone as any).rate ?? 0;
                    return (
                      <div
                        key={zone.id}
                        onClick={() => {
                          setSelectedZoneId(zone.id);
                          setIsPickup(false);
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50/70 ring-1 ring-purple-600'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{zoneTitle}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{zone.estimatedDays}</div>
                          </div>
                          <div className="text-xs font-extrabold text-slate-900">
                            {formatNGN(zoneFee)}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Free In-Store Pickup Option */}
                  <div
                    onClick={() => setIsPickup(true)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isPickup
                        ? 'border-purple-600 bg-purple-50/70 ring-1 ring-purple-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-slate-900 text-xs">In-Store Pickup (Ikeja Hub)</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Collect & test before paying</div>
                      </div>
                      <div className="text-xs font-bold text-emerald-600">Free</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm py-4 rounded-xl transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2"
              >
                Proceed to Payment Options <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Payment Selection */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900">2. Select Payment Mode</h2>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  Multiple Payment Channels
                </span>
              </div>

              {/* Payment Category Switcher */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentCategory('transfer');
                    setPaymentMethod('transfer');
                  }}
                  className={`py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    paymentCategory === 'transfer'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" /> Direct Bank Transfer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentCategory('physical');
                    setPaymentMethod('pos_on_delivery');
                  }}
                  className={`py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    paymentCategory === 'physical'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" /> POS / Cash on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentCategory('gateway');
                    setPaymentMethod('card');
                  }}
                  className={`py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    paymentCategory === 'gateway'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" /> Debit Card / Online
                </button>
              </div>

              {/* Direct Bank Transfer Form with Official Store Accounts */}
              {paymentCategory === 'transfer' && (
                <div className="space-y-4 pt-1">
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Official Store Accounts:</span> Make your transfer to any of our dedicated corporate accounts below, then provide the payment reference or proof receipt.
                    </div>
                  </div>

                  {/* Bank Accounts Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {bankAccounts.filter(b => b.active).map((acc) => (
                      <div
                        key={acc.id}
                        className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1 relative group"
                      >
                        <div className="text-[11px] font-semibold text-slate-500 uppercase">{acc.bankName}</div>
                        <div className="font-mono font-extrabold text-slate-900 text-sm">{acc.accountNumber}</div>
                        <div className="text-[11px] text-slate-600 truncate">{acc.accountName}</div>
                        <button
                          type="button"
                          onClick={() => handleCopyAccount(acc.accountNumber)}
                          className="mt-2 w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1 transition-colors"
                        >
                          {copiedAccount === acc.accountNumber ? (
                            <><Check className="w-3 h-3 text-emerald-600" /> Copied!</>
                          ) : (
                            <><Copy className="w-3 h-3 text-slate-500" /> Copy Number</>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Payment Verification Form */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 text-xs">
                    <div className="font-bold text-slate-900">Transfer Confirmation Details</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Sender Account Name</label>
                        <input
                          type="text"
                          placeholder="Name on your bank account"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Sender Bank Name</label>
                        <input
                          type="text"
                          placeholder="e.g. GTBank, Kuda, Zenith"
                          value={senderBank}
                          onChange={(e) => setSenderBank(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 font-semibold mb-1">Transaction Reference / Session ID</label>
                        <input
                          type="text"
                          placeholder="e.g. 10002847192847102"
                          value={transferRef}
                          onChange={(e) => setTransferRef(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 font-semibold mb-1">Payment Receipt Screenshot (Optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleReceiptUpload}
                          className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                        />
                        {receiptImage && (
                          <div className="mt-2 flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Receipt image attached successfully.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* In-Person Payment */}
              {paymentCategory === 'physical' && (
                <div className="space-y-3 pt-1">
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Pay only when the package is delivered to your door and unboxed.</span>
                  </div>
                  {[
                    {
                      id: 'pos_on_delivery',
                      label: 'POS on Delivery (Card Swipe / Tap)',
                      sub: 'Our courier rider carries an active mobile terminal. Inspect package before tapping your card.',
                    },
                    {
                      id: 'cash_on_delivery',
                      label: 'Cash on Delivery',
                      sub: 'Hand exact cash to the dispatch rider upon physical inspection and unboxing.',
                    },
                    {
                      id: 'pay_in_store',
                      label: 'Pay at Store (Ikeja Experience Center)',
                      sub: 'Reserve the gadget online. Inspect, test, and pay via cash or POS at our Ikeja showroom.',
                    },
                  ].map(({ id, label, sub }) => (
                    <label
                      key={id}
                      onClick={() => setPaymentMethod(id as PaymentMethodType)}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === id
                          ? 'border-purple-600 bg-purple-50/50 ring-1 ring-purple-600'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethodRadio"
                        checked={paymentMethod === id}
                        onChange={() => setPaymentMethod(id as PaymentMethodType)}
                        className="mt-1 text-purple-600 focus:ring-purple-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Online Gateway (Card) */}
              {paymentCategory === 'gateway' && (
                <div className="space-y-3 pt-1 text-xs">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Secure Online Card Checkout</span>
                      <span className="text-[11px] text-slate-400">Visa / Mastercard / Verve</span>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="5399 •••• •••• 4281"
                        defaultValue="5399 4812 9042 4281"
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          defaultValue="08/28"
                          className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">CVV</label>
                        <input
                          type="password"
                          placeholder="•••"
                          defaultValue="842"
                          className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3.5 rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-2/3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2"
                >
                  Review Order <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                3. Review & Confirm Order
              </h2>

              <div className="bg-slate-50 rounded-xl p-5 space-y-3 text-xs border border-slate-200">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Recipient Address</span>
                  <span className="font-bold text-slate-900 text-right">
                    {address.fullName} ({address.phone})<br />
                    {address.address}, {address.city}, {address.state}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Delivery Zone</span>
                  <span className="font-bold text-slate-900">
                    {isPickup ? 'In-Store Pickup (Ikeja Hub)' : `${activeZone?.name} (${activeZone?.estimatedDays})`}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Payment Mode</span>
                  <span className="font-bold text-purple-700 uppercase">
                    {paymentCategory === 'transfer' ? 'Direct Bank Transfer (Proof Submitted)' : paymentMethod.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Total Amount Payable</span>
                  <span className="font-black text-slate-900 text-sm">{formatNGN(finalTotal)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-4 rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-2/3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm py-4 rounded-xl transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    'Registering Order...'
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Confirm & Place Order ({formatNGN(finalTotal)})
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Order Summary & Coupon */}
        <div className="lg:col-span-1 space-y-4">
          {/* Promo Code Redemption Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Tag className="w-4 h-4 text-purple-600" />
              <span>Promo Code / Voucher</span>
            </div>

            {appliedPromo ? (
              <div className="flex items-center justify-between p-2.5 bg-purple-50 border border-purple-200 rounded-xl">
                <div>
                  <span className="font-bold text-purple-900">{appliedPromo.code}</span>
                  <p className="text-[11px] text-purple-700">
                    {appliedPromo.discountType === 'percentage'
                      ? `${appliedPromo.value}% Discount Applied`
                      : `${formatNGN(appliedPromo.value)} Off`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removePromo}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCheckoutPromo} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. GADGET10"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600 uppercase font-medium"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoMsg && (
                  <p className={`text-[11px] font-medium ${promoMsg.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {promoMsg.text}
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Cart Itemized Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm sticky top-24">
            <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              Order Summary
            </h2>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 text-xs">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
                    <img src={item.product.image} alt={item.product.name} className="object-contain w-full h-full p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 truncate">{item.product.name}</div>
                    <div className="text-slate-400">Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}</div>
                  </div>
                  <div className="font-bold text-slate-900">{formatNGN(item.product.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatNGN(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Voucher Discount</span>
                  <span>-{formatNGN(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping ({isPickup ? 'In-Store Pickup' : activeZoneName})</span>
                <span className="font-bold text-slate-900">
                  {deliveryFee === 0 ? <span className="text-emerald-600 font-semibold">Free</span> : formatNGN(deliveryFee)}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-sm">Total Payable</span>
                <span className="font-black text-purple-700 text-xl">{formatNGN(finalTotal)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
              <Lock className="w-3.5 h-3.5 text-purple-600" />
              <span>Certified Pre-Owned & 1-Year Hardware Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
