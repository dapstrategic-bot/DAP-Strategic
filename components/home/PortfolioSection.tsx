'use client';

import { homeText, homeHref, type HomeLocale } from '@/lib/home-language';
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { projects as fallbackProjects } from '@/data/portfolio';
import type { PortfolioProject, SanityPortfolio } from '@/types';

interface PortfolioSectionProps {
  locale?: HomeLocale;
  portfolios?: SanityPortfolio[];
}

export default function PortfolioSection({ portfolios, locale = 'th' }: PortfolioSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  const hasSanityData = portfolios && portfolios.length > 0;

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    setShowArrows(el.scrollWidth > el.clientWidth);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('div')?.offsetWidth || 400;
    const gap = 32; // gap-8 = 2rem = 32px
    const scrollAmount = cardWidth + gap;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-sm font-medium mb-4 border border-blue-100">
              Our Track Record
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">{homeText(locale, "ผลงานและความสำเร็จ")}</h2>
            <p className="text-gray-600 text-lg">{homeText(locale, "ตัวอย่างโครงการที่เราได้ร่วมสร้างการเติบโตให้กับธุรกิจ SME ไทย")}</p>
          </div>

          {/* Navigation Arrows */}
          {showArrows && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="p-3 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-900 hover:border-blue-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200"
                aria-label={homeText(locale, "เลื่อนไปทางซ้าย")}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="p-3 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-900 hover:border-blue-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200"
                aria-label={homeText(locale, "เลื่อนไปทางขวา")}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Cards Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-8 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {hasSanityData
            ? portfolios.map((project) => (
                <SanityProjectCard key={project._id} project={project} />
              ))
            : fallbackProjects.map((project) => (
                <FallbackProjectCard key={project.id} project={project} />
              ))}
        </div>
      </div>
    </section>
  );
}

/* ── Card สำหรับข้อมูลจาก Sanity ── */
function SanityProjectCard({ project }: { project: SanityPortfolio }) {
  return (
    <div className="w-[85%] md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.375rem)] shrink-0 bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      {/* Image & Badge */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        {project.imageUrl && (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {project.category && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/95 text-blue-900 backdrop-blur-sm shadow-sm">
              {project.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">
          {project.description}
        </p>

        {/* Result Highlight */}
        <div className="pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 bg-blue-50 p-2 rounded-lg text-blue-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Key Result</div>
              <div className="text-sm font-bold text-gray-900">{project.result}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Card สำหรับ fallback (hardcoded data) ── */
function FallbackProjectCard({ project }: { project: PortfolioProject }) {
  return (
    <div className="w-[85%] md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.375rem)] shrink-0 bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      {/* Image & Badge */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/95 text-blue-900 backdrop-blur-sm shadow-sm">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">
          {project.description}
        </p>

        {/* Result Highlight */}
        <div className="pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 bg-blue-50 p-2 rounded-lg text-blue-700">
              <project.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Key Result</div>
              <div className="text-sm font-bold text-gray-900">{project.result}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

