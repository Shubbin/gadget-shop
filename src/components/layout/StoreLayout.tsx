import React from 'react';
import { Outlet } from 'react-router-dom';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/components/layout/Navbar';
import Footer from '@/components/components/layout/Footer';
import MobileNav from '@/components/components/layout/MobileNav';
import CartDrawer from '@/components/components/cart/CartDrawer';
import CompareBar from '@/components/components/products/CompareBar';
import FloatingSupport from '@/components/components/ui/FloatingSupport';

export default function StoreLayout() {
  return (
    <>
      <div className="print:hidden">
        <AnnouncementBar />
        <Navbar />
      </div>
      <main className="flex-grow pb-16 md:pb-0 print:pb-0 print:p-0">
        <Outlet />
      </main>
      <div className="print:hidden">
        <Footer />
        <MobileNav />
        <CartDrawer />
        <CompareBar />
        <FloatingSupport />
      </div>
    </>
  );
}
