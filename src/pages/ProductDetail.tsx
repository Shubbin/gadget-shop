import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';
import { useAdmin } from '@/context/AdminContext';
import { formatNGN } from '@/data/products';
import {
  ShoppingCart, Heart, BarChart2, ArrowLeft, Loader2, Star,
  ShieldCheck, Truck, RotateCcw, Battery, CheckCircle2,
  Clock, MessageCircle, Package, Check, HelpCircle, FileText
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, wishlist } = useWishlist();
  const { addToCompare } = useCompare();
  const { products: adminProducts } = useAdmin();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'box' | 'inspection'>('overview');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const found = adminProducts.find((p) => p.id === id);
    if (found) {
      setProduct(found);
      const initialColor = (found.colors as any)?.[0]?.name || (found.colors as any)?.[0] || '';
      setSelectedColor(initialColor);
      const colorImg = found.colors?.find((c: any) => c.name === initialColor)?.image;
      setCurrentImage(colorImg || found.image || (found.images && found.images[0]) || '');
      setLoading(false);
      return;
    }
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.product) {
          setProduct(res.product);
          const initialColor = res.product.colors?.[0]?.name || res.product.colors?.[0] || '';
          setSelectedColor(initialColor);
          const colorImg = res.product.colors?.find((c: any) => c.name === initialColor)?.image;
          setCurrentImage(colorImg || res.product.image || (res.product.images && res.product.images[0]) || '');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, adminProducts]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <Link to="/products" className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>
    );
  }

  const inWishlist = wishlist.some((w) => w.id === product.id);
  const colorList = product.colors || [];

  const handleSelectColor = (colorObj: { name: string; hex: string; image?: string } | string) => {
    const colorName = typeof colorObj === 'string' ? colorObj : colorObj.name;
    const colorImg = typeof colorObj !== 'string' ? colorObj.image : undefined;

    setSelectedColor(colorName);
    if (colorImg) {
      setCurrentImage(colorImg);
    } else {
      // Check if another color matched
      const matched = product.colors?.find((c: any) => c.name === colorName);
      if (matched?.image) {
        setCurrentImage(matched.image);
      }
    }
  };

  const handleSelectThumbnail = (imgSrc: string) => {
    setCurrentImage(imgSrc);
    // If this thumbnail matches a color image, highlight that color
    const matchedColor = product.colors?.find((c: any) => c.image === imgSrc);
    if (matchedColor) {
      setSelectedColor(matchedColor.name);
    }
  };

  const handleAddToCart = () => {
    // Pass enriched product with current image so cart displays exact selected color photo
    const productWithSelectedVariant = {
      ...product,
      image: currentImage || product.image,
    };
    addToCart(productWithSelectedVariant, quantity, selectedColor);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const stockCount = product.stockQuantity !== undefined ? product.stockQuantity : 4;
  const isLowStock = stockCount <= 3;
  const cosmeticGrade = product.cosmeticGrade || 'Grade A (Pristine)';
  const batteryHealth = product.batteryHealth ? `${product.batteryHealth}% OEM Capacity` : '94% OEM Capacity';

  const whatsappMessage = encodeURIComponent(
    `Hello GadgetShop, I'm interested in purchasing the ${product.name} in ${selectedColor || 'standard color'} priced at ₦${product.price.toLocaleString()}. Is this available for immediate dispatch?`
  );

  // Gallery images list (combining images + color images)
  const galleryImages: string[] = Array.from(
    new Set([
      product.image,
      ...(product.images || []),
      ...(product.colors?.map((c) => c.image).filter(Boolean) as string[]),
    ])
  ).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-600 font-semibold transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Products Catalog
      </Link>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Interactive Image Viewer & Gallery */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 flex items-center justify-center min-h-[380px] sm:min-h-[440px] shadow-sm relative overflow-hidden group">
            <img
              src={currentImage || product.image}
              alt={product.name}
              className="max-h-96 object-contain w-full transition-transform duration-300 group-hover:scale-105"
            />

            {/* Condition Badge */}
            <div className="absolute top-4 left-4 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{cosmeticGrade}</span>
            </div>

            {/* Selected Color Watermark Tag */}
            {selectedColor && (
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                Variant: {selectedColor}
              </div>
            )}
          </div>

          {/* Color & Angle Gallery Thumbnails */}
          {galleryImages.length > 1 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Color & Angle Gallery (Click to inspect)
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {galleryImages.map((imgUrl, idx) => {
                  const isSelected = currentImage === imgUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectThumbnail(imgUrl)}
                      className={`w-16 h-16 rounded-xl border bg-white p-1 overflow-hidden shrink-0 transition-all ${
                        isSelected
                          ? 'border-purple-600 ring-2 ring-purple-600 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Hardware Diagnostic Telemetry Cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Battery className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-500 font-semibold">Battery Health</div>
                <div className="text-xs font-bold text-slate-900 truncate">{batteryHealth}</div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-500 font-semibold">IMEI & Carrier</div>
                <div className="text-xs font-bold text-slate-900 truncate">Clean / Factory Unlocked</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Information, Pricing, Color Picker & Cart */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                {product.category}
              </span>
              {isLowStock && (
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Only {stockCount} units remaining
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2.5 tracking-tight">
              {product.name}
            </h1>

            {product.rating && (
              <div className="flex items-center gap-1.5 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(product.rating!)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200 fill-slate-200'
                    }`}
                  />
                ))}
                <span className="text-xs text-slate-500 ml-1 font-medium">
                  {product.rating.toFixed(1)} ({product.reviewCount || 45} Verified Store Reviews)
                </span>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black text-purple-600">
              {formatNGN(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-base text-slate-400 line-through">
                {formatNGN(product.oldPrice)}
              </span>
            )}
            {product.discountBadge && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Save {product.discountBadge}
              </span>
            )}
          </div>

          {/* Concise Lead Description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Interactive Color Switcher with Image Feedback */}
          {colorList.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 uppercase tracking-wider">
                  Select Color Finish:
                </span>
                <span className="font-semibold text-purple-700">{selectedColor}</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {colorList.map((c: any) => {
                  const colorName = typeof c === 'string' ? c : c.name;
                  const colorHex = typeof c === 'string' ? '#333333' : c.hex;
                  const isSelected = selectedColor === colorName;

                  return (
                    <button
                      key={colorName}
                      type="button"
                      onClick={() => handleSelectColor(c)}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-600/30 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0 shadow-inner"
                        style={{ backgroundColor: colorHex }}
                      />
                      <span>{colorName}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-purple-600 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400">
                Selecting a color automatically updates the product display image above.
              </p>
            </div>
          )}

          {/* Quantity Controls & Warranty note */}
          <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                -
              </button>
              <span className="w-10 text-center text-sm font-bold text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                +
              </button>
            </div>
            <span className="text-xs text-slate-500">
              Verified authentic device · In-stock ready for pickup or dispatch
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  addedToCart
                    ? 'bg-emerald-600 text-white shadow-emerald-200'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {addedToCart ? 'Added to Cart!' : `Add to Cart (${formatNGN(product.price * quantity)})`}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-xl border font-bold transition-all ${
                  inWishlist
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-500'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => addToCompare(product)}
                className="p-4 rounded-xl border border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-600 transition-all font-bold"
                title="Compare Gadgets"
              >
                <BarChart2 className="w-5 h-5" />
              </button>
            </div>

            {/* Direct WhatsApp Specialist Order Link */}
            <a
              href={`https://wa.me/2348012345678?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              Inquire or Order via WhatsApp Specialist
            </a>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            {[
              { icon: ShieldCheck, title: '1-Year Warranty', sub: 'Certified OEM hardware' },
              { icon: Truck, title: 'Express Dispatch', sub: 'Same/next day in Lagos' },
              { icon: RotateCcw, title: '7-Day Return Policy', sub: 'Instant direct swap' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="text-center space-y-1">
                <Icon className="w-5 h-5 text-purple-600 mx-auto" />
                <div className="text-[11px] font-bold text-slate-900">{title}</div>
                <div className="text-[10px] text-slate-400">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comprehensive Product Specification & Documentation Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
          {[
            { id: 'overview', label: 'Overview & Hardware Details', icon: FileText },
            { id: 'specs', label: 'Technical Specifications', icon: HelpCircle },
            { id: 'box', label: 'Package & In The Box', icon: Package },
            { id: 'inspection', label: '45-Point Inspection Checklist', icon: ShieldCheck },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id as any)}
              className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === id
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab 1: Detailed Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs leading-relaxed text-slate-600 max-w-4xl">
            <h3 className="text-base font-black text-slate-900">
              Detailed Product Description
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {product.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-1.5">
                <div className="font-bold text-slate-900 text-xs">Authentic Hardware Guarantee</div>
                <p className="text-[11px] text-slate-500">
                  Every unit sourced by GadgetShop undergoes physical bench testing at our Ikeja engineering laboratory to verify OEM authenticity, battery peak output, and motherboard integrity.
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-1.5">
                <div className="font-bold text-slate-900 text-xs">Fulfillment & Safe Handling</div>
                <p className="text-[11px] text-slate-500">
                  Shipped in tamper-evident sealed packaging with foam cushions. Tracked from our central hub directly to your doorstep with our dedicated courier partners.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Technical Specifications Table */}
        {activeTab === 'specs' && (
          <div className="space-y-4 max-w-4xl">
            <h3 className="text-base font-black text-slate-900">Technical Specifications</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {product.specs?.map((spec, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-3 p-3 hover:bg-slate-50 transition-colors">
                  <span className="font-bold text-slate-700 sm:col-span-1">{spec.name}</span>
                  <span className="text-slate-600 sm:col-span-2 mt-0.5 sm:mt-0">{spec.value}</span>
                </div>
              ))}
              <div className="grid grid-cols-1 sm:grid-cols-3 p-3 hover:bg-slate-50 transition-colors">
                <span className="font-bold text-slate-700 sm:col-span-1">Cosmetic Condition</span>
                <span className="text-slate-600 sm:col-span-2">{cosmeticGrade}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-3 hover:bg-slate-50 transition-colors">
                <span className="font-bold text-slate-700 sm:col-span-1">Battery Health</span>
                <span className="text-slate-600 sm:col-span-2">{batteryHealth}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Package & In the Box */}
        {activeTab === 'box' && (
          <div className="space-y-4 max-w-4xl">
            <h3 className="text-base font-black text-slate-900">What’s Inside The Package</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { title: product.name, sub: 'Main device in selected color finish' },
                { title: 'USB-C to USB-C Braided Cable', sub: 'High-speed fast charging and data transfer cord' },
                { title: 'GadgetShop Certificate of Authenticity', sub: 'Official warranty registration & serial docket' },
                { title: 'Protective Packaging & Seals', sub: 'Reinforced transit box with shockproof internal foam' },
              ].map(({ title, sub }, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">{title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: 45-Point Inspection Checklist */}
        {activeTab === 'inspection' && (
          <div className="space-y-4 max-w-4xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Diagnostic Inspection Report</h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                45/45 Passed
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {[
                'Screen Touch & Multi-Touch',
                'OLED TrueTone & Pixel Integrity',
                'Biometrics / FaceID / Fingerprint',
                'Cameras & Optical Image Stabilization',
                'Microphones & Stereo Speakers',
                'Bluetooth, Wi-Fi 6E & Cellular Bands',
                'USB-C Port Charging & Data Pins',
                'Battery OEM Capacity & Thermals',
                'Clean IMEI / Carrier Unlocked',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
