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
    // Stable static index points to the core and complete cached inventories.
    // /sitemap.xml remains a compatible alias for previously discovered links.
    sitemap: [`${SITE_URL}/sitemap-index.xml`, `${SITE_URL}/sitemap-core.xml`],
  };
}
