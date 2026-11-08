import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { CompanySettings } from '../types';

interface FloatingWhatsAppProps {
  settings: CompanySettings;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ settings }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const inquiryMessage = 'Assalam o Alaikum, I am interested in AADI Software Solutions. Please share software details and pricing.';
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(inquiryMessage)}`;

  return (
    <aside aria-label="WhatsApp Contact" className="fixed bottom-6 right-6 z-40 flex items-end gap-3 pointer-events-auto">
      {/* Interactive Tooltip bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0F1626] border border-emerald-500/40 text-slate-200 text-xs shadow-xl shadow-black/80 animate-in fade-in duration-300">
          <div>
            <p className="font-bold text-emerald-400">Chat with AADI Sales</p>
            <p className="text-[11px] text-slate-300">Online for POS & ERP questions</p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white p-0.5"
            aria-label="Dismiss chat tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with AADI Software Solutions"
        className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <MessageSquare className="w-7 h-7 fill-current" />
        
        {/* Gentle attention ping ring */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300"></span>
        </span>
      </a>
    </aside>
  );
};
