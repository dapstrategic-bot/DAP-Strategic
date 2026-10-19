import React from 'react';
import ContactBar from '@/components/layout/ContactBar';
import type { Metadata } from 'next';
import SelectedPortfolio from '@/components/portfolio/SelectedPortfolio';
import PortfolioCTA from '@/components/portfolio/PortfolioCTA';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site-identity';

// ── SEO: Static metadata (Portfolio ยังไม่มี Sanity schema) ──
export const metadata: Metadata = generatePageMetadata({
  title: 'ผลงานและความสำเร็จ | DAP Strategic Consulting',
  description:
    'ดูผลงานโครงการที่ปรึกษาธุรกิจที่ DAP Strategic ช่วยวิเคราะห์ วางกลยุทธ์ และผลักดันจนเกิดผลลัพธ์ที่จับต้องได้จริง',
  path: '/portfolio',
  ogImage: `${SITE_URL}/images/dap-symbol-share-v2.jpg`,
});

export default function PortfolioPage() {
  return (
    <div className="bg-gray-50">
      <ContactBar />
      <SelectedPortfolio />

      <PortfolioCTA />
    </div>
  );
}
