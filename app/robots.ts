import { SITE_URL } from '@/lib/site-identity';
import type { MetadataRoute } from 'next';

// ──────────────────────────────────────────────
// Robots.txt — บอก search engine ว่า crawl อะไรได้บ้าง
// Next.js จะ serve ที่ /robots.txt อัตโนมัติ
// ──────────────────────────────────────────────



export default function robots(): MetadataRoute.Robots {
  if (process.env.DAP_LOCAL_PREVIEW === 'true') return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    // Core pages remain discoverable without a cold CMS request. Keep the full
    // dynamic sitemap for current published products/articles and its history.
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/sitemap-core.xml`],
  };
}
