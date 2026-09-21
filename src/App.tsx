import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Contexts
import { AdminProvider } from '@/context/AdminContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { CartDrawerProvider } from '@/context/CartDrawerContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { OrderProvider } from '@/context/OrderContext';
import { CompareProvider } from '@/context/CompareContext';

// Layouts
import StoreLayout from '@/components/layout/StoreLayout';
import AdminLayout from '@/components/layout/AdminLayout';

// Public Pages
import HomePage from '@/pages/Home';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';
import ProductsPage from '@/pages/Products';
import ProductDetailPage from '@/pages/ProductDetail';
import CartPage from '@/pages/Cart';
import CheckoutPage from '@/pages/Checkout';
import OrdersPage from '@/pages/Orders';
import AccountPage from '@/pages/Account';
import ServicesPage from '@/pages/Services';
import SwapPage from '@/pages/Swap';
import ComparePage from '@/pages/Compare';
import OrderDetailPage from '@/pages/OrderDetail';
import TrackOrderPage from '@/pages/TrackOrder';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminCustomers from '@/pages/admin/AdminCustomers';
import AdminServices from '@/pages/admin/AdminServices';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminPayments from '@/pages/admin/AdminPayments';
import AdminPromos from '@/pages/admin/AdminPromos';
import AdminSettings from '@/pages/admin/AdminSettings';

export default function App() {
  return (
    <AdminProvider>
      <AuthProvider>
        <CartProvider>
          <CartDrawerProvider>
            <WishlistProvider>
              <OrderProvider>
                <CompareProvider>
                  <BrowserRouter>
                    <Routes>
                      {/* Admin Routes — isolated layout */}
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route
                        path="/admin"
                        element={<AdminLayout><AdminDashboard /></AdminLayout>}
                      />
                      <Route
                        path="/admin/products"
                        element={<AdminLayout><AdminProducts /></AdminLayout>}
                      />
                      <Route
                        path="/admin/orders"
                        element={<AdminLayout><AdminOrders /></AdminLayout>}
                      />
                      <Route
                        path="/admin/payments"
                        element={<AdminLayout><AdminPayments /></AdminLayout>}
                      />
                      <Route
                        path="/admin/services"
                        element={<AdminLayout><AdminServices /></AdminLayout>}
                      />
                      <Route
                        path="/admin/customers"
                        element={<AdminLayout><AdminCustomers /></AdminLayout>}
                      />
                      <Route
                        path="/admin/promos"
                        element={<AdminLayout><AdminPromos /></AdminLayout>}
                      />
                      <Route
                        path="/admin/settings"
                        element={<AdminLayout><AdminSettings /></AdminLayout>}
                      />

                      {/* Public Store Routes */}
                      <Route element={<StoreLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/orders/:id" element={<OrderDetailPage />} />
                        <Route path="/account" element={<AccountPage />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/swap" element={<SwapPage />} />
                        <Route path="/compare" element={<ComparePage />} />
                        <Route path="/track" element={<TrackOrderPage />} />
                        {/* Catch-all redirect */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Route>
                    </Routes>
                  </BrowserRouter>
                </CompareProvider>
              </OrderProvider>
            </WishlistProvider>
          </CartDrawerProvider>
        </CartProvider>
      </AuthProvider>
    </AdminProvider>
  );
}
