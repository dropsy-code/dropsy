import React from 'react';
import { ArrowDown, ShieldCheck, Sparkles, Building2, Truck } from 'lucide-react';
import { HERO_IMAGE } from '../data/products';

interface HeroProps {
  onExploreClick: () => void;
  onOpenSupplierModal: () => void;
  onOpenCodGuide: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onOpenSupplierModal,
  onOpenCodGuide,
}) => {
  return (
    <section className="relative bg-slate-50 border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Core Narrative & Messaging */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tagline kicker */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-700">
              <span className="w-6 h-px bg-slate-900" />
              <span>DROPSY · SHOP SMART. LIVE BETTER.</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 font-display tracking-tight leading-[1.1] text-balance">
              Discover trending products at affordable prices.
            </h1>

            {/* Prompt Narrative Prose */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl text-balance">
              <strong className="text-slate-950 font-semibold">Welcome to Dropsy!</strong> Explore our curated collection of gadgets, fashion, accessories and lifestyle products. Quality everyday essentials without the retailer markup.
            </p>

            {/* Shop With Confidence / COD Highlight */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start gap-3.5 max-w-xl">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-slate-700">
                <span className="font-bold text-slate-900">Shop With Confidence: </span>
                Find something you love. Place your order and pay when your product arrives, subject to delivery availability.
                <button
                  onClick={onOpenCodGuide}
                  className="ml-1.5 text-indigo-600 font-semibold hover:underline inline-flex items-center"
                >
                  Check pin code & COD terms &rarr;
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm flex items-center gap-2"
              >
                <span>Explore Catalog</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenSupplierModal}
                className="px-5 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm rounded-xl border border-slate-300 transition-colors flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-slate-600" />
                <span>Wholesale & Dropshipping Hub</span>
              </button>
            </div>

            {/* Adjacent Proof Strip */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-3 gap-4 max-w-lg text-xs">
              <div>
                <div className="font-bold text-slate-950 text-sm font-mono">26,000+</div>
                <div className="text-slate-500 text-[11px]">Pin Codes with COD</div>
              </div>
              <div>
                <div className="font-bold text-slate-950 text-sm font-mono">2-4 Days</div>
                <div className="text-slate-500 text-[11px]">Express Air Delivery</div>
              </div>
              <div>
                <div className="font-bold text-slate-950 text-sm font-mono">7-Day</div>
                <div className="text-slate-500 text-[11px]">Easy Replacement</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl aspect-[16/10] lg:aspect-[4/3] group">
              <img
                src={HERO_IMAGE}
                alt="Dropsy Curated Essentials Collection"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 sm:p-6 text-white">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated Essentials 2026</span>
                </div>
                <p className="text-sm font-semibold mt-1 text-slate-100">
                  Minimalist Gadgets, Contemporary Apparel & Living Essentials.
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-300">
                  <span>Pay on Delivery</span>
                  <span>·</span>
                  <span>Free Shipping over ₹999</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
