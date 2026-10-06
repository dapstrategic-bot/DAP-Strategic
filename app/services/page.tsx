import React from 'react';
import type { Metadata } from 'next';
import PageHeader from '@/components/shared/PageHeader';
import ServiceCard from '@/components/services/ServiceCard';
import ServicesCTA from '@/components/services/ServicesCTA';
import CustomerReviews from '@/components/services/CustomerReviews';
import { sanityClient } from '@/lib/sanity';
import { servicesQuery, servicesPageQuery, siteSettingsQuery } from '@/lib/queries';
import { services as fallbackServices } from '@/data/services';
import { slugify } from '@/lib/utils';
import { generatePageMetadata } from '@/lib/seo';
import type { SanityService, ServicesPageContent, SiteSettings } from '@/types';

export const revalidate = 30;

// ── SEO: Dynamic metadata from Sanity ──
export async function generateMetadata(): Promise<Metadata> {
  let pageData: ServicesPageContent | null = null;
  try {
    pageData = await sanityClient.fetch<ServicesPageContent>(servicesPageQuery);
  } catch {
    // fallback to defaults
  }

  return generatePageMetadata({
    title: pageData?.seo?.title || 'บริการที่ปรึกษาธุรกิจ | DAP Strategic Consulting',
    description:
      pageData?.seo?.description ||
      'บริการที่ปรึกษาด้านกลยุทธ์ธุรกิจ การวิเคราะห์ข้อมูล และการวางแผนเชิงกลยุทธ์เพื่อผลักดันธุรกิจให้เติบโต',
    path: '/services',
  });
}

export default async function ServicesPage() {
  // ดึงข้อมูลจาก Sanity
  let sanityServices: SanityService[] = [];
  let pageData: ServicesPageContent | null = null;
  let siteSettings: SiteSettings | null = null;
  try {
    const [fetchedServices, fetchedPageData, fetchedSiteSettings] = await Promise.all([
      sanityClient.fetch(servicesQuery),
      sanityClient.fetch(servicesPageQuery),
      sanityClient.fetch(siteSettingsQuery),
    ]);
    sanityServices = fetchedServices;
    pageData = fetchedPageData;
    siteSettings = fetchedSiteSettings;
  } catch (error) {
    console.error('Failed to fetch data from Sanity:', error);
  }

  // ถ้า Sanity มีข้อมูล → ใช้ Sanity, ถ้าไม่มี → fallback hardcoded
  const hasSanityData = sanityServices && sanityServices.length > 0;

  return (
    <div className="bg-gray-50">
      <PageHeader
        badge={pageData?.hero?.badge || "Our Services"}
        title={pageData?.hero?.heading || "บริการที่ปรึกษาธุรกิจ"}
        description={pageData?.hero?.description || "เราช่วยแก้ปัญหาธุรกิจที่ซับซ้อนด้วยกลยุทธ์ที่เรียบง่ายและวัดผลได้จริง เพื่อให้คุณก้าวข้ามขีดจำกัดและเติบโตได้อย่างมั่นคง"}
      />

      {/* Services List */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="space-y-16">
            {hasSanityData
              ? sanityServices.map((service) => (
                  <ServiceCard
                    key={service._id}
                    lineUrl={siteSettings?.contact?.lineUrl}
                    service={{
                      id: slugify(service.title),
                      slug: service.slug ? service.slug.current : '',
                      title: service.title,
                      subtitle: service.subtitle ?? '',
                      problem: service.problem ?? '',
                      solution: service.solution ?? '',
                      deliverables: service.deliverables ?? [],
                    }}
                  />
                ))
              : fallbackServices.map((service) => (
                  <ServiceCard key={service.id} service={service} lineUrl={siteSettings?.contact?.lineUrl} />
                ))}
          </div>
        </div>
      </section>

      <CustomerReviews />
      <ServicesCTA data={pageData} />
    </div>
  );
}
