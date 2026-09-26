import React from 'react';
import { sanityClient } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';
import type { SiteSettings } from '@/types';

// ──────────────────────────────────────────────
// JSON-LD Structured Data
// ช่วยให้ Google เข้าใจธุรกิจ → อาจได้ rich snippets
// ──────────────────────────────────────────────

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dapstrategic.com';

export default async function JsonLd() {
  let settings: SiteSettings | null = null;

  try {
    settings = await sanityClient.fetch<SiteSettings>(siteSettingsQuery);
  } catch (error) {
    console.error('Failed to fetch site settings for JSON-LD:', error);
  }

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: settings?.companyName || 'DAP Strategic Consulting',
    description:
      'ที่ปรึกษาธุรกิจเชิงกลยุทธ์ ช่วยวิเคราะห์ วางแผน และผลักดันธุรกิจให้เติบโตอย่างยั่งยืน',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.jpg`,
    ...(settings?.contact?.email && { email: settings.contact.email }),
    ...(settings?.contact?.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.contact.address,
        addressCountry: 'TH',
      },
    }),
    sameAs: settings?.socialLinks
      ?.map((link) => link.url)
      .filter(Boolean) || [],
    serviceType: [
      'Business Consulting',
      'Strategic Planning',
      'Investment Advisory',
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Thailand',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
    />
  );
}
