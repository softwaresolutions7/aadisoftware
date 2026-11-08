import { CompanySettings, Inquiry, PricingPackage, SoftwareProduct } from '../types';
import { initialCompanySettings, initialPricingPackages, initialProducts } from '../data/initialData';

const SETTINGS_KEY = 'aadi_local_settings';
const PRODUCTS_KEY = 'aadi_local_products';
const PACKAGES_KEY = 'aadi_local_packages';
const INQUIRIES_KEY = 'aadi_local_inquiries';
const TOKEN_KEY = 'aadi_admin_token';

// Helper for local storage fallback
function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // Ignore storage quota
  }
}

export const api = {
  // Authentication
  getAdminToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setAdminToken(token: string | null) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  async adminLogin(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        this.setAdminToken(data.token);
        return { success: true, token: data.token };
      }
      return { success: false, error: data.error || 'Invalid credentials' };
    } catch {
      // Offline fallback authentication
      const savedAuth = getLocal('aadi_custom_auth', { username: 'admin', password: 'AadiAdmin2026!' });
      if (username === savedAuth.username && password === savedAuth.password) {
        const dummyToken = 'aadi-auth-token-session-sec-2026';
        this.setAdminToken(dummyToken);
        return { success: true, token: dummyToken };
      }
      return { success: false, error: 'Login failed. Please verify credentials.' };
    }
  },

  async changeAdminPassword(params: {
    currentPassword: string;
    newUsername?: string;
    newPassword: string;
  }): Promise<{ success: boolean; message?: string; error?: string }> {
    const token = this.getAdminToken();
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLocal('aadi_custom_auth', {
          username: params.newUsername || 'admin',
          password: params.newPassword
        });
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Failed to update password' };
    } catch {
      const savedAuth = getLocal('aadi_custom_auth', { username: 'admin', password: 'AadiAdmin2026!' });
      if (params.currentPassword !== savedAuth.password) {
        return { success: false, error: 'Current password does not match.' };
      }
      setLocal('aadi_custom_auth', {
        username: params.newUsername || savedAuth.username,
        password: params.newPassword
      });
      return { success: true, message: 'Password updated successfully!' };
    }
  },

  // Settings
  async getSettings(): Promise<CompanySettings> {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setLocal(SETTINGS_KEY, data);
        return data;
      }
    } catch {
      // Fallback
    }
    return getLocal<CompanySettings>(SETTINGS_KEY, initialCompanySettings);
  },

  async updateSettings(settings: Partial<CompanySettings>): Promise<CompanySettings> {
    const token = this.getAdminToken();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        const data = await res.json();
        setLocal(SETTINGS_KEY, data.settings);
        return data.settings;
      }
    } catch {
      // Fallback
    }
    const current = getLocal<CompanySettings>(SETTINGS_KEY, initialCompanySettings);
    const updated = { ...current, ...settings };
    setLocal(SETTINGS_KEY, updated);
    return updated;
  },

  // Products
  async getProducts(): Promise<SoftwareProduct[]> {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setLocal(PRODUCTS_KEY, data);
        return data;
      }
    } catch {
      // Fallback
    }
    return getLocal<SoftwareProduct[]>(PRODUCTS_KEY, initialProducts);
  },

  async updateProduct(id: string, updates: Partial<SoftwareProduct>): Promise<SoftwareProduct> {
    const token = this.getAdminToken();
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Fallback
    }
    const list = getLocal<SoftwareProduct[]>(PRODUCTS_KEY, initialProducts);
    const index = list.findIndex(p => p.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      setLocal(PRODUCTS_KEY, list);
      return list[index];
    }
    throw new Error('Product not found');
  },

  async createProduct(product: Partial<SoftwareProduct>): Promise<SoftwareProduct> {
    const token = this.getAdminToken();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    const list = getLocal<SoftwareProduct[]>(PRODUCTS_KEY, initialProducts);
    const newProd = {
      ...product,
      id: `prod-${Date.now()}`,
      slug: (product.name || 'custom-software').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      isPublished: true,
      order: list.length + 1
    } as SoftwareProduct;
    list.push(newProd);
    setLocal(PRODUCTS_KEY, list);
    return newProd;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const token = this.getAdminToken();
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }
    const list = getLocal<SoftwareProduct[]>(PRODUCTS_KEY, initialProducts);
    setLocal(PRODUCTS_KEY, list.filter(p => p.id !== id));
    return true;
  },

  // Packages
  async getPackages(): Promise<PricingPackage[]> {
    try {
      const res = await fetch('/api/packages');
      if (res.ok) {
        const data = await res.json();
        setLocal(PACKAGES_KEY, data);
        return data;
      }
    } catch {
      // Fallback
    }
    return getLocal<PricingPackage[]>(PACKAGES_KEY, initialPricingPackages);
  },

  async updatePackage(id: string, updates: Partial<PricingPackage>): Promise<PricingPackage> {
    const token = this.getAdminToken();
    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    const list = getLocal<PricingPackage[]>(PACKAGES_KEY, initialPricingPackages);
    const idx = list.findIndex(pkg => pkg.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      setLocal(PACKAGES_KEY, list);
      return list[idx];
    }
    throw new Error('Package not found');
  },

  // Inquiries
  async submitInquiry(inquiryData: {
    customerName: string;
    businessName: string;
    phoneNumber: string;
    whatsappNumber: string;
    email: string;
    softwareInterestedIn: string;
    businessType: string;
    message: string;
  }): Promise<{ success: boolean; message: string; inquiry?: Inquiry }> {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return data;
      }
      return { success: false, message: data.error || 'Failed to submit inquiry' };
    } catch {
      // Fallback save to localStorage
      const inqs = getLocal<Inquiry[]>(INQUIRIES_KEY, []);
      const newInq: Inquiry = {
        ...inquiryData,
        id: `inq-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'new'
      };
      inqs.unshift(newInq);
      setLocal(INQUIRIES_KEY, inqs);
      return {
        success: true,
        message: 'Your inquiry has been submitted successfully! Our team will contact you shortly.',
        inquiry: newInq
      };
    }
  },

  async getInquiries(): Promise<Inquiry[]> {
    const token = this.getAdminToken();
    try {
      const res = await fetch('/api/inquiries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLocal(INQUIRIES_KEY, data);
        return data;
      }
    } catch {
      // Fallback
    }
    return getLocal<Inquiry[]>(INQUIRIES_KEY, []);
  },

  async updateInquiryStatus(id: string, status: Inquiry['status'], notes?: string): Promise<boolean> {
    const token = this.getAdminToken();
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, ...(notes !== undefined ? { notes } : {}) })
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }
    const inqs = getLocal<Inquiry[]>(INQUIRIES_KEY, []);
    const idx = inqs.findIndex(i => i.id === id);
    if (idx !== -1) {
      inqs[idx].status = status;
      if (notes !== undefined) inqs[idx].notes = notes;
      setLocal(INQUIRIES_KEY, inqs);
      return true;
    }
    return false;
  },

  async deleteInquiry(id: string): Promise<boolean> {
    const token = this.getAdminToken();
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }
    const inqs = getLocal<Inquiry[]>(INQUIRIES_KEY, []);
    setLocal(INQUIRIES_KEY, inqs.filter(i => i.id !== id));
    return true;
  }
};
