import React from 'react';
import ContactBar from '@/components/layout/ContactBar';
import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import ValueProposition from '@/components/home/ValueProposition';
import ServicesOverview from '@/components/home/ServicesOverview';
import PortfolioSection from '@/components/home/PortfolioSection';
import PortfolioHighlight from '@/components/home/PortfolioHighlight';
import HomeCTA from '@/components/home/HomeCTA';
import { sanityClient } from '@/lib/sanity';
import { homePageQuery, servicesQuery, portfolioQuery } from '@/lib/queries';
import { generatePageMetadata } from '@/lib/seo';
import type { HomePage, SanityService, SanityPortfolio } from '@/types';

export const revalidate = 30;

// ── SEO: Dynamic metadata from Sanity ──
export async function generateMetadata(): Promise<Metadata> {
  let data: HomePage | null = null;
  try {
    data = await sanityClient.fetch<HomePage>(homePageQuery);
  } catch {
    // fallback to defaults
  }

  return generatePageMetadata({
    title: data?.seo?.title || 'DAP Strategic Consulting | ที่ปรึกษาธุรกิจเชิงกลยุทธ์',
    description:
      data?.seo?.description ||
      'ที่ปรึกษาธุรกิจเชิงกลยุทธ์ ช่วยวิเคราะห์ วางแผน และผลักดันธุรกิจให้เติบโตอย่างยั่งยืนด้วยกลยุทธ์ที่วัดผลได้จริง',
    path: '/',
  });
}

export default async function HomePageView() {
  let data: HomePage | null = null;
  let services: SanityService[] = [];
  let portfolios: SanityPortfolio[] = [];

  try {
    [data, services, portfolios] = await Promise.all([
      sanityClient.fetch<HomePage>(homePageQuery),
      sanityClient.fetch<SanityService[]>(servicesQuery),
      sanityClient.fetch<SanityPortfolio[]>(portfolioQuery),
    ]);
  } catch (error) {
    console.error('Failed to fetch home page data:', error);
  }

  return (
    <>
      <HeroSection hero={data?.hero} />
      <ContactBar />
      <ValueProposition valueProps={data?.valueProps} />
      <ServicesOverview services={services} />
      <PortfolioSection portfolios={portfolios} />
      <PortfolioHighlight stats={data?.stats} />
      <HomeCTA cta={data?.cta} />
    </>
  );
}
