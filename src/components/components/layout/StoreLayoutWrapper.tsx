import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/components/layout/Navbar';
import Footer from '@/components/components/layout/Footer';
import MobileNav from '@/components/components/layout/MobileNav';
import CartDrawer from '@/components/components/cart/CartDrawer';
import CompareBar from '@/components/components/products/CompareBar';
import FloatingSupport from '@/components/components/ui/FloatingSupport';

export default function StoreLayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathname = location.pathname;
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // Dedicated isolated layout for admin: NO customer storefront header, footer, or chat floating buttons
    return <main className="min-h-screen bg-slate-50">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
      <CartDrawer />
      <CompareBar />
      <FloatingSupport />
    </>
  );
}
