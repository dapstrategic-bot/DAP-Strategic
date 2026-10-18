import React from 'react';
import ContactBar from '@/components/layout/ContactBar';
import type { Metadata } from 'next';
import AboutSection from '@/components/contact/AboutSection';
import CorePhilosophy from '@/components/contact/CorePhilosophy';
import ContactInfo from '@/components/contact/ContactInfo';
import LeadForm from '@/components/contact/LeadForm';
import { sanityClient } from '@/lib/sanity';
import { siteSettingsQuery, aboutPageQuery } from '@/lib/queries';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site-identity';
import type { SiteSettings, AboutPageContent } from '@/types';

export const revalidate = 30;

// ── SEO: Dynamic metadata from Sanity ──
export async function generateMetadata(): Promise<Metadata> {
  let pageData: AboutPageContent | null = null;
  try {
    pageData = await sanityClient.fetch<AboutPageContent>(aboutPageQuery);
  } catch {
    // fallback to defaults
  }

  return generatePageMetadata({
    title: pageData?.seo?.title || 'ติดต่อเรา | DAP Strategic Consulting',
    description:
      pageData?.seo?.description ||
      'ปรึกษาธุรกิจเบื้องต้นฟรี ติดต่อทีม DAP Strategic Consulting เพื่อยกระดับธุรกิจของคุณ',
    path: '/contact',
    ogImage: `${SITE_URL}/images/dap-symbol-share-v2.jpg`,
  });
}

export default async function ContactPage() {
  let siteSettings: SiteSettings | null = null;
  let pageData: AboutPageContent | null = null;
  
  try {
    const [fetchedSiteSettings, fetchedPageData] = await Promise.all([
      sanityClient.fetch(siteSettingsQuery),
      sanityClient.fetch(aboutPageQuery)
    ]);
    siteSettings = fetchedSiteSettings;
    pageData = fetchedPageData;
  } catch (error) {
    console.error('Failed to fetch data from Sanity:', error);
  }

  return (
    <div className="bg-gray-50">
      <ContactBar />
      <AboutSection data={pageData} />
      <CorePhilosophy data={pageData} />

      {/* Contact & Lead Form Section */}
      <section className="py-24 bg-white" id="contact-form">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {pageData?.contact?.heading || "เริ่มต้นพูดคุยกับเรา"}
            </h2>
            <p className="text-lg text-gray-600">
              {pageData?.contact?.subheading || "พร้อมที่จะยกระดับธุรกิจของคุณแล้วหรือยัง? ติดต่อเราเพื่อรับคำปรึกษาเบื้องต้นฟรี"}
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <ContactInfo contact={siteSettings?.contact} />
            </div>

            {/* Lead Form */}
            <div className="lg:col-span-3">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
