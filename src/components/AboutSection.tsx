import React from 'react';
import { Target, Compass, Award, Check, Layers, Cpu } from 'lucide-react';
import { CompanySettings } from '../types';

interface AboutSectionProps {
  settings: CompanySettings;
  onExploreSoftware: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings, onExploreSoftware }) => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-[#0B0F19] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#D4AF37]">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <span>About AADI Software Solutions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance">
            Technology That Helps Your Business Grow
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            AADI Software Solutions provides modern software solutions designed to help businesses manage their operations efficiently. Our goal is to simplify business processes through reliable, easy-to-use, and professional software.
          </p>
        </div>

        {/* Mission and Vision Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <div className="p-8 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Target className="w-6 h-6" />
            </div>
            
            <h3 className="text-xl font-bold text-white">Our Mission</h3>
            
            <p className="text-slate-300 text-sm leading-relaxed">
              To deliver practical, high-performance software systems that eliminate everyday operational friction. We focus on empowering retailers, restaurateurs, accountants, and commercial enterprises with software that is dependable, straightforward to operate, and responsive to day-to-day business realities.
            </p>

            <ul className="space-y-2 pt-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Zero unnecessary complexity—focused on daily utility</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Fast local hardware compatibility (printers, scanners, scales)</span>
              </li>
            </ul>
          </div>

          {/* Vision Card */}
          <div className="p-8 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Compass className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white">Our Vision</h3>

            <p className="text-slate-300 text-sm leading-relaxed">
              To become a trusted technology partner for growing enterprises, recognized for reliable software engineering, honest customer support, and tailored business automation solutions that evolve seamlessly alongside our clients’ business growth.
            </p>

            <ul className="space-y-2 pt-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-400" />
                <span>Continuous software refinements aligned with market needs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-400" />
                <span>Long-term technical relationship and proactive assistance</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Software Services & Automation Focus */}
        <div id="services" className="mt-14 p-8 rounded-2xl bg-gradient-to-br from-[#0F1626] via-[#0D1424] to-[#0A0E1A] border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">
                Comprehensive Software Services & Automation
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                From single-store point-of-sale setups to multi-branch centralized databases.
              </p>
            </div>

            <button
              onClick={onExploreSoftware}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#0B0F19] bg-[#D4AF37] hover:bg-[#E0C572] transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              <span>Explore Products</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-[#D4AF37]">POS Deployment & Setup</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hardware pairing with thermal printers, customer-facing pole displays, cash drawers, and barcode scanners.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-[#D4AF37]">Business Process Automation</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automated stock deduction upon invoice generation, scheduled reorder triggers, and end-of-day reconciliation.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-[#D4AF37]">Database Security & Backup</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Structured local database mirroring and cloud backup routines to safeguard transaction records against hardware failure.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
