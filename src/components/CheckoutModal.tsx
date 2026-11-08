import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Truck, CreditCard, Banknote, ArrowRight, Printer, Copy, Check } from 'lucide-react';
import { CartItem, Order } from '../types';
import { SAMPLE_PINCODES } from '../data/products';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: Order) => void;
  initialItem?: CartItem | null; // For direct COD buy
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
  initialItem,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'prepaid'>('cod');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copiedOtp, setCopiedOtp] = useState(false);

  if (!isOpen) return null;

  // Active items for this checkout session
  const activeItems = initialItem ? [initialItem] : items;
  const subtotal = activeItems.reduce((acc, it) => acc + it.product.price * it.quantity, 0);
  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 49;
  const grandTotal = subtotal + shippingFee;

  const handlePincodeChange = (pin: string) => {
    const cleaned = pin.replace(/\D/g, '').slice(0, 6);
    setPincode(cleaned);
    if (cleaned.length === 6) {
      if (SAMPLE_PINCODES[cleaned]) {
        setCity(SAMPLE_PINCODES[cleaned].city);
        setState(SAMPLE_PINCODES[cleaned].state);
      } else {
        setCity('Verified City Hub');
        setState('India');
      }
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !pincode || !address) return;
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    const orderId = `DRP-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomOtp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      customerName: name,
      phone,
      address,
      city: city || 'Local Zone',
      state: state || 'India',
      postalCode: pincode,
      items: activeItems,
      subtotal,
      shippingFee,
      discount: 0,
      total: grandTotal,
      paymentMethod,
      status: 'confirmed',
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      estimatedDelivery: 'In 2–4 business days via BlueDart / Delhivery',
      deliveryOtp: randomOtp,
    };

    setConfirmedOrder(newOrder);
    onOrderSuccess(newOrder);
    setStep('confirmation');
  };

  const handleCopyOtp = () => {
    if (confirmedOrder?.deliveryOtp) {
      navigator.clipboard.writeText(confirmedOrder.deliveryOtp);
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-4">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div>
            <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              {step === 'confirmation' ? 'Order Successful' : 'Secure Dropsy Checkout'}
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-display mt-0.5">
              {step === 'details' && '1. Delivery Details'}
              {step === 'payment' && '2. Payment & COD Selection'}
              {step === 'confirmation' && 'Order Confirmed!'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {/* STEP 1: DELIVERY DETAILS */}
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number (for COD verification) *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-xs text-slate-500 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  6-Digit Pin Code *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 560001 (auto-detects city)"
                  value={pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / District
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-detected or enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-detected or enter state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Complete Delivery Address (House/Flat, Street, Landmark) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Apartment 4B, Silver Oak Heights, Near City Park..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Order Items Preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-900 mb-2">Order Items ({activeItems.length})</div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {activeItems.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="truncate max-w-[260px]">{it.quantity}x {it.product.title}</span>
                      <span className="font-mono text-slate-900">₹{(it.product.price * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                    <span>Total Amount Payable</span>
                    <span className="font-mono text-sm">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Continue to Payment & COD</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: PAYMENT & COD SELECTION */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div className="text-xs text-slate-600">
                Choose how you would like to pay for your Dropsy order of <strong className="text-slate-950 font-mono">₹{grandTotal.toLocaleString()}</strong>:
              </div>

              {/* Option 1: Cash on Delivery (COD) - Highlighted */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700 mt-0.5">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Pay with cash or scan UPI QR code directly with the courier executive when your parcel arrives at your doorstep. Zero advance payment required.
                      </p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    paymentMethod === 'cod' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'cod' && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>

              {/* Option 2: UPI / Cards / Netbanking */}
              <div
                onClick={() => setPaymentMethod('prepaid')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'prepaid'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700 mt-0.5">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900">
                        Prepaid (UPI / Cards / Net Banking)
                      </span>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Instant zero-contact payment via Google Pay, PhonePe, Paytm, or Credit/Debit cards.
                      </p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    paymentMethod === 'prepaid' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'prepaid' && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>

              {/* Summary Strip */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Shipping Address:</span>
                  <span className="font-semibold text-slate-900 text-right">{city}, {state} ({pincode})</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-emerald-700">
                    {paymentMethod === 'cod' ? 'Cash on Delivery (Pay on Arrival)' : 'Prepaid Online'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    Confirm Order ({paymentMethod === 'cod' ? 'Pay ₹' + grandTotal.toLocaleString() + ' on Arrival' : 'Pay ₹' + grandTotal.toLocaleString()})
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER CONFIRMATION */}
          {step === 'confirmation' && confirmedOrder && (
            <div className="space-y-5 text-center sm:text-left">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Your Dropsy Order is Confirmed!
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Order ID: <strong className="font-mono text-slate-950 font-bold">{confirmedOrder.id}</strong>. We've sent dispatch details to {confirmedOrder.phone}.
                  </p>
                </div>
              </div>

              {/* Secret Delivery OTP Card */}
              {confirmedOrder.deliveryOtp && (
                <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Doorstep Verification OTP
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      Show this 4-digit code to the delivery agent upon receiving your parcel:
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-mono font-black tracking-widest text-emerald-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                      {confirmedOrder.deliveryOtp}
                    </span>
                    <button
                      onClick={handleCopyOtp}
                      className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
                      title="Copy OTP"
                    >
                      {copiedOtp ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Delivery Timeline Details */}
              <div className="p-4 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span>Estimated Delivery: {confirmedOrder.estimatedDelivery}</span>
                </div>
                <div>
                  Deliver to: <strong>{confirmedOrder.customerName}</strong>, {confirmedOrder.address}, {confirmedOrder.city}, {confirmedOrder.state} - {confirmedOrder.postalCode}
                </div>
                <div>
                  Payment: <strong>{confirmedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (Pay ₹' + confirmedOrder.total.toLocaleString() + ' upon delivery)' : 'Prepaid Verified'}</strong>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
