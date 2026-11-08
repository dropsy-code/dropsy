import React, { useState, useEffect, useMemo } from 'react';
import {
  Navbar,
} from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { SupplierPartnerModal } from './components/SupplierPartnerModal';
import { WhyDropsy } from './components/WhyDropsy';
import { Footer } from './components/Footer';

import { PRODUCTS as INITIAL_PRODUCTS } from './data/products';
import { Product, CartItem, Order, ProductCategory, Review } from './types';
import {
  SlidersHorizontal,
  ShieldCheck,
  Building2,
  TrendingUp,
  Sparkles,
  ArrowUpDown,
  Search,
} from 'lucide-react';

export default function App() {
  // Products state (enhanced with dynamic user reviews from localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const savedReviews = localStorage.getItem('dropsy_user_reviews');
      if (savedReviews) {
        const parsedReviews: Record<string, Review[]> = JSON.parse(savedReviews);
        return INITIAL_PRODUCTS.map((prod) => {
          const custom = parsedReviews[prod.id] || [];
          const allReviews = [...(prod.reviews || []), ...custom];
          if (allReviews.length > 0) {
            const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
            const avg = Number((sum / allReviews.length).toFixed(1));
            return {
              ...prod,
              reviews: allReviews,
              rating: avg,
              reviewsCount: (prod.reviewsCount || 0) + custom.length,
            };
          }
          return prod;
        });
      }
    } catch (e) {
      console.error('Error loading saved reviews', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Cart & Wishlist state with local persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dropsy_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('dropsy_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('dropsy_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');
  const [codOnlyFilter, setCodOnlyFilter] = useState(false);
  const [isWholesaleMode, setIsWholesaleMode] = useState(false);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productModalInitialTab, setProductModalInitialTab] = useState<'overview' | 'reviews'>('overview');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directCheckoutItem, setDirectCheckoutItem] = useState<CartItem | null>(null);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  // Save cart, wishlist, orders
  useEffect(() => {
    localStorage.setItem('dropsy_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('dropsy_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('dropsy_orders', JSON.stringify(orders));
  }, [orders]);

  // Handle adding customer reviews & rating
  const handleAddReview = (
    productId: string,
    newReviewData: Omit<Review, 'id' | 'productId' | 'date' | 'helpfulCount'>
  ) => {
    const newReview: Review = {
      ...newReviewData,
      id: `rev-custom-${Date.now()}`,
      productId,
      date: 'Just now',
      helpfulCount: 0,
    };

    // Update in localStorage
    try {
      const saved = localStorage.getItem('dropsy_user_reviews');
      const existingReviews: Record<string, Review[]> = saved ? JSON.parse(saved) : {};
      const productCustomReviews = existingReviews[productId] || [];
      existingReviews[productId] = [newReview, ...productCustomReviews];
      localStorage.setItem('dropsy_user_reviews', JSON.stringify(existingReviews));
    } catch (e) {
      console.error('Failed to save review', e);
    }

    // Update state & recalculate average rating
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const updatedReviews = [newReview, ...(prod.reviews || [])];
          const sum = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
          const newAvg = Number((sum / updatedReviews.length).toFixed(1));
          const updatedProduct = {
            ...prod,
            reviews: updatedReviews,
            rating: newAvg,
            reviewsCount: prod.reviewsCount + 1,
          };
          if (selectedProduct && selectedProduct.id === productId) {
            setSelectedProduct(updatedProduct);
          }
          return updatedProduct;
        }
        return prod;
      })
    );
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (it) =>
          it.product.id === product.id &&
          it.selectedColor === color &&
          it.selectedSize === size
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    setCart((prev) =>
      prev.map((it) => {
        if (
          it.product.id === productId &&
          it.selectedColor === color &&
          it.selectedSize === size
        ) {
          return { ...it, quantity };
        }
        return it;
      })
    );
  };

  const handleRemoveFromCart = (productId: string, color?: string, size?: string) => {
    setCart((prev) =>
      prev.filter(
        (it) =>
          !(
            it.product.id === productId &&
            it.selectedColor === color &&
            it.selectedSize === size
          )
      )
    );
  };

  // Direct buy with Cash on Delivery shortcut
  const handleDirectBuyCod = (product: Product, quantity = 1, color?: string, size?: string) => {
    setDirectCheckoutItem({
      product,
      quantity,
      selectedColor: color,
      selectedSize: size,
    });
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Order success handler
  const handleOrderSuccess = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    if (!directCheckoutItem) {
      setCart([]);
    }
    setDirectCheckoutItem(null);
  };

  // Quick view triggers
  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setProductModalInitialTab('overview');
  };

  const handleViewReviews = (product: Product) => {
    setSelectedProduct(product);
    setProductModalInitialTab('reviews');
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (activeCategory !== 'all' && p.category !== activeCategory) {
          return false;
        }
        if (codOnlyFilter && !p.codAvailable) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          return matchTitle || matchDesc || matchCat;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
      });
  }, [products, activeCategory, searchQuery, sortBy, codOnlyFilter]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Navbar with 3-zone contract */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
      />

      {/* Hero Section */}
      <Hero
        onExploreClick={() => {
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenSupplierModal={() => setIsSupplierModalOpen(true)}
        onOpenCodGuide={() => {
          const el = document.getElementById('why-dropsy');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Catalog Section */}
      <main id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full flex-1">
        {/* Catalog Control Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-slate-900" />
              <span>Verified Storefront Collection</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 font-display mt-0.5">
              Explore Trending Products
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing <span className="font-bold text-slate-900 tabular-nums">{filteredProducts.length}</span> items
              {activeCategory !== 'all' && <span> in {activeCategory}</span>}
              {searchQuery && <span> matching "{searchQuery}"</span>}
            </p>
          </div>

          {/* Filter Controls & Wholesale Mode Toggle */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
            {/* Cash on Delivery Only Filter Toggle */}
            <button
              onClick={() => setCodOnlyFilter(!codOnlyFilter)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                codOnlyFilter
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>COD Eligible Only</span>
            </button>

            {/* Wholesale Partner View Switcher */}
            <button
              onClick={() => setIsWholesaleMode(!isWholesaleMode)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                isWholesaleMode
                  ? 'bg-slate-900 border-slate-900 text-emerald-400'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
              }`}
              title="Toggle Wholesale / Dropshipper margins & cost view"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{isWholesaleMode ? 'Wholesale Margins Active' : 'Wholesale View'}</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-slate-900 focus:outline-none cursor-pointer font-medium"
              >
                <option value="featured">Featured / Trending</option>
                <option value="rating">Highest Customer Rated</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Wholesale Mode Notice Banner */}
        {isWholesaleMode && (
          <div className="my-4 p-3.5 bg-slate-900 text-white rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md animate-fade-in">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong className="text-emerald-400 font-semibold">Wholesale Partner Mode Enabled:</strong> Showing unit procurement costs, suggested MRPs, and net margins (55%–70%). MOQ is 1 unit for dropshipping.
              </span>
            </div>
            <button
              onClick={() => setIsSupplierModalOpen(true)}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-md text-[11px] whitespace-nowrap transition-colors"
            >
              Supplier Hub & Calculator
            </button>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-dashed border-slate-300 mt-6">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No products found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any items matching your active filters. Try searching for "earbuds", "overshirt", "watch", or clear filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setCodOnlyFilter(false);
              }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlist.some((w) => w.id === product.id)}
                onQuickView={handleQuickView}
                onViewReviews={handleViewReviews}
                isWholesaleMode={isWholesaleMode}
              />
            ))}
          </div>
        )}
      </main>

      {/* Why Dropsy & Pincode COD Checker */}
      <WhyDropsy />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenSupplierModal={() => setIsSupplierModalOpen(true)}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
      />

      {/* PRODUCT DETAIL & REVIEW MODAL */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty, color, size) => {
          handleAddToCart(p, qty, color, size);
          setSelectedProduct(null);
        }}
        onDirectBuyCod={handleDirectBuyCod}
        onAddReview={handleAddReview}
        isWishlisted={selectedProduct ? wishlist.some((w) => w.id === selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        initialTab={productModalInitialTab}
      />

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onExplore={() => {
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* WISHLIST DRAWER */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onClearWishlist={() => setWishlist([])}
      />

      {/* CHECKOUT MODAL WITH CASH ON DELIVERY */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setDirectCheckoutItem(null);
        }}
        items={cart}
        initialItem={directCheckoutItem}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* ORDER TRACKER MODAL */}
      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        recentOrders={orders}
      />

      {/* SUPPLIER & DROPSHIPPING PARTNER HUB MODAL */}
      <SupplierPartnerModal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
      />
    </div>
  );
}
