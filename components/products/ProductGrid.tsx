'use client';

import { tx, type CatalogLocale } from '@/lib/catalog-language';

import React, { useRef, useState, useEffect } from 'react';
import { BookOpen, GraduationCap, FileSpreadsheet, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';
import type { SanityProduct } from '@/types';
import ProductCard, {type CatalogProduct} from './ProductCard';

/* ── Icon ตาม category ── */
function CategoryIcon({ title }: { title: string }) {
  const t = title.toLowerCase();
  if (t.includes('course') || t.includes('คอร์ส')) return <GraduationCap className="w-4 h-4" />;
  if (t.includes('ebook') || t.includes('e-book')) return <BookOpen className="w-4 h-4" />;
  if (t.includes('template') || t.includes('เทมเพลต')) return <FileSpreadsheet className="w-4 h-4" />;
  return <LayoutGrid className="w-4 h-4" />;
}

/* ── anchor id ── */
function toAnchorId(title: string): string {
  return `cat-${title.toLowerCase().replace(/[^a-z0-9ก-๙]/g, '-').replace(/-+/g, '-')}`;
}

/* ── Scrollable row สำหรับแต่ละ category ── */
function CategoryRow({ products, locale = 'th' }: { products: CatalogProduct[]; locale?: CatalogLocale }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    setShowArrows(el.scrollWidth > el.clientWidth + 4);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    // ความกว้างของ card 1 ใบ + gap
    const card = el.querySelector('a') as HTMLElement | null;
    const cardWidth = card?.offsetWidth || 320;
    el.scrollBy({ left: direction === 'left' ? -(cardWidth + 20) : (cardWidth + 20), behavior: 'smooth' });
  };

  // ≤ 3 card → grid ปกติ ไม่มี scroll
  if (products.length <= 3) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p) => <ProductCard key={p._id} product={p} locale={locale} />)}
      </div>
    );
  }

  // > 3 card → horizontal scroll + arrows
  return (
    <div className="relative">
      {/* Arrow Left */}
      {showArrows && (
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2.5 rounded-full border border-gray-200 bg-white text-gray-500 hover:text-blue-900 hover:border-blue-200 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-sm"
          aria-label={tx(locale, "เลื่อนซ้าย")}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((p) => (
          <div
            key={p._id}
            className="w-[85%] md:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.875rem)] shrink-0"
          >
            <ProductCard product={p} locale={locale} />
          </div>
        ))}
      </div>

      {/* Arrow Right */}
      {showArrows && (
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2.5 rounded-full border border-gray-200 bg-white text-gray-500 hover:text-blue-900 hover:border-blue-200 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-sm"
          aria-label={tx(locale, "เลื่อนขวา")}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

/* ── Main Component ── */
interface ProductGridProps {
  products: CatalogProduct[];
  locale?: CatalogLocale;
}

export default function ProductGrid({ products, locale = 'th' }: ProductGridProps) {
  if (!products || products.length === 0) return null;

  // จัดกลุ่มตาม category
  const grouped: Record<string, CatalogProduct[]> = {};
  for (const p of products) {
    const key = p.category?.title || tx(locale, "อื่นๆ");
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(p);
  }
  const categories = Object.keys(grouped);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div>
      {/* ── Category jump buttons ── */}
      {categories.length > 0 && (
        <div className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => scrollToSection(toAnchorId(cat))}
                className="flex items-center justify-center gap-2.5 w-full px-6 py-4 text-base font-semibold rounded-full bg-blue-900 text-white hover:bg-blue-800 active:scale-[0.98] transition-colors"
              >
                <CategoryIcon title={cat} />
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Product sections ── */}
      <div className="space-y-16">
        {categories.map((cat) => (
          <div key={cat} id={toAnchorId(cat)}>
            {/* Category heading */}
            <div className="flex items-center gap-3 mb-7">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600">
                <CategoryIcon title={cat} />
              </div>
              <h3 className="font-display text-xl font-bold text-gray-900">{cat}</h3>
              <div className="flex-1 h-px bg-gray-100 ml-2" />
            </div>

            {/* Cards — grid หรือ scroll ขึ้นอยู่กับจำนวน */}
            <CategoryRow products={grouped[cat]} locale={locale} />
          </div>
        ))}
      </div>
    </div>
  );
}
