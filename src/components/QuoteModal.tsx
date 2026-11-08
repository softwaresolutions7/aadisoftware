import React, { useState, useEffect } from 'react';
import { CompanySettings, SoftwareProduct } from '../types';
import { api } from '../services/api';
import { X, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: SoftwareProduct[];
  settings: CompanySettings;
  preselectedProduct?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  products,
  settings,
  preselectedProduct = '',
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    businessName: '',
    phoneNumber: '',
    whatsappNumber: '',
    email: '',
    softwareInterestedIn: preselectedProduct || (products[0]?.name ?? 'Restaurant POS Software'),
    businessType: 'Retail / Restaurant',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (preselectedProduct) {
      setFormData((prev) => ({ ...prev, softwareInterestedIn: preselectedProduct }));
    }
  }, [preselectedProduct]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!formData.customerName.trim() || !formData.phoneNumber.trim()) {
      setStatus({ type: 'error', text: 'Name and phone number are required.' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitInquiry(formData);
      if (res.success) {
        setStatus({
          type: 'success',
          text: 'Quotation request submitted! Details saved in the system.',
        });
      } else {
        setStatus({ type: 'error', text: res.message || 'Submission failed.' });
      }
    } catch {
      setStatus({ type: 'error', text: 'Network error. Please try WhatsApp contact.' });
    } finally {
      setLoading(false);
    }
  };

  const whatsappDirectWithDetails = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Assalam o Alaikum AADI Software Solutions,\n\nI just requested a quote on your website:\n• Name: ${formData.customerName}\n• Business: ${formData.businessName || 'N/A'}\n• Phone: ${formData.phoneNumber}\n• WhatsApp: ${formData.whatsappNumber || formData.phoneNumber}\n• Software: ${formData.softwareInterestedIn}\n• Requirements: ${formData.message || 'Please share pricing details.'}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#0F1626] border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Request a Software Quotation</h3>
            <p className="text-xs text-slate-400 mt-0.5">AADI Software Solutions — Smart Business. Better Tomorrow.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {status?.type === 'success' ? (
          <div className="py-6 text-center space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white">Quotation Request Saved!</h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Your inquiry has been stored securely in our Admin System. You can also forward these details directly to our official WhatsApp right now for an instant response.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800 text-left text-xs space-y-1.5 text-slate-300">
              <p><strong className="text-white">Customer:</strong> {formData.customerName} {formData.businessName ? `(${formData.businessName})` : ''}</p>
              <p><strong className="text-white">Phone:</strong> {formData.phoneNumber}</p>
              <p><strong className="text-white">Software:</strong> <span className="text-[#D4AF37] font-semibold">{formData.softwareInterestedIn}</span></p>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={whatsappDirectWithDetails}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md active:scale-98"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Send Details to WhatsApp Now (+{settings.whatsappNumber})</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setStatus(null);
                  onClose();
                }}
                className="text-xs text-slate-400 hover:text-white pt-2 cursor-pointer block mx-auto underline underline-offset-4"
              >
                Done / Close Window
              </button>
            </div>
          </div>
        ) : (
          <>
            {status?.type === 'error' && (
              <div className="mt-4 p-3 rounded-xl text-xs flex items-center gap-2 border bg-red-950/40 border-red-500/40 text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{status.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Asad Ali"
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Ali Superstore"
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+92 300 0000000"
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="923000000000"
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Software Package</label>
                <select
                  value={formData.softwareInterestedIn}
                  onChange={(e) => setFormData({ ...formData, softwareInterestedIn: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.name} className="bg-[#0B0F19]">
                      {p.name}
                    </option>
                  ))}
                  <option value="Basic Package" className="bg-[#0B0F19]">Basic Package (Single Counter)</option>
                  <option value="Professional Package" className="bg-[#0B0F19]">Professional Package (Multi-Counter)</option>
                  <option value="Enterprise Package" className="bg-[#0B0F19]">Enterprise Package (Multi-Branch ERP)</option>
                  <option value="Custom Business Software" className="bg-[#0B0F19]">Custom Business Software</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Operational Requirements / Notes</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Number of checkouts, printer requirements, thermal paper size..."
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-[#0B0F19] bg-gradient-to-r from-[#F6EFD3] to-[#D4AF37] hover:from-white hover:to-[#E0C572] cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Submitting...' : 'Send Quote Request'}</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

