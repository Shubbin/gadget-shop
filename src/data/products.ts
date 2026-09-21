import { Product, ProductCategory } from '@/types';

/**
 * ========================================================================
 * NOTE: Mock product data has been migrated to the Node.js backend database
 * (see server/src/db/seedData.ts and server/src/db/index.ts).
 * All catalog data is now seeded and fetched dynamically via API endpoints!
 * ========================================================================
 */

/*
export const MOCK_PRODUCTS_BACKUP: Product[] = [
  // Migrated to backend repository seedData.ts:
  // - iPhone 16 Pro
  // - MacBook Air M3
  // - Sony WH-1000XM5
  // - Samsung Galaxy Buds3
  // - Apple Watch Series 10
  // - PlayStation 5
  // - Anker Power Bank
  // - Logitech MX Master 3S
  // - Samsung Galaxy S25 Ultra
  // - Dell UltraSharp 27 4K
  // - Sony Alpha 7 IV
  // - Keychron K2
];
*/

// Static categories reference for instant fallback rendering if offline
export const CATEGORIES = [
  { name: 'Smartphones', icon: 'Smartphone', count: '12+ products', image: '/images/categories/smartphones.jpg' },
  { name: 'Laptops', icon: 'Laptop', count: '8+ products', image: '/images/categories/laptops.jpg' },
  { name: 'Headphones & Earbuds', icon: 'Headphones', count: '15+ products', image: '/images/categories/headphones.jpg' },
  { name: 'Smartwatches', icon: 'Watch', count: '10+ products', image: '/images/categories/smartwatches.jpg' },
  { name: 'Accessories', icon: 'Gamepad2', count: '20+ products', image: '/images/categories/accessories.jpg' }
];

export function formatNGN(amount?: number | string | null): string {
  const num = typeof amount === 'number' ? amount : Number(amount);
  const safeAmount = isNaN(num) ? 0 : num;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(safeAmount).replace('NGN', '₦');
}

