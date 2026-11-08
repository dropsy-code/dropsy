import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Heart, Building2 } from 'lucide-react';
import { ProductCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenSupplierModal: () => void;
  onOpenOrderTracker: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenSupplierModal,
  onOpenOrderTracker,
}) => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      {/* Trust Banner */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 rounded-lg text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Cash on Delivery</div>
              <div className="text-slate-400">Pay safely when order arrives</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 rounded-lg text-indigo-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Pan-India Express</div>
              <div className="text-slate-400">2-4 business day air courier</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 rounded-lg text-amber-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">7-Day Easy Returns</div>
              <div className="text-slate-400">Hassle-free doorstep exchange</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 rounded-lg text-rose-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Dropship & Wholesale</div>
              <div className="text-slate-400">Zero MOQ & direct dispatch</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
        {/* Brand Mission */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black font-display tracking-tight text-white">
              DROPSY
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 pl-1 border-l border-slate-700">
              Shop Smart. Live Better.
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed max-w-sm">
            Discover trending products at affordable prices. Welcome to Dropsy! Explore our collection of modern gadgets, fashion, everyday accessories, and elevated lifestyle products.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenSupplierModal}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700 rounded-lg transition-colors font-semibold flex items-center gap-2"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Wholesale & Supplier Partnership Desk</span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            Collections
          </h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>
              <button onClick={() => onSelectCategory('gadgets')} className="hover:text-white transition-colors">
                Gadgets & Smart Tech
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('fashion')} className="hover:text-white transition-colors">
                Contemporary Fashion
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('accessories')} className="hover:text-white transition-colors">
                Watches & Accessories
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('lifestyle')} className="hover:text-white transition-colors">
                Home & Living Essentials
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            Customer Support
          </h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>
              <button onClick={onOpenOrderTracker} className="hover:text-white transition-colors">
                Track Your Shipment
              </button>
            </li>
            <li>
              <a href="#why-dropsy" className="hover:text-white transition-colors">
                Cash on Delivery Terms
              </a>
            </li>
            <li>
              <a href="#why-dropsy" className="hover:text-white transition-colors">
                Pincode Delivery Check
              </a>
            </li>
            <li>
              <span className="text-slate-500">support@dropsy.in</span>
            </li>
          </ul>
        </div>

        {/* B2B / Supplier Solutions */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            B2B & Dropshippers
          </h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>
              <button onClick={onOpenSupplierModal} className="hover:text-white transition-colors">
                Dropship Program (Zero MOQ)
              </button>
            </li>
            <li>
              <button onClick={onOpenSupplierModal} className="hover:text-white transition-colors">
                Blind White-Label Dispatch
              </button>
            </li>
            <li>
              <button onClick={onOpenSupplierModal} className="hover:text-white transition-colors">
                Download Wholesale Catalogue
              </button>
            </li>
            <li>
              <button onClick={onOpenSupplierModal} className="hover:text-white transition-colors">
                Profit Margin Calculator
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} DROPSY India. All rights reserved. Your Everyday Shopping Destination.
          </div>
          <div className="flex items-center gap-4">
            <span>Verified SSL 256-bit Encryption</span>
            <span>·</span>
            <span>COD Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
