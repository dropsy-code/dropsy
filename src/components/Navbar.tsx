import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Package, X } from 'lucide-react';
import { ProductCategory } from '../types';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenOrderTracker: () => void;
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenOrderTracker,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'All Collection' },
    { id: 'gadgets', label: 'Gadgets' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'lifestyle', label: 'Lifestyle' },
  ];

  const handleNavClick = (cat: ProductCategory) => {
    onSelectCategory(cat);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Bar Announcement */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span>Free standard delivery on all orders over $49</span>
        <span aria-hidden="true" className="text-slate-500">·</span>
        <span className="text-emerald-400 font-semibold">Cash on Delivery available nationwide</span>
      </div>

      {/* Strict 3-Zone Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          className="flex items-center gap-2 whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded"
        >
          <span className="text-2xl font-black tracking-tight text-slate-950 font-display">
            DROPSY
          </span>
          <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider text-slate-400 pl-1 border-l border-slate-200">
            Shop Smart
          </span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleNavClick(cat.id)}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                activeCategory === cat.id ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              {cat.label}
              {activeCategory === cat.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950 rounded-full" />
              )}
            </button>
          ))}
          <a
            href="#why-dropsy"
            className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Why Dropsy
          </a>
        </nav>

        {/* Zone 3: Functional Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Search Toggle */}
          <div className="relative">
            {showSearchInput ? (
              <div className="flex items-center bg-slate-100 rounded-lg px-2.5 py-1.5 w-44 sm:w-60 border border-slate-300">
                <Search className="w-4 h-4 text-slate-500 shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
                />
                <button
                  onClick={() => {
                    setShowSearchInput(false);
                    onSearchChange('');
                  }}
                  className="text-slate-400 hover:text-slate-700 ml-1"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Search store"
                title="Search products"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Track Order button */}
          <button
            onClick={onOpenOrderTracker}
            className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Track Your Order"
          >
            <Package className="w-5 h-5" />
            <span className="hidden xl:inline">Track</span>
          </button>

          {/* Wishlist button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="View Wishlist"
            title="View Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Primary CTA */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded text-[11px] tabular-nums font-bold">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Category Quick Bar */}
      <div className="md:hidden flex items-center gap-2 px-4 py-2 border-t border-slate-100 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleNavClick(cat.id)}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </header>
  );
};
