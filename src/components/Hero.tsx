
import React, { useState } from 'react';
import {
  ArrowRight,
  MessageSquare,
  Phone,
  CheckCircle2,
  Cpu,
  Headphones,
  Zap,
  TrendingUp,
  Receipt,
  Layers,
  UtensilsCrossed,
} from 'lucide-react';

import { CompanySettings } from '../types';

import restaurantImage from '../assets/images/pos_restaurant_mockup_179379101826.jpg';
import retailImage from '../assets/images/retail_pos_mockup_179379088491.jpg';
import erpImage from '../assets/images/erp_business_dashboard_17937908994.jpg';
import accountingImage from '../assets/images/hero_software_suite_179379102769.jpg';

interface HeroProps {
  settings: CompanySettings;
  onExplore: () => void;
  onContactSales: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onExplore,
  onContactSales,
}) => {
  const [activeTab, setActiveTab] = useState<
    'restaurant' | 'retail' | 'erp' | 'accounting'
  >('restaurant');

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(
    /[^0-9]/g,
    ''
  )}?text=${encodeURIComponent(
    'Assalam o Alaikum, I am interested in AADI Software Solutions. Please share software details and pricing.'
  )}`;

  const trustBadges = [
    { title: 'Professional Software Solutions', icon: Cpu },
    { title: 'Business Automation', icon: Zap },
    { title: 'Customer Support', icon: Headphones },
    { title: 'Easy-to-Use Systems', icon: CheckCircle2 },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800/80 bg-gradient-to-b from-[#0B0F19] via-[#0D1322] to-[#0B0F19]">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-[#D4AF37]/10 via-[#2563EB]/10 to-[#D4AF37]/5 blur-3xl pointer-events-none rounded-full" />

      <div className="absolute -top-32 right-10 w-72 h-72 bg-[#D4AF37]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6 text-left">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-[#D4AF37]/30 text-xs text-slate-300 shadow-sm">

              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />

              <span className="font-semibold text-[#D4AF37]">
                {settings.tagline}
              </span>

              <span className="text-slate-500">|</span>

              <span className="text-slate-400 hidden sm:inline">
                {settings.secondarySlogan}
              </span>

            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] text-balance">

              Smart Software Solutions for{' '}

              <span className="bg-gradient-to-r from-white via-[#F6EFD3] to-[#D4AF37] bg-clip-text text-transparent">
                Your Business
              </span>

            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-xl">

              Manage your business smarter with powerful POS, ERP, Restaurant Management, Inventory and Accounting Software designed to simplify your daily operations.

            </p>

            {/* Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">

              <button
                onClick={onExplore}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-[#0B0F19] bg-gradient-to-r from-[#F6EFD3] via-[#D4AF37] to-[#C5A059] hover:from-white hover:to-[#E0C572] rounded-xl shadow-lg shadow-[#D4AF37]/15 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <span>Explore Our Software</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onContactSales}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>Contact Sales</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/40 rounded-xl transition-all duration-200 shadow-sm"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>

            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">

              {trustBadges.map((badge, idx) => {
                const Icon = badge.icon;

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-slate-300"
                  >
                    <div className="p-1 rounded bg-[#D4AF37]/10 text-[#D4AF37] shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <span className="font-medium leading-tight">
                      {badge.title}
                    </span>
                  </div>
                );
              })}

            </div>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-6 relative">

            <div className="relative rounded-2xl bg-[#0F1626] border border-slate-700/60 p-2 sm:p-3 shadow-2xl shadow-black/80 gold-glow">

              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-xs">

                <div className="flex items-center gap-1.5">

                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />

                  <span className="ml-2 font-mono text-[11px] text-slate-400">
                    AADI Business Suite v4.2
                  </span>

                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Cloud & Offline Ready</span>
                </div>

              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-lg mt-2 border border-slate-800/80 overflow-x-auto">

                <button
                  onClick={() => setActiveTab('restaurant')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'restaurant'
                      ? 'bg-[#D4AF37] text-[#0B0F19] font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Restaurant POS</span>
                </button>

                <button
                  onClick={() => setActiveTab('retail')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'retail'
                      ? 'bg-[#D4AF37] text-[#0B0F19] font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Retail Billing</span>
                </button>

                <button
                  onClick={() => setActiveTab('erp')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'erp'
                      ? 'bg-[#D4AF37] text-[#0B0F19] font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>ERP & Analytics</span>
                </button>

                <button
                  onClick={() => setActiveTab('accounting')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'accounting'
                      ? 'bg-[#D4AF37] text-[#0B0F19] font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Finance & Ledger</span>
                </button>

              </div>

              {/* Image Display */}
              <div className="relative mt-2 rounded-xl overflow-hidden aspect-[16/10] bg-[#090D16] border border-slate-800">

                {activeTab === 'restaurant' && (
                  <div className="w-full h-full relative group">

                    <img
                      src={restaurantImage}
                      alt="AADI Restaurant POS Software Interface"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-80" />

                    <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-[#0B0F19]/90 border border-slate-700/80 backdrop-blur-sm flex items-center justify-between text-xs">

                      <div>
                        <p className="font-bold text-white">
                          Touch Dine-in & KOT Terminal
                        </p>

                        <p className="text-[11px] text-slate-400">
                          Thermal receipt printer, kitchen order tickets & table floor plan
                        </p>
                      </div>

                      <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px] border border-emerald-500/30">
                        Sub-second Checkout
                      </span>

                    </div>

                  </div>
                )}

                {activeTab === 'retail' && (
                  <div className="w-full h-full relative group">

                    <img
                      src={retailImage}
                      alt="AADI Retail POS Barcode Scanning Interface"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-80" />

                    <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-[#0B0F19]/90 border border-slate-700/80 backdrop-blur-sm flex items-center justify-between text-xs">

                      <div>
                        <p className="font-bold text-white">
                          Supermarket & Retail Barcode Counter
                        </p>

                        <p className="text-[11px] text-slate-400">
                          Instant barcode lookup, weigh scale sync & customer loyalty
                        </p>
                      </div>

                      <span className="px-2 py-1 rounded bg-[#2563EB]/30 text-blue-300 font-mono text-[11px] border border-[#2563EB]/40">
                        High-Volume Ready
                      </span>

                    </div>

                  </div>
                )}

                {activeTab === 'erp' && (
                  <div className="w-full h-full relative group">

                    <img
                      src={erpImage}
                      alt="AADI ERP Financial and Pipeline Analytics Dashboard"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-80" />

                    <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-[#0B0F19]/90 border border-slate-700/80 backdrop-blur-sm flex items-center justify-between text-xs">

                      <div>
                        <p className="font-bold text-white">
                          Multi-Branch ERP & Executive Analytics
                        </p>

                        <p className="text-[11px] text-slate-400">
                          Procurement, sales pipelines, multi-warehouse & payroll
                        </p>
                      </div>

                      <span className="px-2 py-1 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-mono text-[11px] border border-[#D4AF37]/40">
                        Unified Database
                      </span>

                    </div>

                  </div>
                )}

                {activeTab === 'accounting' && (
                  <div className="w-full h-full relative group">

                    <img
                      src={accountingImage}
                      alt="AADI Software Solutions Financial Ledger"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-80" />

                    <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-[#0B0F19]/90 border border-slate-700/80 backdrop-blur-sm flex items-center justify-between text-xs">

                      <div>
                        <p className="font-bold text-white">
                          Double-Entry Financial Accounting
                        </p>

                        <p className="text-[11px] text-slate-400">
                          Profit & loss, balance sheet, receivables & tax compliance
                        </p>
                      </div>

                      <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 font-mono text-[11px] border border-purple-500/30">
                        Audit Compliant
                      </span>

                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
