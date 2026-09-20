import 'server-only';
import { cache } from 'react';
import { lhPreviewEnabled } from './lh-preview';
import { sanityClient } from '@/lib/sanity';
import {
  demoEnabled,
  isPublicContent,
  type DongFundaContent,
  type Recommendation,
} from './model';

// Explicit public perspective plus approval/date gates apply to every entry point.
const client = sanityClient.withConfig({
  useCdn: false,
  perspective: 'published',
});
export const publicFilter = `_type == "dongfundaContent" && !(_id in path("drafts.**")) && !(_id in path("versions.**")) && publish_status == "published" && owner_approval_status == "approved" && defined(published_at) && dateTime(published_at) <= dateTime(now())`;
const projection = `{
  _id, content_id, version, title, "slug": slug.current, excerpt,
  "thumbnail": select(defined(thumbnail.asset) => {"url": thumbnail.asset->url, "alt": thumbnail.alt, "aspectRatio": thumbnail.asset->metadata.dimensions.aspectRatio}),
  video_url, video_embed, duration_minutes, primary_topic, secondary_topics, tags, companies, tickers,
  "series": series->{_id, title, "slug": slug.current, description},
  summary, key_takeaways, content_blocks[]{..., "image": select(defined(image.asset) => {"url": image.asset->url, "alt": image.alt})},
  "related_content": related_content[]._ref,
  "product": select(product->isActive == true => product->{title, "slug": slug.current}),
  "service": select(service->isActive == true => service->{title, "slug": slug.current}),
  seo_title, meta_description, canonical_url, publish_status, owner_approval_status, research_status,
  featured, trending_rank, trending_source, trending_measured_at,
  "created_at": coalesce(created_at, _createdAt), "updated_at": _updatedAt, published_at
}`;

export const getPublishedContent = cache(
  async (): Promise<DongFundaContent[]> => {
    try {
      const items = await client.fetch<DongFundaContent[]>(
        `*[${publicFilter}] | order(published_at desc) ${projection}`,
        {},
        { cache: 'no-store' },
      );
      return items.filter((item) => isPublicContent(item));
    } catch (error) {
      console.error(
        '[DongFunda] Public content unavailable',
        error instanceof Error ? error.message : 'CMS error',
      );
      throw error;
    }
  },
);

export const getContent = cache(async (): Promise<DongFundaContent[]> => {
  if (lhPreviewEnabled()) {
    const { lhReviewContent } = await import('./lh-review-content');
    const items = demoEnabled() ? (await import('./demo')).demoContent : await getPublishedContent();
    return [lhReviewContent, ...items.filter(item => item.slug !== lhReviewContent.slug)];
  }
  if (demoEnabled()) return (await import('./demo')).demoContent;
  return getPublishedContent();
});

export const getContentBySlug = cache(async (slug: string) =>
  (await getContent()).find((item) => item.slug === slug),
);

export const getRecommendations = cache(async () => {
  try {
    return await client.fetch<{
      product: Recommendation | null;
      services: Recommendation[];
    }>(`{
      "product": *[_type == "product" && isActive == true && defined(slug.current) && (title match "*คอร์ส*" || slug.current match "*course*")] | order(order asc)[0]{title, "slug": slug.current},
      "services": *[_type == "service" && isActive == true && defined(slug.current)] | order(order asc)[0...3]{title, "slug": slug.current}
    }`);
  } catch {
    return { product: null, services: [] };
  }
});
