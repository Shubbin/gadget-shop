import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Wrench, Users, LogOut,
  Menu, X, ExternalLink, Shield, ArrowUpRight, Plus, CreditCard, Tag, Settings
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import AdminLoginPage from '@/pages/admin/AdminLogin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdminAuthenticated, adminLogout, adminUser, products, orders, services, payments, promoCodes } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = location.pathname;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // If not authenticated, render the admin login page directly
  if (!isAdminAuthenticated) {
    return <AdminLoginPage />;
  }

  const pendingServices = services.filter((s) => s.status === 'pending').length;
  const processingOrders = orders.filter((o) => o.status === 'Processing').length;
  const pendingPayments = payments.filter((p) => p.status === 'pending_verification').length;

  const NAV_ITEMS = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products & Serials', href: '/admin/products', icon: Package, badge: products.length, badgeColor: 'bg-slate-800 text-slate-300' },
    { name: 'Orders & Waybills', href: '/admin/orders', icon: ShoppingCart, badge: processingOrders > 0 ? `${processingOrders} new` : undefined, badgeColor: 'bg-purple-900/60 text-purple-300 border border-purple-700/50' },
    { name: 'Payments & Ledger', href: '/admin/payments', icon: CreditCard, badge: pendingPayments > 0 ? `${pendingPayments} verify` : undefined, badgeColor: 'bg-amber-900/60 text-amber-300 border border-amber-700/50' },
    { name: 'Services & Swaps', href: '/admin/services', icon: Wrench, badge: pendingServices > 0 ? `${pendingServices}` : undefined, badgeColor: 'bg-blue-900/60 text-blue-300 border border-blue-700/50' },
    { name: 'Customer CRM', href: '/admin/customers', icon: Users },
    { name: 'Promos & Banners', href: '/admin/promos', icon: Tag, badge: promoCodes.filter(p => p.active).length, badgeColor: 'bg-slate-800 text-slate-300' },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const breadcrumb = pathname === '/admin' ? 'Overview' : pathname.replace('/admin/', '').replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row antialiased">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-slate-950 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button onClick={() => setMobileOpen(true)} className="p-2 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors" aria-label="Open navigation">
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/admin" className="flex items-center gap-2">
            <span className="font-black text-white text-sm tracking-tight">Gadget<span className="text-purple-400">Shop</span></span>
            <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800/80 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">HQ</span>
          </Link>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="text-[11px] font-semibold text-slate-300 bg-slate-800/80 border border-slate-700 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
          Live Shop <ExternalLink className="w-3 h-3" />
        </a>
      </header>

      {/* Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-72 h-screen bg-slate-950 text-slate-300 flex flex-col justify-between p-5 border-r border-slate-800/80 transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}`}>
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight">Gadget<span className="text-purple-400">Shop</span></span>
              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800/80 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">HQ</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Workspace Card */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/20 border border-[#7c3aed]/40 text-purple-300 flex items-center justify-center flex-shrink-0 font-black text-xs">GS</div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">Gadget Shop Central</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Lagos Main Hub · Online
              </div>
            </div>
          </div>

          {/* Nav */}
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Operations Console</div>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} to={item.href}
                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive ? 'bg-[#7c3aed] text-white shadow-lg shadow-purple-950/40' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>{item.badge}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-900 space-y-3">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-colors">
            <span className="flex items-center gap-2"><ExternalLink className="w-3.5 h-3.5" /> Customer Storefront</span>
            <span className="text-[10px] font-mono text-slate-600">:3000</span>
          </a>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">AD</div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{adminUser?.email || 'admin@gadgetshop.ng'}</div>
                <div className="text-[10px] text-purple-400 font-semibold">Super Admin</div>
              </div>
            </div>
            <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors" title="Sign Out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Topbar */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200/80 px-8 items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-400">Admin HQ</span>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-slate-900 capitalize">{breadcrumb}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-700">Orders Synced</span>
            </div>
            <Link to="/admin/products"
              className="inline-flex items-center gap-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all">
              <Plus className="w-3.5 h-3.5" /> Add Product
            </Link>
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 px-3 py-1.5 rounded-xl transition-colors">
              View Store <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-slate-400 px-2 py-2 flex items-center justify-around z-40">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} to={item.href}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold transition-colors ${isActive ? 'text-[#7c3aed]' : 'text-slate-400 hover:text-slate-200'}`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#7c3aed]' : 'text-slate-400'}`} />
                <span className="truncate max-w-[55px]">{item.name.split(' ')[0]}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
