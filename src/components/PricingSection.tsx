import React from 'react';
import { PricingPackage, CompanySettings } from '../types';
import { Check, MessageSquare, Tag, ArrowRight } from 'lucide-react';

interface PricingSectionProps {
  packages: PricingPackage[];
  settings: CompanySettings;
  onRequestQuote: (packageName: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  packages,
  settings,
  onRequestQuote,
}) => {
  return (
    <section id="pricing" className="py-20 lg:py-28 bg-[#0B0F19] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#D4AF37]">
            <Tag className="w-3.5 h-3.5" />
            <span>Investment Plans</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance">
            Transparent Implementation Packages
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Tailored software configurations aligned with your business scale. No surprise recurring locks—receive complete setup and staff training assistance.
          </p>
        </div>

        {/* 3 Packages Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => {
            const isPopular = pkg.popular;
            const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              `Assalam o Alaikum, I would like to inquire about the ${pkg.name} pricing and software features.`
            )}`;

            return (
              <div
                key={pkg.id}
                className={`flex flex-col justify-between rounded-2xl p-7 transition-all duration-300 relative ${
                  isPopular
                    ? 'bg-gradient-to-b from-[#141D30] to-[#0F1626] border-2 border-[#D4AF37] shadow-2xl shadow-black/80 lg:-translate-y-2'
                    : 'bg-[#0F1626] border border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Popular Flag */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B58E26] text-[#0B0F19] text-xs font-bold uppercase tracking-wider shadow-md">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  {/* Package Name */}
                  <h3 className="text-2xl font-bold text-white">{pkg.name}</h3>
                  
                  {/* Target business */}
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 min-h-[40px] leading-relaxed">
                    {pkg.targetBusiness}
                  </p>

                  {/* Price Banner */}
                  <div className="mt-6 py-4 px-5 rounded-xl bg-[#0B0F19] border border-slate-800 text-center">
                    <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
                      Pricing Structure
                    </span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#D4AF37]">
                      {pkg.priceNote || 'Contact Us for Pricing'}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      Customized per counter & station requirements
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="mt-6 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Included Capabilities:
                    </p>
                    <ul className="space-y-2.5">
                      {pkg.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                          <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Package Buttons */}
                <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-2.5">
                  <button
                    onClick={() => onRequestQuote(pkg.name)}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer ${
                      isPopular
                        ? 'text-[#0B0F19] bg-gradient-to-r from-[#F6EFD3] via-[#D4AF37] to-[#C5A059] hover:from-white hover:to-[#E0C572]'
                        : 'text-white bg-slate-800 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    <span>{pkg.buttonText || 'Request Price Quote'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-500/30 transition-all text-center"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp Inquiry for {pkg.name}</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
