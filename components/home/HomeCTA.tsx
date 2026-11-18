import { homeText, homeHref, type HomeLocale } from '@/lib/home-language';
import React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import type { HomePage, SiteSettings } from '@/types';
import { sanityClient } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';
import TrackedLink from '@/components/shared/TrackedLink';

interface HomeCTAProps {
  locale?: HomeLocale;
  cta?: HomePage['cta'];
}

export default async function HomeCTA({ cta, locale = 'th' }: HomeCTAProps) {
  let settings: SiteSettings | null = null;

  try {
    settings = await sanityClient.fetch<SiteSettings>(siteSettingsQuery);
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
  }

  const lineUrl = settings?.contact?.lineUrl;
  const heading = cta?.heading || 'พร้อมที่จะก้าวไปอีกขั้นกับธุรกิจของคุณหรือยัง?';
  const description = cta?.description || 'ให้เราช่วยวิเคราะห์และวางแผนกลยุทธ์ที่เหมาะสมที่สุดสำหรับธุรกิจของคุณ ปรึกษาเบื้องต้นฟรี ไม่มีค่าใช้จ่าย';

  return (
    <section className="py-24 bg-blue-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/abstract/1920/1080?blur=10')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
          {heading}
        </h2>
        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={homeHref(locale, "/services")} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium text-blue-900 bg-white rounded-full hover:bg-gray-50 transition-all shadow-xl shadow-black/10">{homeText(locale, "ดูบริการของเรา")}</Link>
          <Link href={locale === "en" ? "/en/products" : "/products"} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-blue-800 border border-blue-700 rounded-full hover:bg-blue-700 transition-all">{homeText(locale, "ดูสินค้าของเรา")}</Link>
          {lineUrl && (
          <TrackedLink href={lineUrl} section="home_cta" eventType="line" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-[#00B900] rounded-full hover:bg-[#00A000] transition-all shadow-xl shadow-[#00B900]/20">
            <MessageCircle className="mr-2 w-5 h-5" />{homeText(locale, "คุยกับเราผ่าน LINE")}</TrackedLink>
          )}
        </div>
      </div>
    </section>
  );
}

