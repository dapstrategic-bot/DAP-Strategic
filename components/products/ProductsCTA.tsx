
import { tx, type CatalogLocale } from '@/lib/catalog-language';
import React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import type { ProductsPageContent, SiteSettings } from '@/types';
import { sanityClient } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';
import TrackedLink from '@/components/shared/TrackedLink';

interface ProductsCTAProps {
  locale?: CatalogLocale;
  data: ProductsPageContent | null;
}

export default async function ProductsCTA({ data, locale = 'th' }: ProductsCTAProps) {
  let settings: SiteSettings | null = null;

  try {
    settings = await sanityClient.fetch<SiteSettings>(siteSettingsQuery);
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
  }

  const lineUrl = settings?.contact?.lineUrl;

  return (
    <section className="py-20 bg-blue-900 text-white text-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
          {data?.cta?.heading || "ลงทุนในความรู้ คือการลงทุนที่คุ้มค่าที่สุด"}
        </h2>
        <p className="text-blue-200 text-lg mb-10 whitespace-pre-line">
          {data?.cta?.description || "อย่าปล่อยให้ปัญหาเดิมๆ ฉุดรั้งการเติบโตของคุณ เริ่มต้นเปลี่ยนแปลงตั้งแต่วันนี้"}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="#products" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium text-blue-900 bg-white rounded-full hover:bg-gray-50 transition-all shadow-xl">{tx(locale, "เลือกซื้อสินค้า")}</Link>
          {lineUrl && (
          <TrackedLink href={lineUrl} section="products_cta" eventType="line" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-[#00B900] rounded-full hover:bg-[#00A000] transition-all">
            <MessageCircle className="mr-2 w-5 h-5" />{tx(locale, "คุยกับเราผ่าน LINE")}</TrackedLink>
          )}
        </div>
      </div>
    </section>
  );
}
