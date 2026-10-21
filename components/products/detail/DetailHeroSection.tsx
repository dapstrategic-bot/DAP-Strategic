'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Maximize2, AlertCircle, MessageCircle } from 'lucide-react';
import type { ProductHeroSection } from '@/types';
import { LinkifyText } from '@/components/shared/LinkifyText';
import { GA } from '@/lib/analytics';

interface DetailHeroSectionProps {
  section: ProductHeroSection;
  productTitle: string;
  productImageUrl?: string;
  categoryTitle?: string;
  lineUrl?: string;
  lineText?: string;
  afterCta?: React.ReactNode;
}

function getEmbedUrls(url: string): { inline: string; fullscreen: string } | null {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
      let videoId = '';
      if (parsed.hostname.includes('youtu.be')) {
        videoId = parsed.pathname.slice(1);
      } else {
        videoId = parsed.searchParams.get('v') || parsed.pathname.split('/').pop() || '';
      }
      const base = `https://www.youtube.com/embed/${videoId}`;
      return {
        inline: `${base}?autoplay=1&mute=1&rel=0&modestbranding=1&controls=1&loop=1&playlist=${videoId}`,
        fullscreen: `${base}?autoplay=1&rel=0&modestbranding=1`,
      };
    }

    if (parsed.hostname.includes('vimeo.com')) {
      const videoId = parsed.pathname.split('/').pop();
      return {
        inline: `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1`,
        fullscreen: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
      };
    }

    return { inline: url, fullscreen: url };
  } catch {
    return null;
  }
}

export default function DetailHeroSection({
  section,
  productTitle,
  productImageUrl,
  categoryTitle,
  lineUrl,
  lineText,
  afterCta,
}: DetailHeroSectionProps) {
  const [showVideo, setShowVideo] = useState(true);

  let defaultLineText = 'ทัก Line เพื่อสอบถามคอร์ส';
  if (categoryTitle?.toLowerCase().includes('ebook') || categoryTitle?.toLowerCase().includes('e-book')) {
    defaultLineText = 'ทักไลน์เพื่อสอบถาม E-Book';
  } else if (categoryTitle?.toLowerCase().includes('template')) {
    defaultLineText = 'ทักไลน์เพื่อสอบถาม Template';
  } else if (categoryTitle?.toLowerCase().includes('บริการ') || categoryTitle?.toLowerCase().includes('service')) {
    defaultLineText = 'ทัก Line เพื่อสอบถามบริการ';
  }
  
  const displayLineText = lineText || defaultLineText;
  const [isExpanded, setIsExpanded] = useState(false);

  const hasVideo = !!section.videoPreview;
  const hasThumbnail = !!section.thumbnailUrl;
  const imageUrl = hasThumbnail ? section.thumbnailUrl! : null;
  const hasImage = !!imageUrl;

  const embedUrls = hasVideo ? getEmbedUrls(section.videoPreview!) : null;
  const isDirectVideo =
    embedUrls?.inline === section.videoPreview &&
    !!(section.videoPreview?.match(/\.(mp4|webm|ogg)(\?|$)/));

  const hasBoth = hasVideo && hasImage;

  return (
    <>
      <section className="relative pb-20 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-8xl">

          {/* Text row */}
          <div className="pt-8 pb-10 text-center max-w-8xl mx-auto">
            {section.badge && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6 border border-white/15">
                <AlertCircle className="w-4 h-4 text-white/60" />
                {section.badge}
              </div>
            )}
            <h1 className="font-display text-2xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-[1.15]">
              {section.heading || productTitle}
              {section.highlight && (
                <>
                  <br />
                  <span className="text-blue-300">
                    <LinkifyText text={section.highlight} />
                  </span>
                </>
              )}
            </h1>

            <div className="mt-8 mb-4">
              <a
                href={lineUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#00B900] hover:bg-[#00a000] text-white font-medium text-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#00B900]/25"
                onClick={() => GA.clickLine('product_hero')}
              >
                <MessageCircle className="w-5 h-5" />
                {displayLineText}
              </a>
            </div>

          </div>

          {afterCta}

          {/* Pain Points */}
          {section.painPoints && section.painPoints.length > 0 && (
            <div className="mb-10 max-w-3xl mx-auto">
              <div className="grid sm:grid-cols-2 gap-3 text-left">
                {section.painPoints.map((pain, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/8"
                  >
                    <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    </div>
                    <span className="text-slate-300 text-sm leading-relaxed">
                      <LinkifyText text={pain.text} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subheading */}
          {section.subheading && (
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto mb-4 text-center">
              <LinkifyText text={section.subheading} />
            </p>
          )}

          {(hasVideo || hasImage) && (
            <div className={`grid gap-5 ${hasBoth ? 'lg:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'}`}>

              {hasImage && (
                <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video">
                  <Image
                    src={imageUrl!}
                    alt={productTitle}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  {hasBoth && (
                    <div className="absolute bottom-2 left-3 text-xs text-white/40 font-medium tracking-wide">
                    </div>
                  )}
                </div>
              )}

              {hasVideo && embedUrls && (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video group">
                  {showVideo ? (
                    isDirectVideo ? (
                      <video
                        src={embedUrls.inline}
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <iframe
                        src={embedUrls.inline}
                        title={productTitle}
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    )
                  ) : (
                    <button
                      onClick={() => setShowVideo(true)}
                      className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-900 group/play"
                    >
                      {imageUrl && (
                        <Image src={imageUrl} alt="video thumbnail" fill className="object-cover opacity-40" />
                      )}
                      <div className="relative z-10 w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover/play:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-slate-900 ml-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </button>
                  )}

                  {showVideo && (
                    <div className="absolute top-2 right-2 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setIsExpanded(true)}
                        className="w-8 h-8 rounded-lg bg-black/60 hover:bg-black/90 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-colors"
                        title="ขยายเต็มจอ"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setShowVideo(false)}
                        className="w-8 h-8 rounded-lg bg-black/60 hover:bg-black/90 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-colors"
                        title="ปิดวิดีโอ"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {hasBoth && (
                    <div className="absolute bottom-2 left-3 text-xs text-white/40 font-medium tracking-wide z-10 pointer-events-none">
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Fullscreen Modal */}
      {isExpanded && embedUrls && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {isDirectVideo ? (
              <video src={embedUrls.fullscreen} autoPlay controls className="w-full h-full" />
            ) : (
              <iframe
                src={embedUrls.fullscreen}
                title={productTitle}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            )}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
