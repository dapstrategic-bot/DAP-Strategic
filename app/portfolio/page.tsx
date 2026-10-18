import React from 'react';
import ContactBar from '@/components/layout/ContactBar';
import type { Metadata } from 'next';
import PageHeader from '@/components/shared/PageHeader';
import ProjectCard from '@/components/portfolio/ProjectCard';
import PortfolioCTA from '@/components/portfolio/PortfolioCTA';
import { projects } from '@/data/portfolio';
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
      <PageHeader
        badge="Our Track Record"
        title="ผลงานและความสำเร็จ"
        description="เราภูมิใจที่ได้เป็นส่วนหนึ่งในความสำเร็จของลูกค้า นี่คือส่วนหนึ่งของโครงการที่เราได้เข้าไปช่วยวิเคราะห์ วางกลยุทธ์ และผลักดันจนเกิดผลลัพธ์ที่จับต้องได้จริง"
      />

      {/* Portfolio Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <PortfolioCTA />
    </div>
  );
}
