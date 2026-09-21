import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, MapPin, Heart, Headphones,
  LogOut, ArrowRight, User, Wallet
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatNGN } from '@/data/products';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { orders } = useOrders();
  const { wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'addresses' | 'wishlist'>('dashboard');

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50/50">
        <div className="max-w-md w-full bg-white rounded-3xl border border-purple-100 p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">Sign In to Your Account</h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Access your order history, manage saved delivery addresses, track repair tickets, and check your store wallet credit.
            </p>
          </div>
          <div className="space-y-3">
            <Link to="/login?redirect=/account" className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all">
              Sign In to Account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register?redirect=/account" className="w-full py-3.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors">
              Create New Account (₦15,000 Credit)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const customerName = user.name || 'Shopper';
  const customerEmail = user.email || '';
  const initials = customerName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const walletBalance = user.walletBalance || 0;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-purple-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-purple-600/20">{initials}</div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Welcome back, {customerName.split(' ')[0]} 👋</h1>
            <p className="text-xs text-gray-500">{customerEmail} • Verified Member</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-purple-50 px-4 py-2 rounded-2xl border border-purple-100 text-right">
            <span className="text-[10px] uppercase font-bold text-purple-600 block">Wallet Credit</span>
            <span className="text-sm font-black text-purple-900">{formatNGN(walletBalance)}</span>
          </div>
          <button onClick={handleLogout} className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-xs font-bold transition-all flex items-center gap-1.5">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="col-span-1 bg-white rounded-3xl border border-purple-100 p-4 space-y-1 shadow-sm h-fit">
          {[
            { tab: 'dashboard' as const, icon: LayoutDashboard, label: 'Account Overview' },
          ].map(({ tab, icon: Icon, label }) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-colors ${activeTab === tab ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
          <Link to="/orders" className="w-full text-left px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 text-gray-600 hover:bg-gray-50 transition-colors">
            <ShoppingBag className="w-4 h-4" /> My Orders ({orders.length})
          </Link>
          <button onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-colors ${activeTab === 'addresses' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <MapPin className="w-4 h-4" /> Shipping Addresses
          </button>
          <button onClick={() => setActiveTab('wishlist')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-colors ${activeTab === 'wishlist' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Heart className="w-4 h-4" /> Saved Wishlist ({wishlist.length})
          </button>
          <div className="border-t border-gray-100 pt-2 space-y-1">
            <Link to="/swap" className="w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2.5 transition-colors">
              <ArrowRight className="w-4 h-4 text-purple-600" /> Trade-in / Swap Calculator
            </Link>
            <Link to="/services/repair" className="w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2.5 transition-colors">
              <Headphones className="w-4 h-4 text-purple-600" /> Book Device Repair
            </Link>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-3 space-y-6">
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Total Orders', value: totalOrdersCount, color: 'text-gray-900' },
                  { label: 'Active In-Transit', value: activeOrdersCount, color: 'text-purple-700' },
                  { label: 'Saved Items', value: wishlist.length, color: 'text-gray-900' },
                  { label: 'Store Credit', value: formatNGN(walletBalance), color: 'text-emerald-600' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white rounded-3xl border border-purple-100 p-5 shadow-sm">
                    <div className="text-xs text-gray-400 font-medium">{label}</div>
                    <div className={`text-2xl font-black mt-1 ${color}`}>{value}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-gray-900 text-sm">Recent Order Activity</h3>
                  <Link to="/orders" className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">View Full History <ArrowRight className="w-3 h-3" /></Link>
                </div>
                <div className="space-y-3">
                  {orders.length === 0 ? (
                    <p className="text-xs text-gray-400 py-6 text-center">No recent orders yet.</p>
                  ) : orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-purple-50/40 border border-purple-100 text-xs">
                      <div>
                        <div className="font-bold text-gray-900">Order #{order.id}</div>
                        <div className="text-gray-400">{order.date} • {formatNGN(order.total)}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">{order.status}</span>
                        <Link to={`/orders/${order.id}`} className="text-purple-700 font-bold hover:underline">Track</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3">Saved Shipping Addresses</h3>
              <div className="p-5 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-2 text-xs">
                <span className="bg-purple-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">Default Address</span>
                <h4 className="font-bold text-gray-900 text-sm pt-1">{user.address?.fullName || user.name}</h4>
                <p className="text-gray-700 leading-relaxed">{user.address?.address}, {user.address?.city}, {user.address?.state}, Nigeria</p>
                <p className="text-gray-500 font-medium">Contact Phone: {user.address?.phone || user.phone}</p>
              </div>
            </div>
          )}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3">Saved Wishlist ({wishlist.length})</h3>
              {wishlist.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">Your wishlist is currently empty.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {wishlist.map((prod) => (
                    <div key={prod.id} className="p-3 rounded-2xl border border-gray-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-gray-900">{prod.name}</div>
                        <div className="font-semibold text-purple-700 text-xs mt-0.5">{formatNGN(prod.price)}</div>
                      </div>
                      <Link to={`/products/${prod.id}`} className="text-xs font-bold text-purple-600 hover:underline">View</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
