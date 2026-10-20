import { SITE_URL } from '@/lib/site-identity';
import type { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity';
import { productSlugsQuery, serviceSlugsQuery } from '@/lib/queries';
import { getPublishedContent } from '@/lib/dongfunda/data';
import { contentHref } from '@/lib/dongfunda/model';
import { dongfundaSite } from '@/lib/dongfunda/seo';
import { companyHref } from '@/lib/dongfunda/financials';
import { createSitemapCache } from '@/lib/sitemap-cache';

// ──────────────────────────────────────────────
// Sitemap — ช่วยให้ Google ค้นหาทุกหน้าได้ครบ
// Next.js จะ serve ที่ /sitemap.xml อัตโนมัติ
// ──────────────────────────────────────────────

// Keep the route dynamic; only complete snapshots use a bounded instance-local cache.
// Omit lastModified when the actual content update time is unknown. Request time
// is not a content modification date; DongFunda entries retain their stored dates.
export const dynamic = 'force-dynamic';

const sitemapClient = sanityClient.withConfig({ useCdn: false, perspective: 'published' });

async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/services`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/products`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/portfolio`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  // Dynamic service detail pages
  // Only cache a complete response. Any source failure rejects the entire build.
  const [serviceSlugs, productSlugs, content] = await Promise.all([
    sitemapClient.fetch<Array<{ slug: string }>>(serviceSlugsQuery, {}, { cache: 'no-store' }),
    sitemapClient.fetch<Array<{ slug: string }>>(productSlugsQuery, {}, { cache: 'no-store' }),
    getPublishedContent(),
  ]);
  const servicePages: MetadataRoute.Sitemap = serviceSlugs
      .filter((s) => s.slug)
      .map((s) => ({
        url: `${SITE_URL}/services/${s.slug}`,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));

  // Dynamic product detail pages
  const productPages: MetadataRoute.Sitemap = productSlugs
      .filter((s) => s.slug)
      .map((s) => ({
        url: `${SITE_URL}/products/${s.slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  const contentPages: MetadataRoute.Sitemap = content.map(item => ({
    url: `${dongfundaSite}${contentHref(item)}`,
    lastModified: item.updated_at || item.published_at,
    changeFrequency: 'weekly', priority: 0.7,
  }));
  return [...staticPages, ...servicePages, ...productPages,
    {url: `${dongfundaSite}/dongfunda`, changeFrequency: 'weekly', priority: 0.8},
    {url: `${dongfundaSite}${companyHref}`, changeFrequency: 'monthly', priority: 0.7}, ...contentPages];
}

const cachedSitemap = createSitemapCache(buildSitemap);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return cachedSitemap();
}
