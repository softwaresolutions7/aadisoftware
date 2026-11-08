import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { MessageSquare, Phone, ShieldCheck, Menu, X, ArrowRight, FileText } from 'lucide-react';
import { CompanySettings } from '../types';

interface NavbarProps {
  settings: CompanySettings;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenQuoteModal: (softwarePrefill?: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeSection,
  onNavigate,
  onOpenQuoteModal,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoSecretClick = (e: React.MouseEvent) => {
    // Normal navigation on single click
    handleLinkClick('home');

    // Secret triple-tap detection for admin portal
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount >= 3) {
      setLogoClicks(0);
      onOpenAdmin();
    } else {
      setTimeout(() => setLogoClicks(0), 1200);
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'software', label: 'Our Software' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Assalam o Alaikum, I am interested in AADI Software Solutions. Please share software details and pricing.'
  )}`;

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-200 border-b ${
          isScrolled
            ? 'bg-[#0B0F19]/95 backdrop-blur-md border-slate-800/80 shadow-lg shadow-black/40 py-3'
            : 'bg-[#0B0F19] border-slate-800/50 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            {/* Zone 1: Brand Wordmark (with secret triple-click to open admin) */}
            <button
              onClick={handleLogoSecretClick}
              className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-lg select-none"
              aria-label="AADI Software Solutions Home"
            >
              <Logo size="md" />
            </button>

            {/* Zone 2: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    className={`text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'text-[#D4AF37] font-semibold border-b-2 border-[#D4AF37] pb-1'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Actions (Quote & WhatsApp) */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              {/* Phone call shortcut */}
              <a
                href={settings.phoneDialer}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors border border-slate-800"
                title={`Call ${settings.phoneNumber}`}
              >
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="whitespace-nowrap">{settings.phoneNumber}</span>
              </a>

              {/* Get a Quote Button */}
              <button
                onClick={() => onOpenQuoteModal()}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#0B0F19] bg-gradient-to-r from-[#F6EFD3] via-[#D4AF37] to-[#C5A059] hover:from-[#FFF6DD] hover:to-[#E0C572] rounded-lg shadow-sm transition-all duration-150 active:scale-95 whitespace-nowrap cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Get a Quote</span>
              </button>

              {/* WhatsApp Us Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 rounded-lg transition-all active:scale-95 whitespace-nowrap"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp Us</span>
              </a>
            </div>

            {/* Mobile hamburger menu toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => onOpenQuoteModal()}
                className="sm:hidden px-3 py-1.5 text-xs font-semibold text-[#0B0F19] bg-[#D4AF37] rounded-md whitespace-nowrap"
              >
                Quote
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#0B0F19] px-4 pt-3 pb-6 space-y-3 mt-3 animate-in fade-in duration-150">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === link.id
                      ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 rounded-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={settings.phoneDialer}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-slate-200 bg-slate-900 border border-slate-800 rounded-lg"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>Call {settings.phoneNumber}</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
