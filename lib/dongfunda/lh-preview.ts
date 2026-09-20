import 'server-only';
import type { Metadata } from 'next';
import approved from './lh-approved-preview.json';

export function lhPreviewEnabled(env: Record<string, string | undefined> = process.env) {
  return env.NODE_ENV === 'development' && env.DONGFUNDA_LH_PREVIEW === 'true';
}

export function isLhPreviewSlug(slug: string) {
  return slug === approved.seo.slug;
}

export function lhPreviewMetadata(): Metadata {
  return {
    title: { absolute: approved.seo.seo_title },
    description: approved.seo.meta_description,
    keywords: approved.seo.keywords,
    robots: { index: false, follow: false, noarchive: true },
    alternates: { canonical: null },
    openGraph: {
      title: approved.seo.seo_title,
      description: approved.seo.meta_description,
      type: 'website',
      images: [],
    },
    twitter: {
      card: 'summary',
      title: approved.seo.seo_title,
      description: approved.seo.meta_description,
      images: [],
    },
  };
}

export function chapterSeconds(displayTime: string) {
  return displayTime.split(':').reduce((seconds, segment) => seconds * 60 + Number(segment), 0);
}

export { approved as lhApproved };
