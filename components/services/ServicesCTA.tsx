import React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import type { ServicesPageContent, SiteSettings } from '@/types';
import { sanityClient } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';
import TrackedLink from '@/components/shared/TrackedLink';

interface ServicesCTAProps {
  locale?: 'th' | 'en';
  data?: ServicesPageContent | null;
}

export default async function ServicesCTA({ data, locale = 'th' }: ServicesCTAProps) {
  let settings: SiteSettings | null = null;

  try {
    settings = await sanityClient.fetch<SiteSettings>(siteSettingsQuery);
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
  }

  const lineUrl = settings?.contact?.lineUrl;

  return (
    <section className="relative py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 overflow-hidden">
      {/* Decorative background rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border border-blue-700/30 absolute" />
        <div className="w-[400px] h-[400px] rounded-full border border-blue-600/20 absolute" />
        <div className="w-[200px] h-[200px] rounded-full bg-blue-700/10 absolute blur-2xl" />
      </div>

      {/* Top highlight line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">

        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-5 leading-tight drop-shadow-sm">
          {data?.cta?.heading || "ไม่แน่ใจว่าบริการไหนเหมาะกับคุณ?"}
        </h2>

        <p className="text-lg text-blue-100/80 mb-10 whitespace-pre-line leading-relaxed">
          {data?.cta?.description ||
            "ทักมาพูดคุยและเล่าปัญหาธุรกิจของคุณให้เราฟังก่อนได้ เรายินดีให้คำปรึกษาเบื้องต้นเพื่อหาทางออกที่ดีที่สุดสำหรับคุณ"}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {lineUrl && (
            <TrackedLink
              href={lineUrl}
              section="services_cta"
              eventType="line"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-[#00B900] rounded-full hover:bg-[#00A000] transition-all shadow-xl shadow-black/30 hover:scale-105 active:scale-95"
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              {locale === 'en' ? 'Talk to us on LINE' : 'คุยกับเราผ่าน LINE'}
            </TrackedLink>
          )}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
    </section>
  );
}