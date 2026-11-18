'use client';

import { tx, type CatalogLocale } from '@/lib/catalog-language';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, Clock3 } from 'lucide-react';
import { contentHref, type DongFundaContent } from '@/lib/dongfunda/model';

export function Thumbnail({
  item,
  priority = false,
  compact = false,
  preserveAspect = false,
  locale = 'th',
}: {
  item: DongFundaContent;
  priority?: boolean;
  compact?: boolean;
  preserveAspect?: boolean;
  locale?: CatalogLocale;
}) {
  const [failed, setFailed] = useState(false);
  const url = item.thumbnail?.url;
  const ratio = item.thumbnail?.aspectRatio;
  const portrait = typeof ratio === 'number' && ratio > 0 && ratio < 1;
  const allowed =
    url?.startsWith('/dongfunda-demo/') ||
    (item.demo === true && url === '/dongfunda-lh-preview-cover') ||
    url?.startsWith('https://cdn.sanity.io/');
  return (
    <div className={`df-thumbnail ${compact ? 'df-thumbnail-compact' : ''}`} style={portrait && preserveAspect ? {aspectRatio: ratio} : undefined}>
      {url && allowed && !failed ? (
        <Image
          src={url}
          alt={item.thumbnail?.alt || item.title}
          fill
          style={portrait ? {objectFit: 'contain'} : undefined}
          sizes={
            compact
              ? '96px'
              : priority
                ? '(max-width: 760px) 100vw, 50vw'
                : '(max-width: 600px) 100vw, (max-width: 1000px) 45vw, 25vw'
          }
          priority={priority}
          unoptimized={url.startsWith('/dongfunda-demo/') || url === '/dongfunda-lh-preview-cover'}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="df-image-fallback">
          <BookOpen size={compact ? 22 : 40} />
          <span>DongFunda</span>
        </div>
      )}
      {!compact && item.duration_minutes ? (
        <span className="df-duration">
          <Clock3 size={12} />
          {item.duration_minutes} {locale === 'en' ? 'min' : 'นาที'}
        </span>
      ) : null}
    </div>
  );
}

export function ContentCard({ item, locale = 'th' }: { item: DongFundaContent; locale?: CatalogLocale }) {
  return (
    <article className="df-card">
      <Link href={contentHref(item)}>
        <div className="df-card-picture">
          <Thumbnail item={item} locale={locale} />
          <span className="df-card-tag">
            {item.tickers?.[0] || item.primary_topic || 'DongFunda'}
          </span>
        </div>
        <div className="df-card-copy">
          <h3>{item.title}</h3>{locale === "en" && <p className="text-sm text-blue-800">Article / video in Thai</p>}
          {item.excerpt && <p>{item.excerpt}</p>}
          <div className="df-meta">
            {item.primary_topic}
            {item.duration_minutes ? ` · ${item.duration_minutes} ${locale === 'en' ? 'min' : 'นาที'}` : ''}
          </div>
        </div>
      </Link>
    </article>
  );
}
