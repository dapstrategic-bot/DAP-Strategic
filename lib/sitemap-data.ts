import { bilingualPaths, languagePair } from '@/lib/languages';
import {listedRounds, roundPath} from '@/lib/tonrob';
import { SITE_URL } from '@/lib/site-identity';
import type { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity';
import { productSlugsQuery, serviceSlugsQuery } from '@/lib/queries';
import { getPublishedContent } from '@/lib/dongfunda/data';
import { contentHref } from '@/lib/dongfunda/model';
import { dongfundaSite } from '@/lib/dongfunda/seo';
import { researchPaths } from '@/lib/dongfunda/research-catalog';
import { createSitemapCache } from '@/lib/sitemap-cache';

// ──────────────────────────────────────────────
// Complete public URL inventory shared by the cached sitemap child route.
// ──────────────────────────────────────────────

// Omit lastModified when the actual content update time is unknown. Request time
// is not a content modification date; DongFunda entries retain their stored dates.

const sitemapClient = sanityClient.withConfig({ useCdn: false, perspective: 'published' });

async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    ...researchPaths.map(path=>({url:SITE_URL+path,changeFrequency:'monthly' as const,priority:0.8})),
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

  for (const path of bilingualPaths) {
    const pair = languagePair(path)!;
    const alternates = { languages: { th: `${SITE_URL}${pair.th}`, en: `${SITE_URL}${pair.en}`, 'x-default': `${SITE_URL}${pair.th}` } };
    const existing = staticPages.find(item => item.url.replace(/\/$/, '') === `${SITE_URL}${pair.th}`.replace(/\/$/, ''));
    if (existing) existing.alternates = alternates;
    staticPages.push({ url: `${SITE_URL}${pair.en}`, changeFrequency:'monthly', alternates });
  }
  staticPages.push({url: SITE_URL+'/products/tonrob', changeFrequency:'monthly', priority:0.8}, ...listedRounds().map(r=>({url:SITE_URL+roundPath(r),changeFrequency:'monthly' as const,priority:0.7})));
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
        ...(languagePair(`/services/${s.slug}`) ? { alternates: { languages: { th: `${SITE_URL}/services/${s.slug}`, en: `${SITE_URL}/en/services/${s.slug}`, "x-default": `${SITE_URL}/services/${s.slug}` } } } : {}),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));

  // Dynamic product detail pages
  const productPages: MetadataRoute.Sitemap = productSlugs
      .filter((s) => s.slug && s.slug !== 'tonrob' && !listedRounds().some(r=>r.slug===s.slug))
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
    {url: `${dongfundaSite}/dongfunda`, alternates: {languages:{th:`${SITE_URL}/dongfunda`,en:`${SITE_URL}/en/dongfunda`,"x-default":`${SITE_URL}/dongfunda`}}, changeFrequency: 'weekly', priority: 0.8},
    ...contentPages];
}

const cachedSitemap = createSitemapCache(buildSitemap);

export async function getCompleteSitemap(): Promise<MetadataRoute.Sitemap> {
  return cachedSitemap();
}
