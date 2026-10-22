import React from 'react';
import Link from 'next/link';
import { ArrowRight, Briefcase, LineChart, Laptop, ChevronRight } from 'lucide-react';
import { slugify } from '@/lib/utils';
import type { SanityService } from '@/types';

// Fallback hardcoded สำหรับกรณีที่ยังไม่มีข้อมูลใน Sanity
const fallbackServices = [
  {
    title: "Strategic Planner / Business Strategy",
    slug: 'strategic-planner-business-strategy',
    desc: "วางแผนกลยุทธ์องค์กร หาจุดแข็ง สร้างความได้เปรียบทางการแข่งขัน และวางระบบเพื่อขยายธุรกิจอย่างมั่นคง",
    icon: Briefcase,
  },
  {
    title: "Feasibility Study",
    slug: 'feasibility-study',
    desc: "ประเมินความเป็นไปได้รอบด้าน ทั้งการตลาด การเงิน และการดำเนินงาน พร้อมสร้าง Financial Model",
    icon: LineChart,
  },
  {
    title: "Business Plan",
    slug: 'business-plan',
    desc: "จัดทำแผนธุรกิจฉบับสมบูรณ์พร้อม Pitch Deck สำหรับนำเสนอนักลงทุนและขอสินเชื่อธนาคาร",
    icon: Laptop,
  },
];

// Icon map ตาม title เพื่อให้แต่ละบริการมี icon ที่เหมาะสม
const iconMap: Record<string, React.ElementType> = {
  'Strategic Planner / Business Strategy': Briefcase,
  'Feasibility Study': LineChart,
  'Business Plan': Laptop,
};

interface ServicesOverviewProps {
  services?: SanityService[];
}

export default function ServicesOverview({ services }: ServicesOverviewProps) {
  const hasSanityData = services && services.length > 0;

  return (
    <section id="services" className="py-24 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">บริการหลักของเรา</h2>
            <p className="text-gray-400 text-lg">โซลูชันครบวงจรเพื่อยกระดับธุรกิจ SME สู่มาตรฐานองค์กรชั้นนำ</p>
          </div>
          <Link href="/services" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium group">
            ดูบริการทั้งหมด
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {hasSanityData
            ? services.map((service) => {
                const Icon = iconMap[service.title] ?? Briefcase;
                return (
                  <div
                    key={service._id}
                    className="p-8 rounded-2xl bg-gray-800 border border-gray-700 hover:border-blue-500/50 transition-colors"
                  >
                    <Icon className="w-10 h-10 text-blue-400 mb-6" />
                    <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                    <p className="text-gray-400 leading-relaxed mb-8">
                      {service.description ?? service.subtitle ?? ''}
                    </p>
                    <Link
                      href={service.slug?.current ? `/services/${service.slug.current}` : `/services#${slugify(service.title)}`}
                      aria-label={`รายละเอียดเพิ่มเติม: ${service.title}`}
                      className="inline-flex items-center text-sm font-medium text-white hover:text-blue-400 transition-colors"
                    >
                      รายละเอียดเพิ่มเติม <ChevronRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                );
              })
            : fallbackServices.map((service, i) => (
                <div
                  key={i}
                  className="p-8 rounded-2xl bg-gray-800 border border-gray-700 hover:border-blue-500/50 transition-colors"
                >
                  <service.icon className="w-10 h-10 text-blue-400 mb-6" />
                  <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-8">{service.desc}</p>
                  <Link
                    href={`/services/${service.slug}`}
                    aria-label={`รายละเอียดเพิ่มเติม: ${service.title}`}
                    className="inline-flex items-center text-sm font-medium text-white hover:text-blue-400 transition-colors"
                  >
                    รายละเอียดเพิ่มเติม <ChevronRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
