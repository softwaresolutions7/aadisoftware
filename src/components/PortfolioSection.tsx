import React from 'react';
import { Layers, Monitor, ExternalLink, CheckCircle } from 'lucide-react';
import { CompanySettings } from '../types';

interface PortfolioSectionProps {
  settings: CompanySettings;
  onSelectProduct: (slug: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ settings, onSelectProduct }) => {
  const showcaseProjects = [
    {
      title: 'Dine-In Restaurant Management & Multi-KOT System',
      sector: 'Fine Dining & Casual Cafes',
      image: '/src/assets/images/pos_restaurant_mockup_1793979101826.jpg',
      slug: 'restaurant-pos-software',
      description: 'Integrated touch terminal billing with multi-printer kitchen order routing, table-side waiter ordering, and daily recipe-level inventory control.',
      deliverables: ['Table Floor Plan', 'Dual Kitchen Printers', 'Waitstaff Handhelds', 'Cashier Z-Reports']
    },
    {
      title: 'High-Speed Supermarket Barcode Checkout System',
      sector: 'Grocery & Departmental Stores',
      image: '/src/assets/images/retail_pos_mockup_1793979088491.jpg',
      slug: 'retail-pos-software',
      description: 'Multi-counter barcode scanning checkout lanes capable of processing 200+ transactions per hour with integrated electronic cash drawer reconciliation.',
      deliverables: ['Omnidirectional Barcode Scanner', 'Thermal Invoice Roll', 'Customer Loyalty Ledger', 'Daily Shift Balances']
    },
    {
      title: 'Centralized Multi-Warehouse Distribution & ERP',
      sector: 'Wholesale & Manufacturing',
      image: '/src/assets/images/erp_business_dashboard_1793979088994.jpg',
      slug: 'erp-software',
      description: 'Unified commercial ERP linking sales order pipelines, purchase receiving verification, stock transit tracking, and double-entry accounting ledger.',
      deliverables: ['Centralized Database', 'Purchase Order Approval', 'Batch Tracking', 'Executive Financial Reports']
    },
    {
      title: 'Prescription Pharmacy & Drug Batch Expiry System',
      sector: 'Medical Stores & Clinics',
      image: '/src/assets/images/pharmacy_inventory_mockup_1793979088899.jpg',
      slug: 'pharmacy-management-software',
      description: 'Specialized healthcare dispensing software with near-expiry alerts, generic drug formula lookup, and distributor payment scheduling.',
      deliverables: ['Expiry Warning Radar', 'Generic Formula Index', 'Distributor Bonus Accounting', 'Controlled Drug Logs']
    }
  ];

  return (
    <section id="portfolio" className="py-20 lg:py-28 bg-[#090D16] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#D4AF37]">
            <Monitor className="w-3.5 h-3.5" />
            <span>Deployed Systems & Solutions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance">
            System Deployments & Portfolio
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Real-world software configurations implemented across dining establishments, retail stores, wholesale distribution hubs, and medical pharmacies.
          </p>
        </div>

        {/* Portfolio Showcase Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
          {showcaseProjects.map((project, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#0F1626] border border-slate-800 overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Visual Preview */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 border-b border-slate-800">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1626] via-transparent to-transparent opacity-70" />
                  <div className="absolute top-3 left-3 text-[11px] font-semibold text-[#D4AF37] px-2.5 py-1 rounded bg-[#0B0F19]/80 backdrop-blur-md border border-[#D4AF37]/30">
                    {project.sector}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="pt-2">
                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                      Included Architecture:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.deliverables.map((item, dIdx) => (
                        <span
                          key={dIdx}
                          className="inline-flex items-center gap-1 text-[11px] text-slate-300 px-2 py-1 rounded bg-slate-900 border border-slate-800"
                        >
                          <CheckCircle className="w-3 h-3 text-[#D4AF37]" />
                          <span>{item}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectProduct(project.slug)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-colors cursor-pointer"
                >
                  <span>Explore Associated Software</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
