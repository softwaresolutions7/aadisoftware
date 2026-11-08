import React, { useState, useEffect } from 'react';
import { CompanySettings, PricingPackage, SoftwareProduct } from './types';
import { initialCompanySettings, initialPricingPackages, initialProducts } from './data/initialData';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductSection } from './components/ProductSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { AboutSection } from './components/AboutSection';
import { PortfolioSection } from './components/PortfolioSection';
import { PricingSection } from './components/PricingSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ProductDetailModal } from './components/ProductDetailModal';
import { QuoteModal } from './components/QuoteModal';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [settings, setSettings] = useState<CompanySettings>(initialCompanySettings);
  const [products, setProducts] = useState<SoftwareProduct[]>(initialProducts);
  const [packages, setPackages] = useState<PricingPackage[]>(initialPricingPackages);

  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<SoftwareProduct | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quotePrefill, setQuotePrefill] = useState<string>('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Load all data on mount
  const loadData = async () => {
    try {
      const [fetchedSettings, fetchedProducts, fetchedPackages] = await Promise.all([
        api.getSettings(),
        api.getProducts(),
        api.getPackages(),
      ]);
      setSettings(fetchedSettings);
      setProducts(fetchedProducts);
      setPackages(fetchedPackages);

      const token = api.getAdminToken();
      setIsAdminLoggedIn(!!token);
    } catch (e) {
      console.warn('Using local fallback data:', e);
    }
  };

  useEffect(() => {
    loadData();

    // 1. Secret Keyboard Shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };

    // 2. Secret URL Trigger: #admin or ?admin
    const checkUrlTrigger = () => {
      if (
        window.location.hash.toLowerCase().includes('admin') ||
        window.location.search.toLowerCase().includes('admin')
      ) {
        setIsAdminOpen(true);
      }
    };

    checkUrlTrigger();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', checkUrlTrigger);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkUrlTrigger);
    };
  }, []);

  // Smooth scroll handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const elem = document.getElementById(sectionId);
    if (elem) {
      const navHeight = 80;
      const elementPosition = elem.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navHeight,
        behavior: 'smooth',
      });
    }
  };

  // Open quote modal with prefilled software
  const handleOpenQuote = (softwareName?: string) => {
    setQuotePrefill(softwareName || '');
    setIsQuoteOpen(true);
  };

  // Portfolio product selection handler
  const handleSelectPortfolioProduct = (slug: string) => {
    const found = products.find((p) => p.slug === slug);
    if (found) {
      setSelectedProduct(found);
    } else {
      handleNavigate('software');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans selection:bg-[#D4AF37]/30 selection:text-white flex flex-col">
      {/* Sticky Top Navigation */}
      <Navbar
        settings={settings}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenQuoteModal={handleOpenQuote}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          settings={settings}
          onExplore={() => handleNavigate('software')}
          onContactSales={() => handleNavigate('contact')}
        />

        {/* 2. Software Products Section with individual product cards */}
        <ProductSection
          products={products}
          settings={settings}
          onViewDetails={(prod) => setSelectedProduct(prod)}
          onGetPrice={(prod) => handleOpenQuote(prod.name)}
        />

        {/* 3. Why Choose AADI? */}
        <WhyChooseUs />

        {/* 4. About Us Section */}
        <AboutSection
          settings={settings}
          onExploreSoftware={() => handleNavigate('software')}
        />

        {/* 5. System Deployments & Portfolio */}
        <PortfolioSection
          settings={settings}
          onSelectProduct={handleSelectPortfolioProduct}
        />

        {/* 6. Pricing Packages Section */}
        <PricingSection
          packages={packages}
          settings={settings}
          onRequestQuote={(pkgName) => handleOpenQuote(pkgName)}
        />

        {/* 7. Contact Us & Customer Inquiry Form */}
        <ContactSection
          settings={settings}
          products={products}
          prefilledSoftware={quotePrefill}
          onInquirySubmitted={() => {
            // Optional feedback trigger
          }}
        />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Persistent Floating WhatsApp Action Button */}
      <FloatingWhatsApp settings={settings} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        settings={settings}
        onClose={() => setSelectedProduct(null)}
        onOpenQuote={handleOpenQuote}
      />

      {/* Quote Request Modal */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        products={products}
        settings={settings}
        preselectedProduct={quotePrefill}
      />

      {/* Admin Dashboard Drawer / Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          setIsAdminLoggedIn(!!api.getAdminToken());
        }}
        settings={settings}
        products={products}
        packages={packages}
        onRefreshData={loadData}
      />
    </div>
  );
}
