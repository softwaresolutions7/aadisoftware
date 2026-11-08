import React from 'react';
import { 
  Sparkles, 
  MousePointerClick, 
  Briefcase, 
  ShieldCheck, 
  Zap, 
  Headphones, 
  Sliders, 
  BarChart3, 
  Wrench,
  CheckCircle2
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      title: 'Easy-to-Use Software',
      description: 'Clean, clutter-free interfaces engineered so cashiers, waiters, and accountants learn operations within 30 minutes without prior tech training.',
      icon: MousePointerClick,
      accent: 'gold',
    },
    {
      title: 'Professional Business Solutions',
      description: 'Tested architecture designed for Pakistani tax structures, multi-currency transactions, thermal receipt standards, and multi-branch operations.',
      icon: Briefcase,
      accent: 'blue',
    },
    {
      title: 'Secure User Access',
      description: 'Role-based access control with manager overrides, password-protected voids/discounts, audit logs, and encrypted local database protection.',
      icon: ShieldCheck,
      accent: 'gold',
    },
    {
      title: 'Business Automation',
      description: 'Eliminate repetitive manual paperwork with automated purchase reorders, automated daily closing Z-reports, and instant ledger postings.',
      icon: Zap,
      accent: 'blue',
    },
    {
      title: 'Reliable Software Support',
      description: 'Responsive assistance via WhatsApp, phone, and remote AnyDesk sessions directly from engineering technicians who understand your business.',
      icon: Headphones,
      accent: 'gold',
    },
    {
      title: 'Customizable Solutions',
      description: 'Modular architecture allowing tailor-made invoice templates, unique receipt layouts, proprietary approval workflows, and custom reporting formulas.',
      icon: Sliders,
      accent: 'blue',
    },
    {
      title: 'Business Reporting',
      description: 'Comprehensive financial, sales, inventory valuation, and margin analytics giving decision-makers clarity on real-time company performance.',
      icon: BarChart3,
      accent: 'gold',
    },
    {
      title: 'Installation Assistance',
      description: 'Complete hands-on setup including thermal printer configuration, barcode scanner pairing, database initialization, and network LAN routing.',
      icon: Wrench,
      accent: 'blue',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#090D16] border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built for Reliability</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance">
            Why Choose AADI Software Solutions?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            We develop business software that solves real operational bottlenecks—empowering your staff to work faster and leadership to make data-backed decisions.
          </p>
        </div>

        {/* 8 Pillar Cards Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            const isGold = item.accent === 'gold';
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-[#0F1626] border border-slate-800/90 hover:border-[#D4AF37]/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 flex flex-col justify-between group"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 ${
                      isGold
                        ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 group-hover:text-slate-300">
                  <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
                  <span>Standard Feature</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
