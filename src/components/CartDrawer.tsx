import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  onRemoveItem: (productId: string, color?: string, size?: string) => void;
  onProceedToCheckout: () => void;
  onExplore: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onExplore,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponApplied, setCouponApplied] = useState('');

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 999;
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 49;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'DROPSY10' || clean === 'FIRSTBUY') {
      setDiscountPercent(10);
      setCouponApplied(clean);
      setCouponError('');
    } else if (clean === 'DROPSY20' && subtotal >= 2000) {
      setDiscountPercent(20);
      setCouponApplied(clean);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon. Try "DROPSY10" for 10% off.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-in">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-slate-900" />
            <h2 className="text-base font-bold text-slate-950 font-display">Your Shopping Bag</h2>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold tabular-nums">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
          <div className="flex items-center justify-between text-xs mb-1.5">
            {amountNeededForFreeShipping === 0 ? (
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <span>🎉 You unlocked Free Express Shipping!</span>
              </span>
            ) : (
              <span className="text-slate-600">
                Add <strong className="text-slate-950 font-mono">₹{amountNeededForFreeShipping}</strong> more for <strong>Free Shipping</strong>
              </span>
            )}
            <span className="font-bold text-slate-900 font-mono text-[11px]">
              {freeShippingProgress}%
            </span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-900 transition-all duration-300 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Itemized Cart List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Your bag is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore our curated gadgets, fashion, and lifestyle items with Cash on Delivery.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onExplore();
                }}
                className="px-5 py-2.5 bg-slate-950 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${idx}`} className="py-4 flex gap-3.5 first:pt-0 last:pb-0">
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  referrerPolicy="no-referrer"
                  className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-lg border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id, item.selectedColor, item.selectedSize)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {(item.selectedColor || item.selectedSize) && (
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        {item.selectedColor && item.selectedSize && <span> · </span>}
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1), item.selectedColor, item.selectedSize)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-900 font-mono tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-bold text-slate-950 font-mono tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Calculations and Proceed to Checkout */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            {/* Coupon Code Strip */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Coupon code (e.g. DROPSY10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full text-xs pl-8 pr-2.5 py-2 bg-white border border-slate-300 rounded-lg uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Apply
              </button>
            </form>
            {couponApplied && (
              <div className="text-[11px] text-emerald-700 font-semibold">
                ✓ Coupon "{couponApplied}" applied! 10% discount subtracted.
              </div>
            )}
            {couponError && (
              <div className="text-[11px] text-rose-600">
                {couponError}
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-slate-900 font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-mono">-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono text-slate-900 font-medium">
                  {shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-950 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="font-mono text-base tabular-nums">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Cash on Delivery Notice */}
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>You can pay securely with <strong>Cash on Delivery</strong> at next step.</span>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
