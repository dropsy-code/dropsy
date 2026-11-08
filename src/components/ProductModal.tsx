import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ThumbsUp,
  MessageSquarePlus,
  Send,
  Heart,
} from 'lucide-react';
import { Product, Review } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
  onDirectBuyCod: (product: Product, quantity: number, color?: string, size?: string) => void;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'productId' | 'date' | 'helpfulCount'>) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  initialTab?: 'overview' | 'reviews';
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onDirectBuyCod,
  onAddReview,
  isWishlisted,
  onToggleWishlist,
  initialTab = 'overview',
}) => {
  if (!isOpen || !product) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'specs'>(initialTab);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0] : ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );
  const [quantity, setQuantity] = useState(1);

  // Review Form States
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [reviewSubmittedToast, setReviewSubmittedToast] = useState(false);

  // Filter reviews
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  const reviewsList = product.reviews || [];
  const filteredReviews = filterRating === 'all'
    ? reviewsList
    : reviewsList.filter((r) => r.rating === filterRating);

  // Calculate star distributions
  const starCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviewsList.filter((r) => r.rating === stars).length;
    const percentage = reviewsList.length > 0 ? Math.round((count / reviewsList.length) * 100) : 0;
    return { stars, count, percentage };
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formTitle.trim() || !formComment.trim()) return;

    onAddReview(product.id, {
      userName: formName.trim(),
      rating: formRating,
      title: formTitle.trim(),
      comment: formComment.trim(),
      isVerifiedPurchase: true,
      location: formLocation.trim() || 'Verified Buyer, India',
    });

    setFormName('');
    setFormLocation('');
    setFormTitle('');
    setFormComment('');
    setShowReviewForm(false);
    setReviewSubmittedToast(true);
    setTimeout(() => setReviewSubmittedToast(false), 4000);
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 rounded-full shadow-md transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Container */}
        <div className="overflow-y-auto p-4 sm:p-6 sm:pb-8">
          {/* Top Split: Media Gallery Left + Purchase Module Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Left: Product Media Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-[4/3] sm:aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={product.image}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded">
                    {discountPercent}% OFF
                  </span>
                )}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-sm transition-colors ${
                    isWishlisted ? 'bg-rose-50 text-rose-600' : 'bg-white/80 text-slate-700 hover:bg-white'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>
              </div>

              {/* Service Assurance Badges */}
              <div className="grid grid-cols-3 gap-2 py-3 px-2 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-600">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-semibold text-slate-900">Pay on Arrival</span>
                  <span className="text-[10px] text-slate-500">COD Available</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-x border-slate-200">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span className="text-[11px] font-semibold text-slate-900">Fast Express</span>
                  <span className="text-[10px] text-slate-500">2-4 Days Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span className="text-[11px] font-semibold text-slate-900">Easy Returns</span>
                  <span className="text-[10px] text-slate-500">7-Day Guarantee</span>
                </div>
              </div>
            </div>

            {/* Right: Contiguous Purchase Module */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                {/* Category & Average Rating */}
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="uppercase font-bold tracking-wider text-slate-600">
                    {product.category}
                  </span>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="flex items-center gap-1.5 hover:text-slate-900 text-slate-700 font-medium transition-colors"
                  >
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= Math.round(product.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-slate-500 text-[11px] underline">
                      ({product.reviewsCount} reviews)
                    </span>
                  </button>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-slate-950 font-display mt-1 leading-snug">
                  {product.title}
                </h1>

                {/* Price Display */}
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono tabular-nums">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-sm sm:text-base text-slate-600 line-through font-mono tabular-nums">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Save ₹{(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Inclusive of all taxes · Free delivery on orders over ₹999
                </div>

                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Color Variants */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                      Color / Style: <span className="font-normal text-slate-600">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                            selectedColor === color
                              ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                              : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Variants */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                      Select Size: <span className="font-normal text-slate-600">{selectedSize}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-10 h-9 flex items-center justify-center text-xs font-semibold rounded-lg border transition-colors ${
                            selectedSize === size
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Stepper */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-900">Quantity:</span>
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-slate-600 hover:bg-slate-200 transition-colors text-sm font-bold"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-slate-900 font-mono tabular-nums bg-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-slate-600 hover:bg-slate-200 transition-colors text-sm font-bold"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-col gap-2.5">
                {/* Cash on Delivery Buy Button (Highlighted) */}
                <button
                  onClick={() => onDirectBuyCod(product, quantity, selectedColor, selectedSize)}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Order with Cash on Delivery (Pay ₹{(product.price * quantity).toLocaleString()} on Arrival)</span>
                </button>

                {/* Regular Add to Bag Button */}
                <button
                  onClick={() => onAddToCart(product, quantity, selectedColor, selectedSize)}
                  className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          </div>

          {/* Toast Notice for Submitted Review */}
          {reviewSubmittedToast && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-medium flex items-center gap-2 shadow-sm animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thank you! Your verified product review and rating have been posted.</span>
            </div>
          )}

          {/* Bottom Tabs: Features vs Specs vs Reviews */}
          <div className="mt-10 border-t border-slate-200 pt-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Key Highlights
              </button>
              {product.specs && (
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                    activeTab === 'specs'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Specifications
                </button>
              )}
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Customer Reviews</span>
                <span className="text-xs bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded-full tabular-nums">
                  {reviewsList.length}
                </span>
              </button>
            </div>

            {/* TAB CONTENT: HIGHLIGHTS */}
            {activeTab === 'overview' && (
              <div className="mt-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Engineered Details & Craftsmanship</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* TAB CONTENT: SPECS */}
            {activeTab === 'specs' && product.specs && (
              <div className="mt-5">
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="grid grid-cols-3 p-3 bg-white hover:bg-slate-50 transition-colors">
                      <span className="font-semibold text-slate-500">{key}</span>
                      <span className="col-span-2 text-slate-900 font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: CUSTOMER REVIEWS & RATING SYSTEM */}
            {activeTab === 'reviews' && (
              <div className="mt-6 space-y-8">
                {/* Section Header with Write a Review Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Verified Buyer Ratings & Feedback
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Real reviews from verified Dropsy customers across India.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
                  </button>
                </div>

                {/* Rating Breakdown Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-slate-50 rounded-xl border border-slate-200">
                  {/* Big Average Score */}
                  <div className="flex flex-col items-center justify-center text-center p-3 border-b md:border-b-0 md:border-r border-slate-200">
                    <div className="text-4xl sm:text-5xl font-black text-slate-950 font-display tabular-nums">
                      {product.rating.toFixed(1)}
                    </div>
                    <div className="flex items-center text-amber-400 my-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(product.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      Based on <span className="font-bold text-slate-900 tabular-nums">{product.reviewsCount}</span> global ratings
                    </div>
                  </div>

                  {/* Distribution Bars */}
                  <div className="md:col-span-2 space-y-1.5 justify-center flex flex-col">
                    {starCounts.map(({ stars, count, percentage }) => (
                      <button
                        key={stars}
                        onClick={() => setFilterRating(filterRating === stars ? 'all' : stars)}
                        className={`flex items-center gap-3 text-xs w-full py-0.5 group text-left ${
                          filterRating === stars ? 'font-bold text-slate-950' : 'text-slate-600'
                        }`}
                      >
                        <span className="w-12 text-slate-700 shrink-0 flex items-center gap-1">
                          <span>{stars}</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        </span>
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-10 text-right tabular-nums text-slate-500 text-[11px] shrink-0">
                          {percentage}%
                        </span>
                      </button>
                    ))}
                    {filterRating !== 'all' && (
                      <div className="pt-1 text-[11px] text-indigo-600 flex items-center justify-between">
                        <span>Showing only {filterRating}-star reviews</span>
                        <button
                          onClick={() => setFilterRating('all')}
                          className="hover:underline font-semibold"
                        >
                          Clear filter
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Interactive Write A Review Form */}
                {showReviewForm && (
                  <form
                    onSubmit={handleReviewSubmit}
                    className="p-5 bg-slate-50 border border-slate-300 rounded-xl space-y-4 animate-fade-in"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">Write Your Customer Review</h4>
                      <span className="text-[11px] text-slate-500">Verified Buyer Feedback</span>
                    </div>

                    {/* Interactive Star Picker */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Overall Rating *
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setFormRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="p-1 hover:scale-110 transition-transform focus:outline-none"
                            aria-label={`Rate ${star} star`}
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                (hoverRating !== null ? star <= hoverRating : star <= formRating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-slate-800 ml-2">
                          {hoverRating !== null
                            ? ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][hoverRating]
                            : ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][formRating]}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Priya Sharma"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          City / State (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Bengaluru, Karnataka"
                          value={formLocation}
                          onChange={(e) => setFormLocation(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Review Headline / Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Sum up your experience in one sentence"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Detailed Review *
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="How did the product perform? How was the delivery and packaging?"
                        value={formComment}
                        onChange={(e) => setFormComment(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish Review</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Individual Reviews List */}
                <div className="space-y-4">
                  {filteredReviews.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-xs text-slate-500">
                        No reviews matching this star filter yet. Be the first to share your thoughts!
                      </p>
                    </div>
                  ) : (
                    filteredReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors space-y-2"
                      >
                        {/* Reviewer Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{rev.userName}</span>
                            {rev.isVerifiedPurchase && (
                              <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Verified Buyer</span>
                              </span>
                            )}
                            {rev.location && (
                              <span className="text-[11px] text-slate-400">· {rev.location}</span>
                            )}
                          </div>
                          <span className="text-slate-400 text-[11px]">{rev.date}</span>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= rev.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          <h4 className="text-xs font-bold text-slate-900">{rev.title}</h4>
                        </div>

                        {/* Review Body */}
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {rev.comment}
                        </p>

                        {/* Helpful Counter */}
                        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                          <span>Verified Order on Dropsy</span>
                          <button
                            onClick={() => {
                              // Local increment visual feedback
                              rev.helpfulCount = (rev.helpfulCount || 0) + 1;
                            }}
                            className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>Helpful ({rev.helpfulCount || 0})</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
