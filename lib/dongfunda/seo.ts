import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import { contentHref, safeLink, type DongFundaContent } from './model';

export const dongfundaSite =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dap.co.th';
export function articleMetadata(item: DongFundaContent): Metadata {
  const title = item.seo_title || `${item.title} | DongFunda`;
  const description =
    item.meta_description || item.excerpt || item.summary || item.title;
  const canonical =
    (item.canonical_url?.startsWith('https://') &&
      safeLink(item.canonical_url)) ||
    `${dongfundaSite}${contentHref(item)}`;
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
  const url = `${dongfundaSite}${contentHref(item)}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: item.title,
        description: item.excerpt,
        image: item.thumbnail?.url ? [item.thumbnail.url] : undefined,
        datePublished: item.published_at,
        dateModified: item.updated_at,
        author: {
          '@type': 'Organization',
          name: 'DongFunda by DAP',
          url: dongfundaSite,
        },
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
