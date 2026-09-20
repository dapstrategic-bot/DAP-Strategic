import 'server-only';
import draft from './lh-review-draft.json';
import type { DongFundaContent, ContentBlock } from './model';

/** Local rendering fixture only. Never returned by getPublishedContent. */
export const lhReviewContent: DongFundaContent = {
  ...draft,
  slug: draft.slug.current,
  thumbnail: {
    url: '/dongfunda-lh-preview-cover',
    alt: draft.thumbnail.alt,
    aspectRatio: 1672 / 941,
  },
  content_blocks: draft.content_blocks as ContentBlock[],
  publish_status: 'draft',
  owner_approval_status: 'pending',
  demo: true,
};
