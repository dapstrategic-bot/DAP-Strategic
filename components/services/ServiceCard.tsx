import React from 'react';
import TrackedLink from '@/components/shared/TrackedLink';
import Link from 'next/link';
import { AlertCircle, Lightbulb, Package, Tag, ArrowRight, CheckCircle2, MessageCircle, Play } from 'lucide-react';
import { slugify } from '@/lib/utils';
import type { ServiceItem } from '@/types';

interface ServiceCardProps {
  service: ServiceItem;
  lineUrl?: string;
  showFeasibilityOffer?: boolean;
}

export default function ServiceCard({ service, lineUrl, showFeasibilityOffer = false }: ServiceCardProps) {
  return (
    <div id={slugify(service.title)} className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-shadow duration-300 scroll-mt-24">
      {/* Service Header */}
      <div className="bg-gray-900 text-white p-8 md:p-10">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">{service.title}</h2>
        <p className="text-blue-300 text-lg">{service.subtitle}</p>
        {showFeasibilityOffer && (
          <div>
            <p className="flex flex-wrap items-baseline gap-2.5 mt-6 mb-5 tracking-normal">
              <span className="text-xl font-medium text-gray-200">เริ่มต้น</span>{' '}
              <strong className="text-[52px] leading-[1.15] font-extrabold text-[#fcd34d]">3,000</strong>{' '}
              <span className="text-2xl font-bold text-[#fcd34d]">บาท</span>
            </p>
            <TrackedLink section="service_video" eventType="youtube" preserveMeta={false} href="https://youtu.be/5DDV_efPKmM" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 min-h-14 px-6 py-3.5 border border-[#ef4444] rounded-lg bg-[#dc2626] text-white text-lg font-bold tracking-normal max-[480px]:w-full hover:bg-[#b91c1c] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#fcd34d] focus-visible:outline-offset-4 transition-colors">
              <Play className="w-6 h-6 shrink-0" aria-hidden="true" />
              ดูวิดีโอแนะนำ
            </TrackedLink>
          </div>
        )}
      </div>
      
      <div className="p-8 md:p-10 grid md:grid-cols-2 gap-10">
        {/* Left Column: Problem & Solution */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3 text-red-600 font-medium">
              <AlertCircle className="w-5 h-5" />
              <h3>ปัญหาที่คุณกำลังเจอ (Problem)</h3>
            </div>
            <p className="text-gray-600 leading-relaxed bg-red-50/50 p-5 rounded-2xl border border-red-100">
              {service.problem}
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-3 text-blue-700 font-medium">
              <Lightbulb className="w-5 h-5" />
              <h3>สิ่งที่เราช่วยคุณได้ (Solution)</h3>
            </div>
            <p className="text-gray-600 leading-relaxed bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
              {service.solution}
            </p>
          </div>
        </div>

        {/* Right Column: Deliverables, Pricing & CTA */}
        <div className="space-y-8 flex flex-col">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4 text-gray-900 font-medium">
              <Package className="w-5 h-5 text-gray-500" />
              <h3>สิ่งที่คุณจะได้รับ (Deliverables)</h3>
            </div>
            <ul className="space-y-3">
              {service.deliverables.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-600">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mt-auto">
            <TrackedLink section="service_card" eventType="line" preserveMeta={false}
              href={lineUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center px-6 py-3.5 text-base font-medium text-white bg-[#00B900] rounded-xl hover:bg-[#00a000] transition-colors shadow-sm mb-3"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              สอบถามราคาทาง LINE
            </TrackedLink>
            
            <Link href={service.slug ? `/services/${service.slug}` : `/contact`} className="w-full inline-flex items-center justify-center px-6 py-3.5 text-base font-medium text-white bg-blue-900 rounded-xl hover:bg-blue-800 transition-colors shadow-sm">
              รายละเอียดเพิ่มเติม
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
