export type ProductCategory =
  | 'Smartphones'
  | 'Laptops'
  | 'Headphones & Earbuds'
  | 'Smartwatches'
  | 'Gaming'
  | 'Accessories'
  | 'Cameras'
  | 'Monitors'
  | 'Power Banks'
  | 'Apple Devices'
  | 'Samsung & Android'
  | 'Laptops & Computers'
  | 'Gaming & Consoles'
  | 'Other'
  | string;

export type StockStatus = 'available' | 'sold' | 'out_of_stock' | 'pre_order';

export type GadgetCondition =
  | 'brand_new'
  | 'london_used'
  | 'nigerian_used'
  | 'refurbished'
  | 'open_box'
  | string;

export interface StorageVariant {
  capacity: string;
  priceDelta: number;
  priceDifference?: number;
  available: boolean;
}

export interface ColorVariant {
  name: string;
  hex: string;
  available: boolean;
  image?: string;
}

export interface ProductSpec {
  name: string;
  value: string;
}

export interface Category {
  name: string;
  icon: string;
  count: string;
  image: string;
  parentCategory?: string;
  subCategories?: string[];
}

export interface HierarchicalCategory {
  id: string;
  name: string;
  icon: string;
  image: string;
  subCategories: string[];
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  parentCategory?: string;
  subCategory?: string;
  price: number;
  costPrice?: number;
  oldPrice?: number;
  discountBadge?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity?: number;
  lowStockThreshold?: number;
  stockStatus?: StockStatus;
  condition?: GadgetCondition;
  customConditionNote?: string;
  batteryHealth?: number; // e.g. 96 for 96%
  cosmeticGrade?: 'Grade A (Pristine)' | 'Grade B (Minor Wear)' | 'Grade C (Noticeable Wear)' | 'Brand New';
  serialNumber?: string;
  imei?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  image: string;
  images: string[];
  description: string;
  specs: ProductSpec[];
  colors?: { name: string; hex: string; image?: string }[];
  colorVariants?: ColorVariant[];
  storageOptions?: StorageVariant[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
  computedPrice?: number;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode?: string;
}

export type DeliveryMethodType = 'standard' | 'express' | 'pickup';

export interface DeliveryOption {
  id: DeliveryMethodType;
  name: string;
  duration: string;
  fee: number;
  description: string;
}

export type PaymentMethodType =
  | 'card'
  | 'transfer'
  | 'wallet'
  | 'cash_on_delivery'
  | 'pos_on_delivery'
  | 'pay_in_store';

export type DeliveryStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED';

export interface TrackingEvent {
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface OrderDelivery {
  deliveryId: string;
  provider: string;
  status: DeliveryStatus;
  trackingNumber: string;
  address: DeliveryAddress;
  estimatedDelivery: string;
  events: TrackingEvent[];
  riderName?: string;
  riderPhone?: string;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  delivery: OrderDelivery;
  paymentMethod: PaymentMethodType;
  paymentStatus?: 'paid' | 'pending' | 'failed' | 'refunded';
  paymentType?: 'physical' | 'gateway';
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  waybillNumber?: string;
  internalNotes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: DeliveryAddress;
  walletBalance: number;
  savedAddresses: DeliveryAddress[];
  createdAt: string;
  totalSpent?: number;
  ordersCount?: number;
  notes?: string;
}

export interface ServiceRequest {
  id: string;
  type: 'repair' | 'fix' | 'swap' | 'sell';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deviceCategory: string;
  deviceModel: string;
  deviceCondition: string;
  issueDescription?: string;
  desiredGadget?: string;
  estimatedQuote?: number;
  status: 'pending' | 'quoted' | 'in_progress' | 'completed' | 'declined';
  stage?: 'received' | 'diagnostic' | 'parts_wait' | 'bench_work' | 'quality_tested' | 'ready_for_pickup';
  technicianAssigned?: string;
  diagnosticChecks?: {
    screenWorking: boolean;
    touchResponsive: boolean;
    batteryHealth: number;
    faceIdOrFingerprint: boolean;
    camerasWorking: boolean;
    housingCondition: string;
  };
  createdAt: string;
  images?: string[];
  serviceMethod?: 'doorstep' | 'walkin';
  notes?: string;
}

// -------------------------------------------------------------
// Financial & Payment Tracking
// -------------------------------------------------------------
export type PaymentStatus = 'successful' | 'pending_verification' | 'failed' | 'refunded';

export interface PaymentRecord {
  id: string;
  transactionRef: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  fee: number;
  net: number;
  method: PaymentMethodType;
  channel: 'Paystack / Card' | 'Direct Bank Transfer' | 'POS on Delivery' | 'Cash';
  status: PaymentStatus;
  date: string;
  time: string;
  proofReceiptUrl?: string;
  transferDetails?: {
    senderBank: string;
    senderAccountName: string;
    receivingBank: string;
  };
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

// -------------------------------------------------------------
// Marketing & Promo Codes
// -------------------------------------------------------------
export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // e.g. 10 for 10% or 50000 for ₦50,000
  minOrderAmount: number;
  usesCount: number;
  maxUses: number;
  active: boolean;
  expiresAt: string;
  description: string;
}

// -------------------------------------------------------------
// Store Settings & Logistics Configuration
// -------------------------------------------------------------
export interface DeliveryZone {
  id: string;
  region: string;
  state: string;
  fee: number;
  estimatedDays: string;
  active: boolean;
}

export interface StoreBankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  active: boolean;
}

export interface AnnouncementBanner {
  enabled: boolean;
  message: string;
  linkText?: string;
  linkUrl?: string;
  bgColor?: string;
}
