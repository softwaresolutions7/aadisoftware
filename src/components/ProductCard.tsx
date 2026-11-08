import React from 'react';
import { SoftwareProduct, CompanySettings } from '../types';
import { getSoftwareIcon } from './IconHelper';
import { Check, MessageSquare, ArrowRight, Tag, ExternalLink } from 'lucide-react';

interface ProductCardProps {
  product: SoftwareProduct;
  settings: CompanySettings;
  onViewDetails: (product: SoftwareProduct) => void;
  onGetPrice: (product: SoftwareProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  settings,
  onViewDetails,
  onGetPrice,
}) => {
  const Icon = getSoftwareIcon(product.iconName);

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    product.whatsappPrefill || `Assalam o Alaikum, I am interested in ${product.name}. Please share details and pricing.`
  )}`;

  // Determine custom explore button label per prompt specification
  const getExploreLabel = () => {
    if (product.slug.includes('restaurant')) return 'Explore Restaurant POS';
    if (product.slug.includes('retail')) return 'Explore Retail POS';
    if (product.slug.includes('erp')) return 'Explore ERP';
    if (product.slug.includes('inventory')) return 'Explore Inventory';
    if (product.slug.includes('accounting')) return 'Explore Accounting';
    if (product.slug.includes('pharmacy')) return 'Explore Pharmacy Software';
    if (product.slug.includes('custom')) return 'Request Custom Software';
    return `Explore ${product.name}`;
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#0F1626] border border-slate-800 hover:border-[#D4AF37]/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/60 group overflow-hidden">
      {/* Product Image preview banner */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 border-b border-slate-800/80">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1626] via-[#0F1626]/40 to-transparent" />
        
        {/* Unboxed clean metadata kicker */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold text-[#D4AF37] px-2.5 py-1 rounded bg-[#0B0F19]/80 backdrop-blur-md border border-[#D4AF37]/30">
          <span>{product.category}</span>
        </div>

        {/* Floating icon badge */}
        <div className="absolute -bottom-3 right-4 w-11 h-11 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-lg shadow-black/50 group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div>
          {/* Product Name */}
          <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Key Features List */}
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]/90 mb-2.5">
              Core Capabilities
            </p>
            <ul className="space-y-1.5">
              {product.features.slice(0, 4).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span className="leading-tight">{feature}</span>
                </li>
              ))}
              {product.features.length > 4 && (
                <li className="text-[11px] text-slate-400 font-medium pt-1">
                  + {product.features.length - 4} more operational features
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Buttons Section: View Details, Get Price, WhatsApp Inquiry, and Primary Explore */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          {/* Primary Explore Button */}
          <button
            onClick={() => onViewDetails(product)}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-[#0B0F19] bg-gradient-to-r from-[#F6EFD3] via-[#D4AF37] to-[#C5A059] hover:from-white hover:to-[#E0C572] transition-all shadow-sm active:scale-98 cursor-pointer"
          >
            <span>{getExploreLabel()}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Secondary Dual Action Buttons: View Details & Get Price */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewDetails(product)}
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>View Details</span>
            </button>

            <button
              onClick={() => onGetPrice(product)}
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-[#D4AF37] hover:text-white bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 transition-colors cursor-pointer"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Get Price</span>
            </button>
          </div>

          {/* Tertiary WhatsApp Inquiry Button with prefill */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-500/30 transition-all text-center"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp Inquiry</span>
          </a>
        </div>
      </div>
    </div>
  );
};
