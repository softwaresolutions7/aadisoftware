import React, { useState } from 'react';
import { SoftwareProduct, CompanySettings } from '../types';
import { getSoftwareIcon } from './IconHelper';
import { 
  X, 
  Check, 
  ChevronDown, 
  MessageSquare, 
  Phone, 
  Tag, 
  Cpu, 
  HardDrive, 
  Monitor, 
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

interface ProductDetailModalProps {
  product: SoftwareProduct | null;
  settings: CompanySettings;
  onClose: () => void;
  onOpenQuote: (productName: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  settings,
  onClose,
  onOpenQuote,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!product) return null;

  const Icon = getSoftwareIcon(product.iconName);

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    product.whatsappPrefill || `Assalam o Alaikum, I am interested in ${product.name}. Please share details and pricing.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#0F1626] border border-slate-700/80 rounded-2xl shadow-2xl shadow-black overflow-hidden max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Top Bar of Modal */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#0F1626]/95 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white leading-tight">{product.name}</h2>
                <span className="text-[11px] font-semibold text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  {product.category}
                </span>
              </div>
              <p className="text-xs text-slate-400">AADI Software Solutions Suite</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Visual Showcase Screenshot */}
          <div className="rounded-xl overflow-hidden border border-slate-800 relative bg-slate-900 aspect-[16/9] shadow-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-[#0B0F19]/90 border border-slate-700 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-200 font-medium">Genuine Live Deployment Preview</span>
              <span className="text-[#D4AF37] font-semibold">Touchscreen & Barcode Ready</span>
            </div>
          </div>

          {/* Product Overview */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#D4AF37]" />
              <span>Product Overview</span>
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed sm:text-base">
              {product.fullDescription}
            </p>
          </div>

          {/* Main Features & Business Benefits in 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Features */}
            <div className="p-5 rounded-xl bg-[#0B0F19]/80 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#D4AF37]" />
                <span>Main Features</span>
              </h4>
              <ul className="space-y-2.5">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="p-5 rounded-xl bg-[#0B0F19]/80 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Key Business Benefits</span>
              </h4>
              <ul className="space-y-2.5">
                {product.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* System Requirements */}
          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Monitor className="w-4 h-4 text-[#D4AF37]" />
              <span>Recommended System Specifications</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0B0F19] border border-slate-800">
                <p className="text-slate-400">Operating System</p>
                <p className="font-semibold text-slate-200 mt-1">{product.systemRequirements.os}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0B0F19] border border-slate-800">
                <p className="text-slate-400">Processor</p>
                <p className="font-semibold text-slate-200 mt-1">{product.systemRequirements.processor}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0B0F19] border border-slate-800">
                <p className="text-slate-400">Memory (RAM)</p>
                <p className="font-semibold text-slate-200 mt-1">{product.systemRequirements.ram}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0B0F19] border border-slate-800">
                <p className="text-slate-400">Disk Storage</p>
                <p className="font-semibold text-slate-200 mt-1">{product.systemRequirements.storage}</p>
              </div>
            </div>

            {product.systemRequirements.extras && (
              <p className="text-xs text-slate-400 italic">
                Hardware support: {product.systemRequirements.extras}
              </p>
            )}
          </div>

          {/* Frequently Asked Questions */}
          {product.faqs && product.faqs.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-white">
                Frequently Asked Questions
              </h4>
              <div className="space-y-2">
                {product.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div 
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-[#0B0F19]/60 overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-slate-200 hover:text-white transition-colors"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-[#D4AF37] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pricing Inquiry Box */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-[#161F33] to-[#0F1626] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                Transparent Software Licensing
              </p>
              <h5 className="text-base font-bold text-white mt-0.5">
                Contact Us for Pricing & Implementation
              </h5>
              <p className="text-xs text-slate-300 mt-1">
                {product.pricingNote}
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenQuote(product.name);
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#0B0F19] bg-gradient-to-r from-[#F6EFD3] to-[#D4AF37] hover:from-white hover:to-[#E0C572] whitespace-nowrap cursor-pointer shadow-md"
            >
              Request Custom Quote
            </button>
          </div>

        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 sm:p-5 bg-[#0B0F19] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Installation & remote staff training included with every deployment.
          </div>

          <div className="flex items-center gap-2.5">
            {/* Contact Sales Phone */}
            <a
              href={settings.phoneDialer}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Contact Sales</span>
            </a>

            {/* WhatsApp Inquiry */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/40 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Inquiry</span>
            </a>

            {/* Request Quote Button */}
            <button
              onClick={() => {
                onClose();
                onOpenQuote(product.name);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-[#0B0F19] bg-[#D4AF37] hover:bg-[#E0C572] transition-colors cursor-pointer"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Get Price</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
