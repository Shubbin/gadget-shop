import React from 'react';
import { Link } from 'react-router-dom';

import { Star, Heart, ShoppingCart, Check, Scale } from 'lucide-react';
import { Product } from '@/types';
import { formatNGN } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, cart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();

  const isWishlisted = isInWishlist(product.id);
  const inCart = cart.some((item) => item.product.id === product.id);
  const compared = isInCompare(product.id);
  const isSold = product.stockStatus === 'sold';

  return (
    <div className={`group bg-white rounded-2xl border p-3.5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative ${
      isSold ? 'border-gray-200 opacity-90' : 'border-purple-100/80 hover:border-purple-300'
    }`}>
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
        {/* Condition Badge (London Used, Brand New, etc.) */}
        {product.condition && (
          <span className="bg-purple-900/90 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm backdrop-blur-sm">
            {product.condition}
          </span>
        )}

        {isSold && (
          <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
            Sold Out
          </span>
        )}

        {product.discountBadge && !isSold && (
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            -{product.discountBadge}
          </span>
        )}
      </div>

      {/* Wishlist & Compare Buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 flex items-center justify-center transition-all shadow-sm ${
            isWishlisted ? 'text-rose-500 bg-rose-50 border-rose-200' : 'text-slate-400 hover:text-rose-500 hover:scale-110'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            addToCompare(product);
          }}
          className={`w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border flex items-center justify-center transition-all shadow-sm ${
            compared ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-200 text-slate-400 hover:text-purple-600'
          }`}
          title={compared ? 'Remove from comparison' : 'Compare gadget'}
        >
          <Scale className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product Image Link */}
      <Link to={`/products/${product.id}`} className="block relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50/80 mb-3">
        <img
          src={product.image}
          alt={product.name}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className={`object-contain p-2 group-hover:scale-105 transition-transform duration-300 ease-out ${
            isSold ? 'grayscale-[30%]' : ''
          }`}
        />
        {isSold && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
            <span className="px-3 py-1 bg-red-600/90 text-white font-black text-xs uppercase tracking-widest rounded-lg transform -rotate-12 shadow-lg">
              Sold
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium mb-1">
            <span>{product.category}</span>
            {product.subCategory && <span>{product.subCategory}</span>}
          </div>

          <Link to={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-slate-900 text-sm hover:text-purple-700 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 my-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-800">{product.rating}</span>
            <span className="text-[11px] text-slate-400 font-medium">({product.reviewCount})</span>
          </div>

          {/* Description snippet */}
          {product.description && (
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mt-1">
              {product.description}
            </p>
          )}

          {/* Color Finish Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 my-1">
              <span className="text-[10px] text-slate-400 font-medium">Colors:</span>
              <div className="flex items-center gap-1">
                {product.colors.slice(0, 4).map((c) => (
                  <span
                    key={c.name}
                    title={c.name}
                    className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-2xs"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-[9px] text-slate-400">+{product.colors.length - 4}</span>
                )}
              </div>
            </div>
          )}

          {/* Storage Options Pills if available */}
          {product.storageOptions && product.storageOptions.length > 0 && (
            <div className="flex items-center gap-1 my-1 overflow-x-hidden">
              {product.storageOptions.slice(0, 3).map((st) => (
                <span
                  key={st.capacity}
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100"
                >
                  {st.capacity}
                </span>
              ))}
              {product.storageOptions.length > 3 && (
                <span className="text-[9px] text-gray-400">+{product.storageOptions.length - 3}</span>
              )}
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
          <div>
            <div className="font-black text-slate-900 text-sm sm:text-base tracking-tight">
              {formatNGN(product.price)}
            </div>
            {product.oldPrice && (
              <div className="text-[11px] text-slate-400 line-through font-medium">
                {formatNGN(product.oldPrice)}
              </div>
            )}
          </div>

          {isSold ? (
            <span className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-400 text-xs font-bold">
              Sold
            </span>
          ) : (
            <button
              onClick={() => addToCart(product, 1)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                inCart
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-900/20 active:scale-95'
              }`}
              title={inCart ? 'Added to Cart' : 'Add to Cart'}
            >
              {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
