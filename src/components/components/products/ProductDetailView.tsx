import React, { useState, useMemo } from 'react';

import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingCart,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  Scale,
  Repeat,
  Sparkles,
  Info
} from 'lucide-react';
import { formatNGN } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';
import { Product } from '@/types';

export default function ProductDetailView({ product }: { product: Product }) {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string>(product.image);

  // Storage selection
  const initialStorage = product.storageOptions && product.storageOptions.length > 0
    ? product.storageOptions[0].capacity
    : '';
  const [selectedStorage, setSelectedStorage] = useState<string>(initialStorage);

  // Color selection
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0].name : ''
  );

  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();

  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const isSold = product.stockStatus === 'sold';

  // Compute dynamic price based on storage option
  const currentPrice = useMemo(() => {
    let price = product.price;
    if (selectedStorage && product.storageOptions) {
      const option = product.storageOptions.find((o) => o.capacity === selectedStorage);
      if (option && option.priceDifference) {
        price += option.priceDifference;
      }
    }
    return price;
  }, [product.price, selectedStorage, product.storageOptions]);

  const handleAddToCart = () => {
    if (isSold) return;
    // We pass product with updated computed price and selectedStorage
    const configuredProduct = {
      ...product,
      price: currentPrice,
    };
    addToCart(configuredProduct, quantity, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isSold) return;
    const configuredProduct = {
      ...product,
      price: currentPrice,
    };
    addToCart(configuredProduct, quantity, selectedColor);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-purple-700">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-purple-700">Products</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-purple-700">
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl border border-purple-100 p-6 md:p-10 shadow-sm">
        {/* Left: Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl bg-slate-50/80 border border-purple-50 overflow-hidden">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              priority
              className="object-contain p-6 transition-all duration-300"
            />
            {isSold && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                <span className="px-5 py-2 bg-red-600 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-lg transform -rotate-6">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 bg-slate-50 transition-all ${
                    selectedImage === img ? 'border-purple-600 ring-2 ring-purple-200' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumb ${idx}`} className="object-contain p-2" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Controls */}
        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">
                {product.category}
              </span>

              {/* Condition Badge */}
              {product.condition && (
                <span className="bg-purple-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {product.condition}
                </span>
              )}

              {isSold ? (
                <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                  Sold Out
                </span>
              ) : (
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Available in Stock
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.reviewCount} verified reviews)</span>
            </div>
          </div>

          {/* Pricing with dynamic tier updates */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-slate-100">
            <span className="text-3xl font-extrabold text-purple-900 tracking-tight">
              {formatNGN(currentPrice)}
            </span>
            {product.oldPrice && (
              <span className="text-sm font-medium text-slate-400 line-through">
                {formatNGN(product.oldPrice)}
              </span>
            )}
            {product.discountBadge && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-md">
                Save {product.discountBadge}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Storage Capacity Selector */}
          {product.storageOptions && product.storageOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Storage Tier:</span>
                <span className="text-purple-700 font-bold">{selectedStorage}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.storageOptions.map((st) => (
                  <button
                    key={st.capacity}
                    type="button"
                    onClick={() => setSelectedStorage(st.capacity)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedStorage === st.capacity
                        ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-200'
                        : 'border-slate-200 text-slate-700 hover:border-purple-300'
                    }`}
                  >
                    {st.capacity}
                    {st.priceDifference ? ` (+${formatNGN(st.priceDifference)})` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Color Finish: <span className="text-purple-700">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      selectedColor === c.name
                        ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-200'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: c.hex }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trade-in & Swap Banner Link */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Repeat className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">Want to Trade-in or Swap?</div>
                <div className="text-[11px] text-gray-500">Calculate trade-in value of your current device towards this item.</div>
              </div>
            </div>
            <Link
              to="/swap"
              className="px-3 py-1.5 bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold transition-all shrink-0"
            >
              Swap Now
            </Link>
          </div>

          {/* Key Specifications Table */}
          {product.specs && product.specs.length > 0 && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {product.specs.map((spec, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-slate-400 font-medium">{spec.name}</span>
                    <span className="text-slate-900 font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  disabled={isSold}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-bold text-slate-900">
                  {quantity}
                </span>
                <button
                  disabled={isSold}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                {isWishlisted ? 'Saved' : 'Wishlist'}
              </button>

              <button
                onClick={() => addToCompare(product)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${
                  isCompared
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Scale className="w-4 h-4" />
                {isCompared ? 'Compared' : 'Compare'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                disabled={isSold}
                onClick={handleAddToCart}
                className={`py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                  isSold
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-900/20'
                }`}
              >
                {isSold ? (
                  'Out of Stock'
                ) : added ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>

              <button
                disabled={isSold}
                onClick={handleBuyNow}
                className="py-3.5 px-6 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Delivery Highlights */}
          <div className="border-t border-slate-100 pt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-purple-600" />
              <span>Doorstep Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Tested & Warrantied</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-purple-600" />
              <span>Physical or Online Pay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
