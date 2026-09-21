import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Home, Grid, ShoppingBag, PackageCheck, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function MobileNav() {
  const location = useLocation();
  const pathname = location.pathname;
  const { totalItems } = useCart();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Categories', href: '/products', icon: Grid },
    { name: 'Cart', href: '/cart', icon: ShoppingBag, badge: totalItems },
    { name: 'Orders', href: '/orders', icon: PackageCheck },
    { name: 'Account', href: '/account', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
                isActive ? 'text-purple-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-purple-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
