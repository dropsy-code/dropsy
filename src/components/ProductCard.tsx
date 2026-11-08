import React from 'react';
import { Heart, Star, ShoppingBag, Eye, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onQuickView: (product: Product) => void;
  onViewReviews: (product: Product) => void;
  isWholesaleMode?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onQuickView,
  onViewReviews,
  isWholesaleMode = false,
}) => {
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const wholesaleMargin = product.price - product.wholesalePrice;
  const wholesaleMarginPercent = Math.round((wholesaleMargin / product.price) * 100);

  // Fallback image handler
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src =
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-md overflow-hidden">
      {/* Top Media Area */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Stamped Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.isTrending && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded">
              Trending
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Floating Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 text-slate-700 hover:bg-white hover:text-slate-950'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Quick View Hover Strip */}
        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-md shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Unboxed Metadata & Reviews */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[11px] text-slate-600">
              {product.category}
            </span>

            {/* Clickable Average Rating */}
            <button
              onClick={() => onViewReviews(product)}
              className="flex items-center gap-1 hover:text-slate-900 transition-colors group/rate"
              title="Click to view all reviews"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-900 tabular-nums text-xs">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-slate-500 tabular-nums group-hover/rate:underline text-[11px]">
                ({product.reviewsCount})
              </span>
            </button>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-sm font-semibold text-slate-900 leading-snug hover:text-slate-700 transition-colors cursor-pointer line-clamp-2"
          >
            {product.title}
          </h3>

          {/* COD Notice */}
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Cash on Delivery Available</span>
          </div>
        </div>

        {/* Pricing & Cart Action */}
        <div className="pt-2 border-t border-slate-100">
          {/* Wholesale Mode Box */}
          {isWholesaleMode && (
            <div className="mb-2 p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
              <div className="flex justify-between text-slate-600">
                <span>Wholesale Cost:</span>
                <span className="font-bold text-slate-900 font-mono">₹{product.wholesalePrice}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold mt-0.5">
                <span>Est. Net Margin:</span>
                <span className="font-mono">{wholesaleMarginPercent}% (₹{wholesaleMargin})</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold text-slate-950 font-mono tabular-nums">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-xs text-slate-600 line-through font-mono tabular-nums">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              </div>
              <span className="text-[10px] text-slate-600 block">Inclusive of all taxes</span>
            </div>

            <button
              onClick={() => onAddToCart(product)}
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs active:scale-95"
              aria-label={`Add ${product.title} to bag`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
