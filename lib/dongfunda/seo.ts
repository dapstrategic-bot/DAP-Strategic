import { SITE_URL, COMPANY_ID } from '@/lib/site-identity';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import { contentHref, safeLink, isPublicContent, videoEmbed, type DongFundaContent } from './model';

export const dongfundaSite = SITE_URL;
export function articleCanonical(item: DongFundaContent) {
  return (item.canonical_url?.startsWith('https://') && safeLink(item.canonical_url)) ||
    `${dongfundaSite}${contentHref(item)}`;
}
export function articleMetadata(item: DongFundaContent): Metadata {
  const title = item.seo_title || `${item.title} | DongFunda`;
  const description =
    item.meta_description || item.excerpt || item.summary || item.title;
  const canonical = articleCanonical(item);
  const image =
    item.thumbnail?.url && !item.demo ? item.thumbnail.url : undefined;
  const metadata = generatePageMetadata({
    title,
    description,
    path: contentHref(item),
    ogImage: image || `${dongfundaSite}/images/logo.jpg`,
    noIndex: !!item.demo,
  });
  return {
    ...metadata,
    title: { absolute: title },
    alternates: { canonical: item.demo ? null : canonical },
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      url: canonical,
      publishedTime: item.published_at,
      modifiedTime: item.updated_at,
    },
  };
}

export function articleStructuredData(item: DongFundaContent) {
  const url = articleCanonical(item);
  return {
    '@context': 'https://schema.org',
    '@graph': !isPublicContent(item) ? [] : [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        publisher: { '@id': COMPANY_ID },
        isPartOf: { '@id': `${SITE_URL}/dongfunda#webpage` },
        headline: item.title,
        description: item.excerpt,
        image: item.thumbnail?.url ? [item.thumbnail.url] : undefined,
        datePublished: item.published_at,
        dateModified: item.updated_at,
        author: { '@id': COMPANY_ID },
        mainEntityOfPage: url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: dongfundaSite,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'DongFunda',
            item: `${dongfundaSite}/dongfunda`,
          },
          { '@type': 'ListItem', position: 3, name: item.title, item: url },
        ],
      },
    ],
  };
}

// Proof is supplied from reviewed source metadata, never from article dates.
export function videoStructuredData(item: DongFundaContent, proof?: {
  name: string; uploadDate: string; embedUrl: string; source: string; duration?: string;
}) {
  const embed = videoEmbed(item.video_embed || item.video_url);
  const thumbnail = item.thumbnail?.url;
  if (!isPublicContent(item) || !proof?.name.trim() || !embed ||
      videoEmbed(proof.source) !== embed || proof.embedUrl !== embed ||
      !thumbnail?.startsWith('https://') || !safeLink(thumbnail) ||
      !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(proof.uploadDate) ||
      !Number.isFinite(Date.parse(proof.uploadDate)) || Date.parse(proof.uploadDate) > Date.now()) return undefined;
  const url = articleCanonical(item);
  return {
    '@type': 'VideoObject', '@id': `${url}#video`, name: proof.name,
    description: item.meta_description || item.excerpt, thumbnailUrl: [thumbnail],
    uploadDate: proof.uploadDate,
    duration: proof.duration && /^PT(?=\d)(?:\d+H)?(?:\d+M)?(?:\d+S)?$/.test(proof.duration) ? proof.duration : undefined,
    embedUrl: embed, mainEntityOfPage: url, publisher: { '@id': COMPANY_ID },
  };
}
