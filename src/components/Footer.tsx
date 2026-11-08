import React from 'react';
import { Logo } from './Logo';
import { CompanySettings } from '../types';
import { Phone, MessageSquare, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  settings: CompanySettings;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate, onOpenAdmin }) => {
  const currentYear = new Date().getFullYear();

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Assalam o Alaikum, I am interested in AADI Software Solutions. Please share software details and pricing.'
  )}`;

  return (
    <footer className="bg-[#070A10] border-t border-slate-800 text-slate-400 text-xs">
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Brand & Tagline (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="md" />
            <p className="text-sm font-semibold text-[#D4AF37]">
              "{settings.tagline}"
            </p>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Empowering retailers, restaurants, and growing enterprises across Pakistan with reliable, easy-to-use POS, ERP, Inventory, and Accounting systems.
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              Alternative Slogan: <span className="text-slate-300 font-medium">{settings.secondarySlogan}</span>
            </div>
          </div>

          {/* Column 2: Navigation Links (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </p>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('software')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Our Software
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('portfolio')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Software Solutions (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              Software Solutions
            </p>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('software')}
                  className="hover:text-[#D4AF37] transition-colors text-left"
                >
                  Restaurant POS Software
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('software')}
                  className="hover:text-[#D4AF37] transition-colors text-left"
                >
                  Retail POS & Barcode Billing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('software')}
                  className="hover:text-[#D4AF37] transition-colors text-left"
                >
                  Enterprise ERP Software
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('software')}
                  className="hover:text-[#D4AF37] transition-colors text-left"
                >
                  Inventory Management System
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('software')}
                  className="hover:text-[#D4AF37] transition-colors text-left"
                >
                  Financial Accounting Software
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('software')}
                  className="hover:text-[#D4AF37] transition-colors text-left"
                >
                  Pharmacy Management Software
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('software')}
                  className="hover:text-[#D4AF37] transition-colors text-left"
                >
                  Custom Business Software
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              Contact & Office
            </p>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <a href={settings.phoneDialer} className="text-slate-300 hover:text-white">
                  {settings.phoneNumber}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 fill-current" />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                  +{settings.whatsappNumber}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="text-slate-300 hover:text-white">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-snug">
                  {settings.officeAddress}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Legal */}
      <div className="border-t border-slate-800/80 py-6 bg-[#05070C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs">
            <span
              onClick={onOpenAdmin}
              className="cursor-default select-none hover:text-[#D4AF37] transition-colors"
              title="AADI Software Solutions"
            >
              ©
            </span>{' '}
            {currentYear} AADI Software Solutions. All Rights Reserved.
          </p>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span
              onClick={onOpenAdmin}
              className="cursor-default select-none hover:text-[#D4AF37] transition-colors"
              title="AADI"
            >
              ·
            </span>
            <span className="hover:text-slate-300 cursor-pointer">Terms and Conditions</span>
            <span>·</span>
            <span className="text-slate-400">Smart Business. Better Tomorrow.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
