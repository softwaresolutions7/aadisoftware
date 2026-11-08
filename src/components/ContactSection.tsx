import React, { useState } from 'react';
import { CompanySettings, SoftwareProduct } from '../types';
import { api } from '../services/api';
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Headphones,
  Wrench,
  HelpCircle
} from 'lucide-react';

interface ContactSectionProps {
  settings: CompanySettings;
  products: SoftwareProduct[];
  prefilledSoftware?: string;
  onInquirySubmitted?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  products,
  prefilledSoftware = '',
  onInquirySubmitted,
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    businessName: '',
    phoneNumber: '',
    whatsappNumber: '',
    email: '',
    softwareInterestedIn: prefilledSoftware || 'Restaurant POS Software',
    businessType: 'Retail / Restaurant',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync if prefilled software changes
  React.useEffect(() => {
    if (prefilledSoftware) {
      setFormData((prev) => ({ ...prev, softwareInterestedIn: prefilledSoftware }));
    }
  }, [prefilledSoftware]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Validation
    if (!formData.customerName.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your Customer Name.' });
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setStatusMessage({ type: 'error', text: 'Please provide a valid Phone Number for sales contact.' });
      return;
    }
    if (!formData.message.trim()) {
      setStatusMessage({ type: 'error', text: 'Please provide details or questions in the Message field.' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitInquiry(formData);
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: 'Thank you! Your software inquiry has been submitted. Our sales and support team will contact you shortly.'
        });
        setFormData({
          customerName: '',
          businessName: '',
          phoneNumber: '',
          whatsappNumber: '',
          email: '',
          softwareInterestedIn: products[0]?.name || 'Restaurant POS Software',
          businessType: 'Retail / Restaurant',
          message: '',
        });
        if (onInquirySubmitted) onInquirySubmitted();
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Submission failed. Please try again or WhatsApp us directly.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'A network error occurred. Please contact us via WhatsApp.' });
    } finally {
      setLoading(false);
    }
  };

  const directWhatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Assalam o Alaikum, I am interested in AADI Software Solutions. Please share software details and pricing.'
  )}`;

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#090D16] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#D4AF37]">
            <Headphones className="w-3.5 h-3.5" />
            <span>Direct Sales & Inquiries</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance">
            Contact AADI Software Solutions
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Have questions about POS hardware compatibility, custom modules, or pricing? Reach our team directly via phone, WhatsApp, or through the inquiry form below.
          </p>
        </div>

        {/* 2-Column Split: Contact Details & Support Channels on Left, Form on Right */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Contact Info & Support Channels */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Information Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-[#D4AF37]" />
                <span>Company Contact Information</span>
              </h3>

              <div className="space-y-4 text-sm">
                {/* Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[#D4AF37] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Phone Number</p>
                    <a
                      href={settings.phoneDialer}
                      className="font-semibold text-white hover:text-[#D4AF37] transition-colors"
                    >
                      {settings.phoneNumber}
                    </a>
                    <span className="block text-[11px] text-slate-400 mt-0.5">Click to call directly on mobile</span>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 shrink-0">
                    <MessageSquare className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">WhatsApp Sales & Support</p>
                    <a
                      href={directWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-emerald-400 hover:underline"
                    >
                      +{settings.whatsappNumber}
                    </a>
                    <span className="block text-[11px] text-slate-400 mt-0.5">Instant WhatsApp chat & quotation</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Email Address</p>
                    <a
                      href={`mailto:${settings.email}`}
                      className="font-semibold text-white hover:text-blue-400 transition-colors"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>

                {/* Office Address */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-purple-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Office Address</p>
                    <p className="font-semibold text-slate-200 leading-snug">
                      {settings.officeAddress}
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[#D4AF37] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Business & Office Hours</p>
                    <p className="font-semibold text-slate-200">
                      {settings.businessHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Support Services Card */}
            <div className="p-6 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#D4AF37]" />
                <span>Technical Support Services</span>
              </h4>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-slate-800">
                  <span className="font-semibold text-white block">Software Installation Assistance:</span>
                  <span className="text-slate-400">Remote and on-site setup for receipt printers, cash drawers, and barcode scanners.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-slate-800">
                  <span className="font-semibold text-white block">Dedicated Support Hours:</span>
                  <span className="text-slate-400">{settings.supportHours}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Customer Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Send a Software Inquiry
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Fill in your requirements and our team will get back to you with a tailored proposal.
                </p>
              </div>

              {statusMessage && (
                <div
                  className={`p-4 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 border ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-950/40 border-red-500/40 text-red-300'
                  }`}
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{statusMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Customer Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="e.g. Usman Shah"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-slate-700/80 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Business Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="e.g. Shah Foods & Bakers"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-slate-700/80 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="e.g. +92 300 1234567"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-slate-700/80 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* WhatsApp Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      placeholder="e.g. 923001234567"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-slate-700/80 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. contact@business.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-slate-700/80 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Software Interested In */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Software Interested In <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.softwareInterestedIn}
                      onChange={(e) => setFormData({ ...formData, softwareInterestedIn: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37]"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.name} className="bg-[#0B0F19] text-white">
                          {p.name}
                        </option>
                      ))}
                      <option value="Complete ERP + POS Bundle" className="bg-[#0B0F19] text-white">Complete ERP + POS Bundle</option>
                      <option value="Custom Development Inquiry" className="bg-[#0B0F19] text-white">Custom Development Inquiry</option>
                    </select>
                  </div>
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Business Type
                  </label>
                  <input
                    type="text"
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    placeholder="e.g. Restaurant, Supermarket, Pharmacy, Wholesale, Factory"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-slate-700/80 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Message / Operational Requirements <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about how many counters, printer hardware, or special workflows you need..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-slate-700/80 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37] resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold text-[#0B0F19] bg-gradient-to-r from-[#F6EFD3] via-[#D4AF37] to-[#C5A059] hover:from-white hover:to-[#E0C572] transition-all duration-200 active:scale-98 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting Inquiry...' : 'Send Inquiry'}</span>
                </button>

                <div className="pt-2 text-center text-xs text-slate-400">
                  Prefer direct instant messaging?{' '}
                  <a
                    href={directWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-semibold hover:underline"
                  >
                    Chat on WhatsApp directly
                  </a>
                </div>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
