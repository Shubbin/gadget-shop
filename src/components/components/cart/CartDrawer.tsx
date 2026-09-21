import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ArrowRight, ShoppingBag, Truck, Check, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCartDrawer } from '@/context/CartDrawerContext';
import { useAdmin } from '@/context/AdminContext';
import { formatNGN } from '@/data/products';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { isCartOpen, closeCart } = useCartDrawer();
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

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyPromo(promoInput, promoCodes);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setPromoInput('');
    }
  };

  const FREE_SHIPPING_THRESHOLD = 50000;
  const progressToFree = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#7c3aed]" />
              <h2 className="text-base font-extrabold text-slate-900">
                Shopping Cart ({totalItems})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-5 py-3 bg-purple-50/70 border-b border-purple-100/70">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 font-bold text-purple-900">
                <Truck className="w-4 h-4 text-[#7c3aed]" />
                {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                  <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Free Delivery Unlocked!
                  </span>
                ) : (
                  <span>Free Delivery Progress</span>
                )}
              </div>
              <span className="font-extrabold text-[#7c3aed]">
                {subtotal >= FREE_SHIPPING_THRESHOLD
                  ? 'Eligible'
                  : `Add ${formatNGN(remainingForFree)}`}
              </span>
            </div>
            <div className="w-full bg-purple-200/50 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#7c3aed] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressToFree}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-sm">Your cart is empty</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                  Explore verified smartphones, laptops, audio gear, and gadgets.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-2 inline-block bg-[#7c3aed] text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-[#6d28d9] transition-colors"
                >
                  Explore Gadgets
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-purple-200 transition-colors shadow-sm"
                >
                  <div className="relative w-16 h-16 rounded-lg bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100">
                    <img src={item.product.image} alt={item.product.name} className="object-contain p-1 w-full h-full" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs truncate hover:text-[#7c3aed] transition-colors">
                      {item.product.name}
                    </h4>
                    {item.selectedColor && (
                      <p className="text-[11px] text-slate-400 mt-0.5">Color: {item.selectedColor}</p>
                    )}
                    <div className="font-extrabold text-[#7c3aed] text-xs mt-1">
                      {formatNGN(item.product.price)}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 text-xs"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 text-xs"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Bar */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-3">
              {/* Promo Code Input */}
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-purple-700" />
                    <div>
                      <span className="font-bold text-purple-900">{appliedPromo.code}</span>
                      <span className="text-purple-600 ml-1.5 font-medium">
                        ({appliedPromo.discountType === 'percentage' ? `${appliedPromo.value}% OFF` : `${formatNGN(appliedPromo.value)} OFF`})
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code (e.g. GADGET10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600 uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
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

              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatNGN(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span>-{formatNGN(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline text-sm pt-1 border-t border-slate-200/60">
                  <span className="text-slate-800 font-bold">Total</span>
                  <span className="font-black text-[#7c3aed] text-base">{formatNGN(totalAfterDiscount)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="w-full py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold text-center transition-colors"
                >
                  View Full Cart
                </Link>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold transition-all shadow-md shadow-purple-900/20 flex items-center justify-center gap-1.5 group"
                >
                  Checkout <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
