import React, { useState } from 'react';
import { SoftwareProduct, CompanySettings } from '../types';
import { ProductCard } from './ProductCard';
import { Sparkles, Layers, SlidersHorizontal } from 'lucide-react';

interface ProductSectionProps {
  products: SoftwareProduct[];
  settings: CompanySettings;
  onViewDetails: (product: SoftwareProduct) => void;
  onGetPrice: (product: SoftwareProduct) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  products,
  settings,
  onViewDetails,
  onGetPrice,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Distinct filter options
  const categories = ['All', 'Hospitality & Dining', 'Retail & Supermarkets', 'Enterprise & Multi-Branch', 'Warehouse & Logistics', 'Finance & Taxation', 'Healthcare & Retail', 'Bespoke Development'];

  const filteredProducts = products
    .filter((p) => p.isPublished)
    .filter((p) => (selectedCategory === 'All' ? true : p.category === selectedCategory))
    .sort((a, b) => a.order - b.order);

  return (
    <section id="software" className="py-20 lg:py-28 bg-[#0B0F19] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#D4AF37]">
            <Layers className="w-3.5 h-3.5" />
            <span>Mission-Critical Software</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance">
            Our Software Products
          </h2>
          
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Scalable, intuitive, and battle-tested automation platforms built to streamline point-of-sale, inventory control, and enterprise operations for Pakistani businesses.
          </p>
        </div>

        {/* Category Filter Tabs (Functional segmented controls) */}
        <div className="mt-10 flex items-center justify-center">
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-[#0F1626] rounded-xl border border-slate-800 max-w-full overflow-x-auto">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#F6EFD3] to-[#D4AF37] text-[#0B0F19] shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {cat === 'All' ? 'All Software' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              settings={settings}
              onViewDetails={onViewDetails}
              onGetPrice={onGetPrice}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="mt-12 text-center py-12 rounded-xl bg-slate-900/50 border border-slate-800">
            <p className="text-slate-400 text-sm">No software products found in this category.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-3 text-xs text-[#D4AF37] underline underline-offset-4"
            >
              Reset to view all products
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
