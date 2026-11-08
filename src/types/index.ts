export interface SoftwareProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  iconName: string;
  image: string;
  isPublished: boolean;
  order: number;
  features: string[];
  benefits: string[];
  systemRequirements: {
    os: string;
    processor: string;
    ram: string;
    storage: string;
    extras?: string;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
  pricingNote: string;
  whatsappPrefill: string;
}

export interface Inquiry {
  id: string;
  customerName: string;
  businessName: string;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  softwareInterestedIn: string;
  businessType: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'in_progress' | 'closed';
  notes?: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  targetBusiness: string;
  priceNote: string;
  popular?: boolean;
  features: string[];
  buttonText: string;
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  secondarySlogan: string;
  phoneNumber: string;
  phoneDialer: string; // e.g. tel:+923000000000
  whatsappNumber: string; // e.g. 923000000000
  email: string;
  officeAddress: string;
  businessHours: string;
  supportHours: string;
}
