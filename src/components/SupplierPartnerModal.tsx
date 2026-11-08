import React, { useState } from 'react';
import { X, CheckCircle2, Download, Building2, TrendingUp, ShieldCheck, Truck, HelpCircle, Send } from 'lucide-react';
import { DROPSHIP_SUPPLIER_FAQ, PRODUCTS } from '../data/products';

interface SupplierPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (productId: string) => void;
}

export const SupplierPartnerModal: React.FC<SupplierPartnerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'calculator' | 'apply'>('faq');
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [unitsPerMonth, setUnitsPerMonth] = useState(100);
  const [customResalePrice, setCustomResalePrice] = useState(PRODUCTS[0].price);

  // Form state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
    monthlyVolume: '50-200 units',
    businessType: 'Shopify / E-Commerce Store',
    notes: '',
  });

  if (!isOpen) return null;

  const currentProduct = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];
  const unitWholesale = currentProduct.wholesalePrice;
  const unitProfit = Math.max(0, customResalePrice - unitWholesale);
  const monthlyProfit = unitProfit * unitsPerMonth;
  const marginPercentage = customResalePrice > 0 ? Math.round((unitProfit / customResalePrice) * 100) : 0;

  const handleProductChange = (id: string) => {
    setSelectedProductId(id);
    const prod = PRODUCTS.find((p) => p.id === id);
    if (prod) {
      setCustomResalePrice(prod.price);
    }
  };

  const handleDownloadCsv = () => {
    const headers = 'SKU,Product Name,Category,Wholesale Cost (INR),Suggested Retail MRP (INR),Profit Margin (INR),Margin %\n';
    const rows = PRODUCTS.map((p) => {
      const margin = p.price - p.wholesalePrice;
      const marginPct = Math.round((margin / p.price) * 100);
      return `"${p.id}","${p.title}","${p.category}",${p.wholesalePrice},${p.price},${margin},${marginPct}%`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'DROPSY_Wholesale_Catalogue_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Building2 className="w-4 h-4" />
              <span>Dropsy B2B & Wholesale Partner Hub</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display mt-1">
              Wholesale & Dropshipping Operations
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Pan-India direct-to-customer fulfillment, COD logistics, and transparent margin economics.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Segmented Tab Controls */}
        <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200 rounded-lg">
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'faq'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              The 7 Core Answers
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'calculator'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Wholesale Profit Calculator
            </button>
            <button
              onClick={() => setActiveTab('apply')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'apply'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Partner Application
            </button>
          </div>

          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Download CSV Catalogue</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: THE 7 CORE ANSWERS */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-emerald-950">
                  <span className="font-bold">Official Dropsy India Wholesale Policy:</span> All 7 supplier inquiries submitted for DROPSY are formally confirmed and verified below. We specialize in zero-MOQ direct dropshipping with Pan-India COD and automated order sync.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DROPSHIP_SUPPLIER_FAQ.map((item) => (
                  <div
                    key={item.number}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-400 font-mono">
                        QUESTION {item.number}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                      {item.question}
                    </h3>
                    <div className="text-xs font-semibold text-emerald-700 mb-2">
                      {item.shortAnswer}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.fullAnswer}
                    </p>
                  </div>
                ))}
              </div>

              {/* Partnership Highlights Strip */}
              <div className="p-5 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div>
                  <h4 className="font-bold text-sm">Ready to integrate DROPSY into your business?</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Direct white-label fulfillment begins within 24 hours of onboarding.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('apply')}
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Apply for Supplier Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WHOLESALE MARGIN CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              <div className="text-xs text-slate-600">
                Model your unit economics, gross profit margins, and monthly projections using Dropsy's wholesale cost base.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Inputs Column */}
                <div className="md:col-span-1 space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Select Catalogue SKU
                    </label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => handleProductChange(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      {PRODUCTS.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.title} (Wholesale: ₹{prod.wholesalePrice})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Customer Selling Price (INR ₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs text-slate-400">₹</span>
                      <input
                        type="number"
                        value={customResalePrice}
                        onChange={(e) => setCustomResalePrice(Number(e.target.value))}
                        className="w-full text-xs bg-white border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Recommended Dropsy Retail: ₹{currentProduct.price}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Monthly Projected Orders</span>
                      <span className="text-slate-900 font-bold tabular-nums">{unitsPerMonth} units</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="1000"
                      step="10"
                      value={unitsPerMonth}
                      onChange={(e) => setUnitsPerMonth(Number(e.target.value))}
                      className="w-full accent-slate-900 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>10/mo</span>
                      <span>500/mo</span>
                      <span>1000+/mo</span>
                    </div>
                  </div>
                </div>

                {/* Calculation Cards */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-4 bg-slate-100 rounded-xl border border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Wholesale Cost
                      </div>
                      <div className="text-xl font-bold text-slate-900 font-mono mt-1">
                        ₹{unitWholesale.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Your procurement cost</div>
                    </div>

                    <div className="p-4 bg-slate-100 rounded-xl border border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Gross Margin
                      </div>
                      <div className="text-xl font-bold text-emerald-600 font-mono mt-1">
                        {marginPercentage}%
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">₹{unitProfit} / order</div>
                    </div>

                    <div className="p-4 bg-slate-900 text-white rounded-xl col-span-2 sm:col-span-1">
                      <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                        Projected Profit
                      </div>
                      <div className="text-xl font-bold font-mono mt-1">
                        ₹{monthlyProfit.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">@ {unitsPerMonth} orders/mo</div>
                    </div>
                  </div>

                  {/* Selected SKU breakdown card */}
                  <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl bg-white">
                    <img
                      src={currentProduct.image}
                      alt={currentProduct.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded-lg shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs uppercase text-slate-400 font-semibold">
                        {currentProduct.category} · Minimum Order Quantity: 1 Piece
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {currentProduct.title}
                      </h4>
                      <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-3">
                        <span>Wholesale: <strong className="text-slate-900">₹{unitWholesale}</strong></span>
                        <span>·</span>
                        <span>Dropsy Resale: <strong className="text-slate-900">₹{customResalePrice}</strong></span>
                        <span>·</span>
                        <span>Dispatch: <strong>24 Hours</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                    <strong>Notice on COD Remittance:</strong> For COD orders, the courier collects ₹{customResalePrice} at the customer's doorstep. Dropsy deducts the wholesale price (₹{unitWholesale}) + flat delivery charge (₹49), and deposits your net margin directly to your registered bank account every Tuesday & Friday.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PARTNER APPLICATION FORM */}
          {activeTab === 'apply' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {formSubmitted ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Partnership Request Submitted!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    Thank you for reaching out to build a long-term business relationship with DROPSY. Our wholesale onboarding desk has received your request and will contact you via WhatsApp / email within 2-4 business hours with account credentials and API setup.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="text-xs text-slate-600 pb-2 border-b border-slate-200">
                    Connect with our business partnerships team to unlock wholesale pricing tiers, automated API order routing, and custom packaging.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Brand / Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. DROPSY"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Business Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="partner@dropsy.in"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        WhatsApp / Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        City & State in India
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bengaluru, Karnataka"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Estimated Monthly Order Volume
                      </label>
                      <select
                        value={formData.monthlyVolume}
                        onChange={(e) => setFormData({ ...formData, monthlyVolume: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
                      >
                        <option value="1-50 units">1 - 50 units (Testing phase)</option>
                        <option value="50-200 units">50 - 200 units (Growing store)</option>
                        <option value="200-500 units">200 - 500 units (Established)</option>
                        <option value="500+ units">500+ units (Enterprise / Bulk wholesale)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Business Requirements or Specific SKUs of Interest
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mention any custom packaging requirements, preferred courier integration, or target categories..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Wholesale & Dropshipping Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Dropsy B2B Supply Network · Pan-India Dispatch</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
