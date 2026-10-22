'use client';

import React, { useState } from 'react';
import { CheckCircle2, Users, HelpCircle, AlertCircle, Lightbulb, Package, Tag, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import type { SanityService } from '@/types';
import { LinkifyText } from '@/components/shared/LinkifyText';
import { ChevronDown } from 'lucide-react';
import ServicePlanningContent from './ServicePlanningContent';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden mb-3 bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start justify-between p-4 hover:bg-gray-50 transition-colors text-left gap-4"
      >
        <div className="flex gap-3 items-start">
          <div className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-display font-bold text-xs mt-0.5">
            Q
          </div>
          <span className="font-medium text-gray-900 leading-relaxed">{question}</span>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 shrink-0 mt-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <div 
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="p-4 pt-0 flex gap-3 items-start">
            <div className="shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-900 flex items-center justify-center font-display font-bold text-xs mt-0.5">
              A
            </div>
            <div className="text-gray-600 leading-relaxed">
              <LinkifyText text={answer} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ServiceDetailInfoProps {
  service: SanityService;
  lineUrl?: string;
  planningSlug?: string;
}

export default function ServiceDetailInfo({ service, lineUrl, planningSlug }: ServiceDetailInfoProps) {
  return (
    <section className="py-20 bg-white" id="service-info">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="space-y-12">
          {/* Row 1: Description + Problem vs Solution */}
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-12">
              {/* Description */}
              {service.description && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
                    รายละเอียดเพิ่มเติม
                  </h2>
                  <div className="text-gray-600 leading-relaxed space-y-4">
                    <LinkifyText text={service.description} />
                  </div>
                </div>
              )}

              {/* Problem */}
              {service.problem && (
                <div>
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    ปัญหาที่คุณกำลังเจอ (Problem)
                  </h3>
                  <div className="text-gray-600 leading-relaxed space-y-4">
                    <LinkifyText text={service.problem} />
                  </div>
                </div>
              )}
            </div>

            <div>
              {/* Solution */}
              {service.solution && (
                <div>
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-blue-700" />
                    สิ่งที่เราช่วยคุณได้ (Solution)
                  </h3>
                  <div className="text-gray-600 leading-relaxed space-y-4">
                    <LinkifyText text={service.solution} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Suitable For vs Deliverables */}
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              {/* เหมาะสำหรับใคร */}
              {service.suitableFor && service.suitableFor.length > 0 && (
                <div>
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-900" />
                    เหมาะสำหรับใคร
                  </h3>
                  <div className="grid gap-3">
                    {service.suitableFor.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-900 flex-shrink-0" />
                        <LinkifyText text={item} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              {/* Deliverables */}
              {service.deliverables && service.deliverables.length > 0 && (
                <div>
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <Package className="w-5 h-5 text-green-500" />
                    สิ่งที่คุณจะได้รับ (Deliverables)
                  </h3>
                  <ul className="space-y-3">
                    {service.deliverables.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        </div>
                        <span className="text-gray-600">
                          <LinkifyText text={item} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <ServicePlanningContent slug={planningSlug} />

          {/* Row 3: FAQs vs Empty */}
          {(service.faqs && service.faqs.length > 0) && (
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                {/* FAQs */}
                <div>
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-900" />
                    คำถามที่พบบ่อย (Q&A)
                  </h3>
                  <div>
                    {service.faqs.map((faq, i) => (
                      <FAQItem key={i} question={faq.question} answer={faq.answer} />
                    ))}
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          )}
        </div>

        {/* CTA Full Width */}
        <div className="mt-16 flex justify-center">
          <a
            href={lineUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-[#00B900] rounded-2xl hover:bg-[#00a000] transition-colors shadow-lg shadow-[#00B900]/20 active:scale-[0.98]"
          >
            <MessageCircle className="w-6 h-6 mr-2" />
            ทักไลน์เพื่อสอบถามราคา
          </a>
        </div>
      </div>
    </section>
  );
}
