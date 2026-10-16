import { SITE_URL } from '@/lib/site-identity';
import type { Metadata } from 'next';

// ──────────────────────────────────────────────
// SEO Utility — Centralized metadata generator
// ──────────────────────────────────────────────


const SITE_NAME = 'DAP Strategic Consulting';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;
const DEFAULT_TITLE = 'DAP Strategic Consulting | ที่ปรึกษาธุรกิจเชิงกลยุทธ์';
const DEFAULT_DESCRIPTION =
  'ที่ปรึกษาธุรกิจเชิงกลยุทธ์ ช่วยวิเคราะห์ วางแผน และผลักดันธุรกิจให้เติบโตอย่างยั่งยืนด้วยกลยุทธ์ที่วัดผลได้จริง';

export interface SEOInput {
  /** Page title — ถ้าไม่ส่งจะใช้ default */
  title?: string;
  /** Meta description */
  description?: string;
  /** OG image URL (absolute) */
  ogImage?: string;
  /** Path ของหน้า เช่น '/services' (ไม่ต้องมี domain) */
  path?: string;
  /** true = ไม่ให้ Google index หน้านี้ */
  noIndex?: boolean;
}

/**
 * สร้าง Next.js Metadata object พร้อม Open Graph, Twitter Card, Canonical URL
 *
 * ใช้ร่วมกับ `generateMetadata()` หรือ static `metadata` export ของ Next.js
 *
 * @example
 * ```ts
 * // ใน page.tsx
 * export async function generateMetadata(): Promise<Metadata> {
 *   const data = await sanityClient.fetch(query);
 *   return generatePageMetadata({
 *     title: data?.seo?.title || 'Fallback Title',
 *     description: data?.seo?.description || 'Fallback desc',
 *     path: '/services',
 *   });
 * }
 * ```
 */
export function generatePageMetadata(input: SEOInput = {}): Metadata {
  const title = input.title || DEFAULT_TITLE;
  const description = input.description || DEFAULT_DESCRIPTION;
  const url = `${SITE_URL}${input.path || ''}`;
  const ogImage = input.ogImage || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'th_TH',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    ...((input.noIndex || process.env.DAP_LOCAL_PREVIEW === 'true') && {
      robots: { index: false, follow: false },
    }),
  };
}
