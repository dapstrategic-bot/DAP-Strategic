import { SITE_URL } from '@/lib/site-identity';
import React from 'react';
import { BRAND_ID, COMPANY_ID, DONGFUNDA_CHANNELS, DONGFUNDA_DESCRIPTION, isDongFundaChannel, serializeJsonLd } from '@/lib/site-identity';
import { sanityClient } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';
import type { SiteSettings } from '@/types';

// ──────────────────────────────────────────────
// JSON-LD Structured Data
// ช่วยให้ Google เข้าใจธุรกิจ → อาจได้ rich snippets
// ──────────────────────────────────────────────



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
    '@id': COMPANY_ID,
    brand: { '@id': BRAND_ID },
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
      .filter((url) => Boolean(url) && !isDongFundaChannel(url)) || [],
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
      dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        '@context': 'https://schema.org',
        '@graph': [
          organizationData,
          { '@type': 'Brand', '@id': BRAND_ID, name: 'DongFunda', url: SITE_URL + '/dongfunda', description: DONGFUNDA_DESCRIPTION, sameAs: DONGFUNDA_CHANNELS.map(channel => channel.url) },
          { '@type': 'WebSite', '@id': SITE_URL + '/#website', name: 'DAP Strategic', url: SITE_URL, publisher: { '@id': COMPANY_ID }, inLanguage: 'th-TH' },
        ],
      }) }}
    />
  );
}
