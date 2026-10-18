import { SITE_URL } from '@/lib/site-identity';
import React from 'react';
import ContactBar from '@/components/layout/ContactBar';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronLeft, LayoutGrid } from 'lucide-react';
import { sanityClient } from '@/lib/sanity';
import { serviceBySlugQuery, serviceSlugsQuery, siteSettingsQuery } from '@/lib/queries';
import type {
  SanityService,
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
import ServiceDetailInfo from '@/components/services/detail/ServiceDetailInfo';

export const revalidate = 30;

// ── Static Params for SSG ──
export async function generateStaticParams() {
  try {
    const slugs = await sanityClient.fetch<Array<{ slug: string }>>(serviceSlugsQuery);
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
  let service: SanityService | null = null;
  try {
    service = await sanityClient.fetch<SanityService>(serviceBySlugQuery, { slug });
  } catch {
    // fallback
  }

  if (!service) {
    return generatePageMetadata({
      title: 'ไม่พบบริการ | DAP Strategic Consulting',
      path: `/services/${slug}`,
      noIndex: true,
    });
  }

  return generatePageMetadata({
    title: service.seo?.title || `${service.title} | DAP Strategic Consulting`,
    description:
      service.seo?.description ||
      service.subtitle ||
      '',
    path: `/services/${slug}`,
    ogImage: ['business-plan', 'feasibility-study', 'strategic-planner-business-strategy'].includes(slug)
      ? `${SITE_URL}/images/dap-symbol-share-v2.jpg`
      : undefined,
  });
}

// ── Page ──
export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let service: SanityService | null = null;
  let siteSettings: any = null;
  try {
    service = await sanityClient.fetch<SanityService>(serviceBySlugQuery, { slug });
    siteSettings = await sanityClient.fetch(siteSettingsQuery);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }

  if (!service) notFound();

  const solutionSections = (
    service.sections?.filter((s) => s._type === 'solutionSection') || []
  ) as ProductSolutionSection[];
  const benefitSections = (
    service.sections?.filter((s) => s._type === 'benefitSection') || []
  ) as ProductBenefitSection[];
  const storySections = (
    service.sections?.filter((s) => s._type === 'storySection') || []
  ) as ProductStorySection[];
  const socialProofSections = (
    service.sections?.filter((s) => s._type === 'socialProofSection') || []
  ) as ProductSocialProofSection[];

  const primaryHero = service.hero || null;


  // JSON-LD for Service
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.seo?.description || service.subtitle || service.description,
    provider: {
      '@type': 'Organization',
      name: 'DAP Strategic Consulting'
    },
    url: `${SITE_URL}/services/${slug}`,
  };

  // JSON-LD for FAQs
  const faqJsonLd = service.faqs && service.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  } : null;

  return (
    <div className="bg-white">
      <ContactBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* ── Breadcrumb strip ── */}
      <div className="bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pt-6">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 py-3 text-sm text-white/40 hover:text-white/90 transition-colors duration-200"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full border border-white/15 group-hover:border-white/40 transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" />
            </span>
            <LayoutGrid className="w-3.5 h-3.5 text-blue-400/70 group-hover:text-blue-300 transition-colors" />
            <span className="tracking-wide">All Services</span>
          </Link>
        </div>
      </div>

      {/* 1. Hero */}
      {primaryHero ? (
        <DetailHeroSection
          section={primaryHero}
          productTitle={service.title}
          categoryTitle={service.category?.title || 'บริการ'}
          lineUrl={siteSettings?.contact?.lineUrl}
          lineText="ทัก Line เพื่อสอบถามบริการ"
        />
      ) : (
        <section className="relative pb-16 bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pt-10 text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-[1.15]">
              {service.title}
            </h1>
            {service.subtitle && (
              <p className="text-lg md:text-xl text-blue-200/80 max-w-2xl mx-auto">
                {service.subtitle}
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

      {/* 2. Story Sections */}
      {storySections.map((section, idx) => (
        <DetailStorySection key={`story-${idx}`} section={section} />
      ))}

      {/* 3. Social Proof */}
      {socialProofSections.map((section, idx) => (
        <DetailSocialProofSection key={`social-${idx}`} section={section} />
      ))}

      {/* 4. Service Detail Info */}
      <ServiceDetailInfo service={service} lineUrl={siteSettings?.contact?.lineUrl} />

      {/* Spacer มือถือ */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
