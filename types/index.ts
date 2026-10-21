import { type LucideIcon } from 'lucide-react';

/* ── Service Types ── */
export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  problem: string;
  solution: string;
  deliverables: string[];
  slug?: string;
}

/* ── Sanity Service Type ── */
export interface SanityService {
  _id: string;
  title: string;
  subtitle?: string;
  problem?: string;
  solution?: string;
  deliverables?: string[];
  order?: number;
  slug?: { current: string };
  category?: { title: string; slug?: { current: string } };
  hero?: ProductHeroSection;
  sections?: ProductSection[];
  description?: string;
  suitableFor?: string[];
  faqs?: { question: string; answer: string }[];
  isActive?: boolean;
  seo?: {
    title?: string;
    description?: string;
  };
}

/* ── Portfolio Types ── */
export interface PortfolioProject {
  id: number;
  title: string;
  category: string;
  description: string;
  result: string;
  image: string;
  icon: LucideIcon;
}

/* ── Sanity Portfolio Type ── */
export interface SanityPortfolio {
  _id: string;
  title: string;
  description: string;
  result: string;
  category?: string;   // มาจาก service->title
  imageUrl?: string;    // มาจาก image.asset->url
  order?: number;
}

/* ── Navigation Types ── */
export interface NavItem {
  href: string;
  label: string;
}

/* ── Sanity CMS Types ── */
export interface SiteSettings {
  companyName: string;
  logo?: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  logoUrl?: string;
  contact?: {
    email?: string;
    phone?: string;
    lineUrl?: string;
    address?: string;
  };
  socialLinks?: Array<{
    platform: 'facebook' | 'tiktok' | 'youtube';
    url: string;
  }>;
  footerTagline?: string;
  seo?: {
    title?: string;
    description?: string;
  };
}

/* ── Home Page Types (Sanity) ── */
export interface HomePage {
  hero?: {
    badge?: string[];
    heading?: string;
    highlight?: string;
    description?: string;
  };
  valueProps?: Array<{
    title: string;
    description: string;
  }>;
  stats?: Array<{
    value: string;
    label: string;
    subLabel?: string;
  }>;
  cta?: {
    heading?: string;
    description?: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
}

/* ── Product Section Types ── */
export interface ProductHeroSection {
  _type: 'heroSection';
  badge?: string;
  heading?: string;
  highlight?: string;
  subheading?: string;
  painPoints?: Array<{ text: string }>;
  videoPreview?: string;
  thumbnailUrl?: string;
}

export interface ProductSolutionSection {
  _type: 'solutionSection';
  heading?: string;
  description?: string;
}

export interface ProductBenefitSection {
  _type: 'benefitSection';
  benefits?: Array<{ title: string; description: string }>;
}

export interface ProductStorySection {
  _type: 'storySection';
  heading?: string;
  content?: SanityBlock[];
  imageUrl?: string;
}

export interface ProductSocialProofSection {
  _type: 'socialProofSection';
  title?: string;
  description?: string;
  socialImages?: Array<{ url: string }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SanityBlock = any;

export type ProductSection =
  | ProductHeroSection
  | ProductSolutionSection
  | ProductBenefitSection
  | ProductStorySection
  | ProductSocialProofSection;

/* ── Payment Settings Types ── */
export interface PaymentStep {
  description?: string;
  imageUrl?: string;
}

export interface PaymentSettings {
  _id: string;
  heading?: string;
  steps: PaymentStep[];
}

export interface PaymentOptions {
  purchase?: PaymentSettings;
  booking?: PaymentSettings;
}

/* ── Sanity Product Type ── */
export interface SanityProduct {
  _id: string;
  title: string;
  slug?: { current: string };
  category?: { _id?: string; title: string; slug?: { current: string } };
  hero?: ProductHeroSection;
  sections?: ProductSection[];
  subtitle?: string;
  description?: string;
  features?: string[];
  suitableFor?: string[];
  faqs?: { question: string; answer: string }[];
  originalPrice?: number;
  salePrice: number;
  bookingPrice?: number;
  badge?: 'bestseller' | 'recommended' | 'new' | 'none';
  imageUrl?: string;
  ctaLink?: string;
  bookingLink?: string;
  paymentOptions?: PaymentOptions;
  order?: number;
  isActive?: boolean;
  seo?: {
    title?: string;
    description?: string;
  };
}

/* ── Products Page Type (Sanity) ── */
export interface ProductsPageContent {
  hero?: {
    badge?: string;
    heading?: string;
    highlight?: string;
    painPoints?: Array<{ text: string }>;
  };
  solution?: {
    heading?: string;
    description?: string;
  };
  benefitsSection?: {
    benefits?: Array<{ title: string; description: string }>;
  };
  productsSection?: {
    heading?: string;
    subheading?: string;
  };
  cta?: {
    heading?: string;
    description?: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
}

/* ── Services Page Type (Sanity) ── */
export interface ServicesPageContent {
  hero?: {
    badge?: string;
    heading?: string;
    description?: string;
  };
  cta?: {
    heading?: string;
    description?: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
}

/* ── About Page Type (Sanity) ── */
export interface AboutPageContent {
  story?: {
    badge?: string;
    heading?: string;
    description?: string;
    visionTitle?: string;
    visionDescription?: string;
    imageUrl?: string;
    stats?: Array<{ value: string; label: string }>;
  };
  philosophy?: {
    heading?: string;
    items?: Array<{ title: string; description: string }>;
  };
  contact?: {
    heading?: string;
    subheading?: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
}
