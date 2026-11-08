import React, { useState } from 'react';
import { X, Search, Package, CheckCircle2, Clock, Truck, ShieldCheck, MapPin } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrders: Order[];
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  recentOrders,
}) => {
  const [searchOrderId, setSearchOrderId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    recentOrders.length > 0 ? recentOrders[0] : null
  );
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const cleanId = searchOrderId.trim().toUpperCase();
    const found = recentOrders.find((o) => o.id.toUpperCase() === cleanId);
    if (found) {
      setSelectedOrder(found);
    } else {
      // Mock tracking state for any entered valid ID
      if (cleanId.startsWith('DRP-') || cleanId.length >= 6) {
        setSelectedOrder({
          id: cleanId.startsWith('DRP-') ? cleanId : `DRP-${cleanId}`,
          customerName: 'Valued Customer',
          phone: '+91 98*** *****',
          address: 'Delivery Address on File',
          city: 'Regional Hub',
          state: 'India',
          postalCode: '560001',
          items: [],
          subtotal: 1499,
          shippingFee: 0,
          discount: 0,
          total: 1499,
          paymentMethod: 'cod',
          status: 'dispatched',
          createdAt: 'Yesterday',
          estimatedDelivery: 'Arriving in 1-2 days via BlueDart Air',
          deliveryOtp: '7419',
        });
      } else {
        setSelectedOrder(null);
      }
    }
  };

  const steps = [
    { title: 'Order Confirmed', desc: 'Verified address & COD approval', done: true },
    { title: 'Packed at Hub', desc: 'Tamper-proof Dropsy packaging', done: true },
    { title: 'Dispatched via Air', desc: 'Handed to BlueDart / Delhivery', done: selectedOrder?.status !== 'confirmed' },
    { title: 'Out for Delivery', desc: 'Courier agent en route', done: selectedOrder?.status === 'out_for_delivery' || selectedOrder?.status === 'delivered' },
    { title: 'Delivered', desc: 'Doorstep inspection & COD paid', done: selectedOrder?.status === 'delivered' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-4">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold font-display">Track Your Dropsy Shipment</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-5 overflow-y-auto space-y-5">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. DRP-849201)"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg uppercase placeholder:normal-case font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Track
            </button>
          </form>

          {/* Quick Select from Recent Orders if any */}
          {recentOrders.length > 0 && !selectedOrder && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500">Recent Session Orders:</div>
              <div className="flex flex-wrap gap-2">
                {recentOrders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className="px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono rounded-md border border-slate-200"
                  >
                    {ord.id} (₹{ord.total})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tracking Details Display */}
          {selectedOrder ? (
            <div className="space-y-5">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-slate-500">
                    Order ID: <span className="font-mono text-slate-950 font-bold">{selectedOrder.id}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {selectedOrder.status === 'confirmed' ? 'In Processing' : 'Dispatched / In Transit'}
                  </span>
                </div>
                <div className="text-xs text-slate-700">
                  Estimated Delivery: <strong>{selectedOrder.estimatedDelivery}</strong>
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Destination: {selectedOrder.city}, {selectedOrder.state} ({selectedOrder.postalCode})</span>
                </div>
                {selectedOrder.deliveryOtp && (
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Doorstep Verification OTP:</span>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300 tracking-wider">
                      {selectedOrder.deliveryOtp}
                    </span>
                  </div>
                )}
              </div>

              {/* Step Tracker Visual */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {steps.map((st, i) => (
                  <div key={i} className="relative flex items-start gap-3">
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        st.done
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500 border border-slate-300'
                      }`}
                    >
                      {st.done ? '✓' : i + 1}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${st.done ? 'text-slate-900' : 'text-slate-400'}`}>
                        {st.title}
                      </div>
                      <div className="text-[11px] text-slate-500">{st.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-950 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Payment Mode: <strong>{selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (Pay upon arrival)' : 'Prepaid'}</strong>
                </span>
              </div>
            </div>
          ) : searched ? (
            <div className="py-8 text-center text-xs text-slate-500 space-y-2">
              <p>No active order found with that ID. Please check your confirmation SMS or enter a valid Dropsy ID.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
