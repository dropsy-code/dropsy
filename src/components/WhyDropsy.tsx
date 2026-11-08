import React, { useState } from 'react';
import { Tag, TrendingUp, ShoppingBag, ShieldCheck, CheckCircle2, Search, AlertCircle, ArrowRight } from 'lucide-react';
import { SAMPLE_PINCODES } from '../data/products';

export const WhyDropsy: React.FC = () => {
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeResult, setPincodeResult] = useState<{
    tested: boolean;
    valid: boolean;
    city?: string;
    state?: string;
    cod?: boolean;
    days?: string;
  }>({ tested: false, valid: false });

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincodeInput.trim();
    if (!cleanPin || cleanPin.length !== 6) {
      setPincodeResult({ tested: true, valid: false });
      return;
    }

    if (SAMPLE_PINCODES[cleanPin]) {
      const match = SAMPLE_PINCODES[cleanPin];
      setPincodeResult({
        tested: true,
        valid: true,
        city: match.city,
        state: match.state,
        cod: match.cod,
        days: match.days,
      });
    } else {
      // General valid 6-digit Indian pincode simulation
      setPincodeResult({
        tested: true,
        valid: true,
        city: 'Verified Delivery Hub',
        state: 'Standard Regional Zone',
        cod: true,
        days: '2-4 Days (Standard Surface / Air Express)',
      });
    }
  };

  const pillars = [
    {
      icon: <Tag className="w-5 h-5 text-indigo-600" />,
      title: 'Affordable Prices',
      description:
        'We work directly with leading manufacturers and craft mills to bring you premium design and durability at honest, transparent prices.',
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
      title: 'Trending Products',
      description:
        'Our product team refreshes the collection weekly with the latest functional tech gadgets, contemporary fashion, and modern home essentials.',
    },
    {
      icon: <ShoppingBag className="w-5 h-5 text-blue-600" />,
      title: 'Convenient Shopping',
      description:
        'Clean, clutter-free store experience. Instant product search, easy variant selection, and live shipment tracking straight to your phone.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      title: 'Cash on Delivery Available',
      description:
        'Shop with complete peace of mind. Pay when your parcel arrives safely at your doorstep, subject to pin code delivery availability.',
    },
  ];

  return (
    <section id="why-dropsy" className="py-12 sm:py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            The Dropsy Difference
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
            Why Choose Dropsy?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            DROPSY – Your Everyday Shopping Destination. Shop smart. Live better.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 inline-block shadow-xs mb-3.5">
                  {pillar.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Cash on Delivery & Pincode Checker Strip */}
        <div className="p-6 sm:p-8 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Pan-India Cash on Delivery Network</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display">
                Check Instant COD & Delivery to Your Pin Code
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We partner with Delhivery, BlueDart, Shadowfax, and Xpressbees to deliver with Cash on Delivery across 26,000+ Indian postal codes. Test your 6-digit pin code below:
              </p>

              {/* Sample Quick Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span>Try quick:</span>
                {['560001 (Bengaluru)', '110001 (Delhi)', '400001 (Mumbai)', '500001 (Hyderabad)'].map((cityStr) => {
                  const pin = cityStr.split(' ')[0];
                  return (
                    <button
                      key={pin}
                      type="button"
                      onClick={() => setPincodeInput(pin)}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 font-mono text-[11px] transition-colors"
                    >
                      {pin}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Checker Form */}
            <div className="lg:col-span-5 bg-slate-800/80 p-5 rounded-xl border border-slate-700 space-y-3">
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pin Code (e.g. 560001)"
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-xs p-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shrink-0"
                >
                  Verify
                </button>
              </form>

              {/* Result output */}
              {pincodeResult.tested && (
                <div className="pt-2">
                  {pincodeResult.valid ? (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-lg text-xs space-y-1 animate-fade-in">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>✓ Cash on Delivery is Available!</span>
                      </div>
                      <div className="text-slate-300 text-[11px]">
                        <strong>{pincodeResult.city}</strong>, {pincodeResult.state}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Estimated transit: {pincodeResult.days}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-lg text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Please enter a valid 6-digit Indian postal code.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
