import { SITE_URL } from '@/lib/site-identity';
import ContactBar from '@/components/layout/ContactBar';
import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronLeft, LayoutGrid } from 'lucide-react';
import { sanityClient } from '@/lib/sanity';
import { productBySlugQuery, productSlugsQuery, siteSettingsQuery } from '@/lib/queries';
import type {
  SanityProduct,
  ProductHeroSection,
  ProductSolutionSection,
  ProductBenefitSection,
  ProductStorySection,
  ProductSocialProofSection,
} from '@/types';
import { generatePageMetadata } from '@/lib/seo';
import DetailHeroSection from '@/components/products/detail/DetailHeroSection';
import DetailSolutionSection from '@/components/products/detail/DetailSolutionSection';
import DetailBenefitSection from '@/components/products/detail/DetailBenefitSection';
import DetailStorySection from '@/components/products/detail/DetailStorySection';
import DetailSocialProofSection from '@/components/products/detail/DetailSocialProofSection';
import ProductDetailInfo from '@/components/products/detail/ProductDetailInfo';
import MobileStickyBar from '@/components/products/detail/MobileStickyBar';

export const revalidate = 30;

// ── Static Params for SSG ──
export async function generateStaticParams() {
  try {
    const slugs = await sanityClient.fetch<Array<{ slug: string }>>(productSlugsQuery);
    return slugs.filter((s) => s.slug).map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

// ── SEO metadata ──
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let product: SanityProduct | null = null;
  try {
    product = await sanityClient.fetch<SanityProduct>(productBySlugQuery, { slug });
  } catch {
    // fallback
  }

  if (!product) {
    return generatePageMetadata({
      title: 'ไม่พบสินค้า | DAP Strategic Consulting',
      path: `/products/${slug}`,
      noIndex: true,
    });
  }

  return generatePageMetadata({
    title: product.seo?.title || `${product.title} | DAP Strategic Consulting`,
    description:
      product.seo?.description ||
      product.subtitle ||
      product.description?.slice(0, 160),
    ogImage: product.imageUrl,
    path: `/products/${slug}`,
  });
}

// ── Page ──
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: SanityProduct | null = null;
  let siteSettings: any = null;
  try {
    product = await sanityClient.fetch<SanityProduct>(productBySlugQuery, { slug });
    siteSettings = await sanityClient.fetch(siteSettingsQuery);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }

  if (!product) notFound();

  const solutionSections = (
    product.sections?.filter((s) => s._type === 'solutionSection') || []
  ) as ProductSolutionSection[];
  const benefitSections = (
    product.sections?.filter((s) => s._type === 'benefitSection') || []
  ) as ProductBenefitSection[];
  const storySections = (
    product.sections?.filter((s) => s._type === 'storySection') || []
  ) as ProductStorySection[];
  const socialProofSections = (
    product.sections?.filter((s) => s._type === 'socialProofSection') || []
  ) as ProductSocialProofSection[];

  const primaryHero = product.hero || null;


  // JSON-LD for Product
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.seo?.description || product.subtitle || product.description,
    image: product.imageUrl,
    offers: {
      '@type': 'Offer',
      price: product.salePrice || product.originalPrice || 0,
      priceCurrency: 'THB',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/products/${slug}`
    }
  };

  // JSON-LD for FAQs
  const faqJsonLd = product.faqs && product.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: product.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  } : null;

  return (
    // พื้นหลังหลักเป็น white ตลอด — แต่ละ section จัดการ bg เองตาม rhythm
    <div className="bg-white">
      <ContactBar mobilePurchaseBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* ── Breadcrumb strip (ต่อจาก Header ซึ่งเป็น dark) ── */}
      <div className="bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pt-6">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 py-3 text-sm text-white/40 hover:text-white/90 transition-colors duration-200"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full border border-white/15 group-hover:border-white/40 transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" />
            </span>
            <LayoutGrid className="w-3.5 h-3.5 text-blue-400/70 group-hover:text-blue-300 transition-colors" />
            <span className="tracking-wide">All Products</span>
          </Link>
        </div>
      </div>

      {/* 1. Hero — dark gradient (ต่อจาก breadcrumb strip เดียวกัน) */}
      {primaryHero ? (
        <DetailHeroSection
          section={primaryHero}
          productTitle={product.title}
          productImageUrl={product.imageUrl}
          categoryTitle={product.category?.title}
          lineUrl={siteSettings?.contact?.lineUrl}
        />
      ) : (
        /* Fallback hero */
        <section className="relative pb-16 bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pt-10 text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-[1.15]">
              {product.title}
            </h1>
            {product.subtitle && (
              <p className="text-lg md:text-xl text-blue-200/80 max-w-2xl mx-auto">
                {product.subtitle}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── Solution Sections ── */}
      {solutionSections.map((section, idx) => (
        <DetailSolutionSection key={`solution-${idx}`} section={section} />
      ))}

      {/* ── Benefit Sections ── */}
      {benefitSections.map((section, idx) => (
        <DetailBenefitSection key={`benefit-${idx}`} section={section} />
      ))}

      {/* 2. Story Sections — สีขาว */}
      {storySections.map((section, idx) => (
        <DetailStorySection key={`story-${idx}`} section={section} />
      ))}

      {/* 3. Social Proof — สีเทาอ่อน สลับกับขาว */}
      {socialProofSections.map((section, idx) => (
        <DetailSocialProofSection key={`social-${idx}`} section={section} />
      ))}

      {/* 4. Product Detail Info + Pricing Card */}
      <ProductDetailInfo product={product} />

      {/* 5. Mobile sticky bar */}
      <MobileStickyBar product={product} />

      {/* Spacer มือถือ */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
