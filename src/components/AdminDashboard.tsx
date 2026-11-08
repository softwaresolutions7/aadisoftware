import React, { useState, useEffect } from 'react';
import { CompanySettings, Inquiry, PricingPackage, SoftwareProduct } from '../types';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  X, 
  Lock, 
  LogOut, 
  Inbox, 
  Layers, 
  Settings as SettingsIcon, 
  Tag, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  MessageSquare, 
  Search, 
  CheckCircle2, 
  Phone,
  Mail,
  Building,
  Clock,
  Eye,
  EyeOff,
  Key,
  AlertCircle,
  Download
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CompanySettings;
  products: SoftwareProduct[];
  packages: PricingPackage[];
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  settings,
  products,
  packages,
  onRefreshData,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'inquiries' | 'products' | 'pricing' | 'settings' | 'security'>('inquiries');
  
  // Data states
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryFilter, setInquiryFilter] = useState<string>('all');
  
  // Editable product state
  const [editingProduct, setEditingProduct] = useState<SoftwareProduct | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Editable settings state
  const [editSettings, setEditSettings] = useState<CompanySettings>(settings);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Editable package state
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null);

  // Security / Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newAdminUser, setNewAdminUser] = useState('admin');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check auth on open
  useEffect(() => {
    if (isOpen) {
      const token = api.getAdminToken();
      if (token) {
        setIsAuthenticated(true);
        loadInquiries();
      }
      setEditSettings(settings);
    }
  }, [isOpen, settings]);

  const loadInquiries = async () => {
    try {
      const data = await api.getInquiries();
      setInquiries(data);
    } catch {
      // Fallback
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await api.adminLogin(username, password);
      if (res.success) {
        setIsAuthenticated(true);
        loadInquiries();
      } else {
        setLoginError(res.error || 'Invalid credentials');
      }
    } catch {
      setLoginError('Authentication failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    api.setAdminToken(null);
    setIsAuthenticated(false);
  };

  // Inquiry actions
  const handleUpdateStatus = async (id: string, status: Inquiry['status']) => {
    await api.updateInquiryStatus(id, status);
    loadInquiries();
  };

  const handleDeleteInquiry = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer inquiry?')) {
      await api.deleteInquiry(id);
      loadInquiries();
    }
  };

  const handleExportCSV = () => {
    if (inquiries.length === 0) return;
    const headers = ['ID', 'Customer Name', 'Business Name', 'Phone', 'WhatsApp', 'Email', 'Software', 'Status', 'Date', 'Message'];
    const rows = inquiries.map(i => [
      i.id,
      `"${(i.customerName || '').replace(/"/g, '""')}"`,
      `"${(i.businessName || '').replace(/"/g, '""')}"`,
      `"${(i.phoneNumber || '').replace(/"/g, '""')}"`,
      `"${(i.whatsappNumber || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.softwareInterestedIn || '').replace(/"/g, '""')}"`,
      i.status,
      new Date(i.createdAt).toLocaleString(),
      `"${(i.message || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AADI_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Settings save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.updateSettings(editSettings);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
    onRefreshData();
  };

  // Product save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (isCreatingProduct) {
      await api.createProduct(editingProduct);
    } else {
      await api.updateProduct(editingProduct.id, editingProduct);
    }
    setEditingProduct(null);
    setIsCreatingProduct(false);
    onRefreshData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this software product?')) {
      await api.deleteProduct(id);
      onRefreshData();
    }
  };

  // Package save
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    await api.updatePackage(editingPackage.id, editingPackage);
    setEditingPackage(null);
    onRefreshData();
  };

  // Change Admin Password handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);

    if (!currentPassword) {
      setPassMessage({ type: 'error', text: 'Please enter your current password.' });
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setPassMessage({ type: 'error', text: 'New password must be at least 4 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setPassLoading(true);
    try {
      const res = await api.changeAdminPassword({
        currentPassword,
        newUsername: newAdminUser.trim() || undefined,
        newPassword
      });
      if (res.success) {
        setPassMessage({
          type: 'success',
          text: 'Admin password has been changed successfully! Please save your new password safely.'
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPassMessage({ type: 'error', text: res.error || 'Failed to update password.' });
      }
    } catch {
      setPassMessage({ type: 'error', text: 'Failed to update password. Please verify connection.' });
    } finally {
      setPassLoading(false);
    }
  };

  if (!isOpen) return null;

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesFilter = inquiryFilter === 'all' ? true : inq.status === inquiryFilter;
    const matchesSearch =
      inq.customerName.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.phoneNumber.includes(inquirySearch) ||
      inq.softwareInterestedIn.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.businessName.toLowerCase().includes(inquirySearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-6xl bg-[#0B0F19] border border-slate-700/80 rounded-2xl shadow-2xl shadow-black overflow-hidden max-h-[94vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0F1626] border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>AADI Administrator Portal</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isAuthenticated ? 'Authenticated' : 'Protected'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">Content management, customer leads & settings</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Close Admin Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content View: Login screen OR Dashboard tabs */}
        {!isAuthenticated ? (
          /* Secure Login View */
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mx-auto shadow-lg">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Administrator Access</h3>
              <p className="text-xs text-slate-400">
                Sign in with authorized administrator credentials to manage products, view inquiries, and update contact settings.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Admin Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0F1626] border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Admin Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0F1626] border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-[#0B0F19] bg-gradient-to-r from-[#F6EFD3] to-[#D4AF37] hover:from-white hover:to-[#E0C572] transition-colors cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{loginLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard Tabs */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Top Navigation Bar of Admin Tabs */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-[#0F1626]/60 overflow-x-auto">
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'inquiries'
                    ? 'border-[#D4AF37] text-[#D4AF37] bg-[#0B0F19]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>Customer Inquiries ({inquiries.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'border-[#D4AF37] text-[#D4AF37] bg-[#0B0F19]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Manage Software Products ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('pricing')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'pricing'
                    ? 'border-[#D4AF37] text-[#D4AF37] bg-[#0B0F19]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Pricing Packages ({packages.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-[#D4AF37] text-[#D4AF37] bg-[#0B0F19]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <SettingsIcon className="w-4 h-4" />
                <span>Contact Info & Settings</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'border-[#D4AF37] text-[#D4AF37] bg-[#0B0F19]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>Security & Password</span>
              </button>
            </div>

            {/* Scrollable Tab Views */}
            <div className="overflow-y-auto p-6 flex-1 space-y-6">

              {/* ================= TAB 1: INQUIRIES ================= */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  {/* Informational banner and CSV Export */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#141C2E] to-[#0F1626] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Inbox className="w-4 h-4 text-[#D4AF37]" />
                        <span>Customer Leads & Quotation Inquiries</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 font-mono">
                          {inquiries.length} Total
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Whenever someone clicks <strong>"Send Quote Request"</strong> or submits the contact form, their complete contact details and message appear here immediately.
                      </p>
                    </div>

                    <button
                      onClick={handleExportCSV}
                      disabled={inquiries.length === 0}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                      title="Download as CSV spreadsheet"
                    >
                      <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Export to Excel / CSV</span>
                    </button>
                  </div>

                  {/* Controls: Search and Filter */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0F1626] p-3 rounded-xl border border-slate-800">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={inquirySearch}
                        onChange={(e) => setInquirySearch(e.target.value)}
                        placeholder="Search customer, phone, or software..."
                        className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                      {(['all', 'new', 'contacted', 'in_progress', 'closed'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setInquiryFilter(st)}
                          className={`px-3 py-1 text-xs font-medium rounded-lg capitalize whitespace-nowrap cursor-pointer ${
                            inquiryFilter === st
                              ? 'bg-[#D4AF37] text-[#0B0F19] font-bold'
                              : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inquiries Cards List */}
                  {filteredInquiries.length === 0 ? (
                    <div className="text-center py-12 rounded-xl bg-slate-900/30 border border-slate-800">
                      <Inbox className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">No customer inquiries match your search.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredInquiries.map((inq) => {
                        const replyWhatsappUrl = `https://wa.me/${inq.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Assalam o Alaikum ${inq.customerName}, this is AADI Software Solutions regarding your inquiry for ${inq.softwareInterestedIn}.`
                        )}`;

                        return (
                          <div
                            key={inq.id}
                            className="p-5 rounded-xl bg-[#0F1626] border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-white text-sm">{inq.customerName}</h4>
                                  {inq.businessName && (
                                    <span className="text-xs text-slate-400">· {inq.businessName}</span>
                                  )}
                                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                    inq.status === 'new'
                                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                      : inq.status === 'contacted'
                                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                      : inq.status === 'in_progress'
                                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  }`}>
                                    {inq.status.replace('_', ' ')}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Software: <strong className="text-[#D4AF37]">{inq.softwareInterestedIn}</strong> &nbsp;·&nbsp;
                                  Received: {new Date(inq.createdAt).toLocaleString()}
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <a
                                  href={replyWhatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                                  <span>Reply on WhatsApp</span>
                                </a>

                                <a
                                  href={`tel:${inq.phoneNumber}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700"
                                >
                                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                                  <span>Call</span>
                                </a>

                                <button
                                  onClick={() => handleDeleteInquiry(inq.id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 border border-slate-800"
                                  title="Delete Inquiry"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Message text */}
                            <div className="p-3 rounded-lg bg-[#0B0F19] border border-slate-800/80 text-xs text-slate-300">
                              <span className="font-semibold text-slate-400 block mb-1">Customer Requirements:</span>
                              {inq.message}
                            </div>

                            {/* Status changer buttons */}
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-slate-400 text-[11px]">Update Status:</span>
                              {(['new', 'contacted', 'in_progress', 'closed'] as const).map((st) => (
                                <button
                                  key={st}
                                  onClick={() => handleUpdateStatus(inq.id, st)}
                                  className={`px-2 py-0.5 rounded text-[11px] capitalize cursor-pointer ${
                                    inq.status === st
                                      ? 'bg-slate-800 text-[#D4AF37] font-bold border border-[#D4AF37]/40'
                                      : 'text-slate-500 hover:text-slate-300'
                                  }`}
                                >
                                  {st.replace('_', ' ')}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ================= TAB 2: PRODUCTS ================= */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  {editingProduct ? (
                    /* Edit / Add Product Form */
                    <form onSubmit={handleSaveProduct} className="p-6 rounded-xl bg-[#0F1626] border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h4 className="font-bold text-white text-base">
                          {isCreatingProduct ? 'Add New Software Product' : `Edit: ${editingProduct.name}`}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(null);
                            setIsCreatingProduct(false);
                          }}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.category}
                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description</label>
                        <input
                          type="text"
                          required
                          value={editingProduct.shortDescription}
                          onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Full Description</label>
                        <textarea
                          rows={3}
                          required
                          value={editingProduct.fullDescription}
                          onChange={(e) => setEditingProduct({ ...editingProduct, fullDescription: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Key Features (Comma-separated)
                        </label>
                        <textarea
                          rows={3}
                          value={editingProduct.features.join(', ')}
                          onChange={(e) => setEditingProduct({
                            ...editingProduct,
                            features: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                          })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProduct.isPublished}
                            onChange={(e) => setEditingProduct({ ...editingProduct, isPublished: e.target.checked })}
                            className="rounded text-[#D4AF37]"
                          />
                          <span>Published on Website</span>
                        </label>
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(null);
                            setIsCreatingProduct(false);
                          }}
                          className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold text-[#0B0F19] bg-[#D4AF37]"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Product Changes</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-400">
                          Manage all 7 business software modules, descriptions, and features.
                        </p>
                        <button
                          onClick={() => {
                            setIsCreatingProduct(true);
                            setEditingProduct({
                              id: `prod-${Date.now()}`,
                              name: 'New Custom Solution',
                              slug: 'new-custom-solution',
                              category: 'Business Automation',
                              shortDescription: 'Custom automated workflow software.',
                              fullDescription: 'Custom automated workflow software tailored for specialized enterprise requirements.',
                              iconName: 'Cpu',
                              image: '/src/assets/images/hero_software_suite_1793979102769.jpg',
                              isPublished: true,
                              order: products.length + 1,
                              features: ['Custom user roles', 'Automated reports', 'Local database sync'],
                              benefits: ['Reduces operational overhead'],
                              systemRequirements: { os: 'Windows 10 / 11', processor: 'Core i3', ram: '4 GB', storage: '2 GB' },
                              faqs: [],
                              pricingNote: 'Contact Us for Pricing',
                              whatsappPrefill: 'Assalam o Alaikum, I would like to inquire about this software.'
                            });
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-[#0B0F19] bg-[#D4AF37] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add New Product</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {products.map((prod) => (
                          <div
                            key={prod.id}
                            className="p-4 rounded-xl bg-[#0F1626] border border-slate-800 space-y-3 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-bold text-white text-sm">{prod.name}</h4>
                                  <span className="text-[11px] text-[#D4AF37] font-semibold">{prod.category}</span>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                                  prod.isPublished
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                }`}>
                                  {prod.isPublished ? 'Published' : 'Hidden'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                                {prod.shortDescription}
                              </p>
                              <div className="mt-2 text-[11px] text-slate-400">
                                {prod.features.length} features configured
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                              <button
                                onClick={() => {
                                  setIsCreatingProduct(false);
                                  setEditingProduct(prod);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3 text-[#D4AF37]" />
                                <span>Edit Product</span>
                              </button>

                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 border border-slate-800"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ================= TAB 3: PRICING ================= */}
              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  {editingPackage ? (
                    <form onSubmit={handleSavePackage} className="p-6 rounded-xl bg-[#0F1626] border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h4 className="font-bold text-white text-base">Edit: {editingPackage.name}</h4>
                        <button
                          type="button"
                          onClick={() => setEditingPackage(null)}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Package Name</label>
                          <input
                            type="text"
                            required
                            value={editingPackage.name}
                            onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Pricing Label Note</label>
                          <input
                            type="text"
                            required
                            value={editingPackage.priceNote}
                            onChange={(e) => setEditingPackage({ ...editingPackage, priceNote: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Target Business Scope</label>
                        <input
                          type="text"
                          required
                          value={editingPackage.targetBusiness}
                          onChange={(e) => setEditingPackage({ ...editingPackage, targetBusiness: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Features (One per line)</label>
                        <textarea
                          rows={6}
                          value={editingPackage.features.join('\n')}
                          onChange={(e) => setEditingPackage({
                            ...editingPackage,
                            features: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)
                          })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingPackage(null)}
                          className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold text-[#0B0F19] bg-[#D4AF37]"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Package</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {packages.map((pkg) => (
                        <div key={pkg.id} className="p-5 rounded-xl bg-[#0F1626] border border-slate-800 space-y-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-white text-base">{pkg.name}</h4>
                              {pkg.popular && (
                                <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 font-bold">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{pkg.targetBusiness}</p>
                            <div className="mt-3 py-2 px-3 rounded bg-slate-900 text-center font-bold text-sm text-[#D4AF37]">
                              {pkg.priceNote}
                            </div>
                            <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                              {pkg.features.slice(0, 4).map((f, i) => (
                                <li key={i} className="line-clamp-1">• {f}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-4 border-t border-slate-800">
                            <button
                              onClick={() => setEditingPackage(pkg)}
                              className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Edit Package</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ================= TAB 4: SETTINGS ================= */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="p-6 rounded-xl bg-[#0F1626] border border-slate-800 space-y-6 max-w-3xl">
                  <div>
                    <h4 className="font-bold text-white text-base">Company Contact Information & Placeholders</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Update your actual official phone number, WhatsApp click-to-chat digits, business email, and office address.
                    </p>
                  </div>

                  {settingsSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Company settings updated successfully across the entire website!</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Phone Number Display [YOUR PHONE NUMBER]
                      </label>
                      <input
                        type="text"
                        required
                        value={editSettings.phoneNumber}
                        onChange={(e) => setEditSettings({ ...editSettings, phoneNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white"
                      />
                    </div>

                    {/* Phone Dialer Link */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Phone Dialer Link (tel:+923...)
                      </label>
                      <input
                        type="text"
                        required
                        value={editSettings.phoneDialer}
                        onChange={(e) => setEditSettings({ ...editSettings, phoneDialer: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* WhatsApp Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        WhatsApp Number [YOUR WHATSAPP NUMBER]
                      </label>
                      <input
                        type="text"
                        required
                        value={editSettings.whatsappNumber}
                        onChange={(e) => setEditSettings({ ...editSettings, whatsappNumber: e.target.value })}
                        placeholder="923001234567 (digits only)"
                        className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white"
                      />
                      <span className="text-[10px] text-slate-500 mt-0.5 block">Format: International digits without plus or spaces (e.g. 923001234567)</span>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address [YOUR BUSINESS EMAIL]
                      </label>
                      <input
                        type="email"
                        required
                        value={editSettings.email}
                        onChange={(e) => setEditSettings({ ...editSettings, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Office Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Office Address [YOUR OFFICE ADDRESS]
                    </label>
                    <input
                      type="text"
                      required
                      value={editSettings.officeAddress}
                      onChange={(e) => setEditSettings({ ...editSettings, officeAddress: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Business Hours */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Business & Office Hours
                      </label>
                      <input
                        type="text"
                        required
                        value={editSettings.businessHours}
                        onChange={(e) => setEditSettings({ ...editSettings, businessHours: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white"
                      />
                    </div>

                    {/* Support Hours */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Support Service Hours
                      </label>
                      <input
                        type="text"
                        required
                        value={editSettings.supportHours}
                        onChange={(e) => setEditSettings({ ...editSettings, supportHours: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-[#0B0F19] bg-gradient-to-r from-[#F6EFD3] to-[#D4AF37] hover:from-white hover:to-[#E0C572] cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Company Settings</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ================= TAB 5: SECURITY & PASSWORD ================= */}
              {activeTab === 'security' && (
                <div className="space-y-6 max-w-3xl">
                  {/* Password Change Form */}
                  <form onSubmit={handleChangePassword} className="p-6 rounded-xl bg-[#0F1626] border border-slate-800 space-y-5">
                    <div>
                      <h4 className="font-bold text-white text-base flex items-center gap-2">
                        <Key className="w-4 h-4 text-[#D4AF37]" />
                        <span>Change Admin Password & Username</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Update your administrator login credentials. New credentials will be saved securely and persistently in the database.
                      </p>
                    </div>

                    {passMessage && (
                      <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 border ${
                        passMessage.type === 'success'
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                          : 'bg-red-950/40 border-red-500/40 text-red-300'
                      }`}>
                        {passMessage.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <span>{passMessage.text}</span>
                      </div>
                    )}

                    {/* Current Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Current Password <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPass ? 'text' : 'password'}
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter your current admin password"
                          className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Admin Username */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Admin Username (Optional to change)
                      </label>
                      <input
                        type="text"
                        value={newAdminUser}
                        onChange={(e) => setNewAdminUser(e.target.value)}
                        placeholder="admin"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    {/* New Password & Confirm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          New Password <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPass ? 'text' : 'password'}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="At least 4 characters"
                            className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPass(!showNewPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Confirm New Password <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={passLoading}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-[#0B0F19] bg-gradient-to-r from-[#F6EFD3] to-[#D4AF37] hover:from-white hover:to-[#E0C572] cursor-pointer disabled:opacity-50"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>{passLoading ? 'Updating Password...' : 'Save New Password'}</span>
                      </button>
                    </div>
                  </form>

                  {/* Secret Access Instructions Card */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-[#0F1626] to-[#0A0E18] border border-slate-800 space-y-4">
                    <div className="flex items-center gap-2 text-[#D4AF37]">
                      <ShieldCheck className="w-5 h-5" />
                      <h4 className="font-bold text-white text-sm">
                        Hidden Admin Access Guide (Confidential to You)
                      </h4>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      All visible admin buttons have been hidden from the public website header, mobile menu, and footer. Regular visitors will never see any admin options. As the owner/admin, you can open this dashboard anytime using any of these 4 secret methods:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-lg bg-[#0B0F19] border border-slate-800">
                        <span className="font-bold text-[#D4AF37] block mb-1">1. Direct Secret URL</span>
                        <span className="text-slate-300 font-mono text-[11px] block bg-slate-900 p-1 rounded mt-0.5">
                          /#admin
                        </span>
                        <span className="text-slate-400 text-[11px] mt-1 block">
                          Add <code className="text-white">/#admin</code> to your website link in your browser bar.
                        </span>
                      </div>

                      <div className="p-3.5 rounded-lg bg-[#0B0F19] border border-slate-800">
                        <span className="font-bold text-[#D4AF37] block mb-1">2. Secret Keyboard Shortcut</span>
                        <span className="text-slate-300 font-mono text-[11px] block bg-slate-900 p-1 rounded mt-0.5">
                          Ctrl + Shift + A
                        </span>
                        <span className="text-slate-400 text-[11px] mt-1 block">
                          Press keys together anywhere on the website (or <code className="text-white">Cmd+Shift+A</code> on Mac).
                        </span>
                      </div>

                      <div className="p-3.5 rounded-lg bg-[#0B0F19] border border-slate-800">
                        <span className="font-bold text-[#D4AF37] block mb-1">3. Mobile / Touchscreen Secret</span>
                        <span className="text-slate-300 font-semibold block mt-0.5">
                          Triple-Tap AADI Logo
                        </span>
                        <span className="text-slate-400 text-[11px] mt-1 block">
                          Tap or click the AADI brand logo in the top navbar 3 times quickly.
                        </span>
                      </div>

                      <div className="p-3.5 rounded-lg bg-[#0B0F19] border border-slate-800">
                        <span className="font-bold text-[#D4AF37] block mb-1">4. Secret Footer Click</span>
                        <span className="text-slate-300 font-semibold block mt-0.5">
                          Click © Copyright Sign
                        </span>
                        <span className="text-slate-400 text-[11px] mt-1 block">
                          Click the copyright symbol <code className="text-white">©</code> at the bottom of the footer.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
