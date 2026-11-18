
import { tx, type CatalogLocale } from '@/lib/catalog-language';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen } from 'lucide-react';
import type { SanityProduct } from '@/types';

const badgeConfig: Record<string, { label: string; color: string }> = {
  bestseller: { label: 'Best Seller', color: 'bg-yellow-400 text-yellow-900' },
  recommended: { label: 'Recommended', color: 'bg-blue-500 text-white' },
  new: { label: 'New', color: 'bg-green-500 text-white' },
};

export type CatalogProduct = Pick<SanityProduct, '_id' | 'title' | 'slug' | 'category' | 'subtitle' | 'description' | 'imageUrl'> & { badge?: string };
interface ProductCardProps {
  product: CatalogProduct;
  locale?: CatalogLocale;
}

export default function ProductCard({ product, locale = 'th' }: ProductCardProps) {
  const slug = product.slug?.current;
  const href = slug ? `/products/${slug}` : '#';
  const badge = product.badge && product.badge !== 'none' ? badgeConfig[product.badge] : null;

  return (
    <Link
      href={href}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
    >
      {/* Cover image */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-blue-950 to-gray-900 overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-white/20" />
          </div>
        )}

        {/* Gradient overlay ด้านล่าง */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badge */}
        {badge && (
          <div className={`absolute top-3 left-3 ${badge.color} text-xs font-bold px-2.5 py-1 rounded-full`}>
            {badge.label}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
          {product.title}
        </h3>

        {product.subtitle && (
          <p className="text-sm text-blue-600 font-medium mb-3 line-clamp-1">
            {product.subtitle}
          </p>
        )}

        {product.description && (
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 flex-1">
            {product.description}
          </p>
        )}

        {locale === 'en' && <p className="px-6 text-sm font-medium text-blue-800">Content in Thai · Course instruction and E-books are not in English.</p>}
      {/* Footer */}
        <div className="flex items-center justify-end mt-5 pt-4 border-t border-gray-100">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full bg-blue-900 text-white group-hover:bg-blue-700 transition-colors duration-200">{locale === "en" ? "View details (Thai)" : "ดูรายละเอียด"}<ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}