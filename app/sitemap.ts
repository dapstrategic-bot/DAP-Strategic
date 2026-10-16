import { SITE_URL } from '@/lib/site-identity';
import type { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity';
import { productSlugsQuery, serviceSlugsQuery } from '@/lib/queries';
import { getPublishedContent } from '@/lib/dongfunda/data';
import { contentHref } from '@/lib/dongfunda/model';
import { dongfundaSite } from '@/lib/dongfunda/seo';

// ──────────────────────────────────────────────
// Sitemap — ช่วยให้ Google ค้นหาทุกหน้าได้ครบ
// Next.js จะ serve ที่ /sitemap.xml อัตโนมัติ
// ──────────────────────────────────────────────

// Request-time generation keeps newly published/unpublished DongFunda entries current.
// Omit lastModified when the actual content update time is unknown. Request time
// is not a content modification date; DongFunda entries retain their stored dates.
export const dynamic = 'force-dynamic';



export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
  let servicePages: MetadataRoute.Sitemap = [];
  try {
    const slugs = await sanityClient.fetch<Array<{ slug: string }>>(serviceSlugsQuery);
    servicePages = slugs
      .filter((s) => s.slug)
      .map((s) => ({
        url: `${SITE_URL}/services/${s.slug}`,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
  } catch {
    // silently fail
  }

  // Dynamic product detail pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const slugs = await sanityClient.fetch<Array<{ slug: string }>>(productSlugsQuery);
    productPages = slugs
      .filter((s) => s.slug)
      .map((s) => ({
        url: `${SITE_URL}/products/${s.slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } catch {
    // silently fail
  }

  const content = await getPublishedContent();
  const contentPages: MetadataRoute.Sitemap = content.map(item => ({
    url: `${dongfundaSite}${contentHref(item)}`,
    lastModified: item.updated_at || item.published_at,
    changeFrequency: 'weekly', priority: 0.7,
  }));
  return [...staticPages, ...servicePages, ...productPages,
    {url: `${dongfundaSite}/dongfunda`, changeFrequency: 'weekly', priority: 0.8}, ...contentPages];
}
