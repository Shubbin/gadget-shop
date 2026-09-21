import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ArrowRight, ShoppingBag, Tag, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAdmin } from '@/context/AdminContext';
import { formatNGN } from '@/data/products';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
    appliedPromo,
    discount,
    applyPromo,
    removePromo,
    totalAfterDiscount,
  } = useCart();
  const { promoCodes } = useAdmin();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const deliveryFee = cart.length > 0 ? (subtotal >= 50000 ? 0 : 2500) : 0;
  const total = totalAfterDiscount + deliveryFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyPromo(promoInput, promoCodes);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setPromoInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Explore our collection of verified smartphones, laptops, audio tech, and gadgets to get started.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-purple-200"
        >
          <ArrowLeft className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Your Cart</h1>
        <Link to="/products" className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.product.id} className="bg-white rounded-xl border border-slate-200/80 p-4 flex items-center gap-4 shadow-sm hover:border-slate-300 transition-all">
              <div className="w-20 h-20 rounded-lg bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center">
                <img src={item.product.image} alt={item.product.name} className="object-contain w-full h-full p-2" />
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product.id}`} className="font-bold text-slate-900 text-sm hover:text-purple-600 transition-colors truncate block">
                  {item.product.name}
                </Link>
                {item.selectedColor && <p className="text-xs text-slate-400 mt-0.5">Color: {item.selectedColor}</p>}
                <div className="font-extrabold text-slate-900 text-sm mt-1">{formatNGN(item.product.price)}</div>
              </div>
              <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-1">
                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 text-xs">-</button>
                <span className="w-8 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 text-xs">+</button>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-xs text-slate-400">Subtotal</div>
                <div className="font-bold text-slate-900 text-sm">{formatNGN(item.product.price * item.quantity)}</div>
              </div>
              <button onClick={() => removeFromCart(item.product.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors" title="Remove item">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1 space-y-4">
          {/* Coupon Code Box */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Tag className="w-4 h-4 text-purple-600" />
              <span>Promo Code / Gift Voucher</span>
            </div>

            {appliedPromo ? (
              <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-purple-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    {appliedPromo.code}
                  </div>
                  <p className="text-[11px] text-purple-700">
                    {appliedPromo.discountType === 'percentage'
                      ? `${appliedPromo.value}% Discount Applied`
                      : `${formatNGN(appliedPromo.value)} Off Order`}
                  </p>
                </div>
                <button
                  onClick={removePromo}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
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
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-[11px] font-medium ${promoMessage.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 space-y-4 shadow-sm sticky top-24">
            <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Order Summary</h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-bold text-slate-900">{formatNGN(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({appliedPromo?.code})</span>
                  <span>-{formatNGN(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery Estimate</span>
                <span className="font-bold text-slate-900">
                  {deliveryFee === 0 ? <span className="text-emerald-600">Free</span> : formatNGN(deliveryFee)}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-sm">Estimated Total</span>
                <span className="font-extrabold text-purple-600 text-lg sm:text-xl">{formatNGN(total)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2 group"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
