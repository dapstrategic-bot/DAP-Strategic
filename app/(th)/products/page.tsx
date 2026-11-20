import React from 'react';
import ContactBar from '@/components/layout/ContactBar';
import type { Metadata } from 'next';
import { ShoppingCart } from 'lucide-react';
import { sanityClient } from '@/lib/sanity';
import { productsQuery, productsPageQuery } from '@/lib/queries';
import type { SanityProduct, ProductsPageContent } from '@/types';
import PageHeader from '@/components/shared/PageHeader';
import ProductGrid from '@/components/products/ProductGrid';
import ProductsCTA from '@/components/products/ProductsCTA';
import DongFundaTrust from '@/components/products/DongFundaTrust';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site-identity';
import {latestOpenRound, listedRounds} from '@/lib/tonrob';

export const revalidate = 30;

// ── SEO ──
export async function generateMetadata(): Promise<Metadata> {
  let pageData: ProductsPageContent | null = null;
  try {
    pageData = await sanityClient.fetch<ProductsPageContent>(productsPageQuery);
  } catch {
    // fallback
  }
  return generatePageMetadata({
    title: pageData?.seo?.title || 'ผลิตภัณฑ์และคอร์สเรียน | DAP Strategic Consulting',
    description:
      pageData?.seo?.description ||
      'E-book และคอร์สเรียนด้านการลงทุนและบริหารธุรกิจ เพื่ออัปสกิลให้เหนือกว่าคู่แข่ง',
    path: '/products',
    ogImage: `${SITE_URL}/images/logo.jpg`,
  });
}

export default async function ProductsPage() {
  let products: SanityProduct[] = [];
  let pageData: ProductsPageContent | null = null;
  try {
    [products, pageData] = await Promise.all([
      sanityClient.fetch(productsQuery),
      sanityClient.fetch(productsPageQuery),
    ]);
  } catch (error) {
    console.error('Failed to fetch products data:', error);
  }

  // Code-backed course series; no Production CMS mutation. Reuse its existing course category.
  const currentRound = latestOpenRound() || listedRounds()[0];
  if (currentRound) {
    const courseCategory = products.find(p => p.category?._id === 'd05c02f7-d13b-42ec-b581-4e8ddb887bdb')?.category
      || {_id:'d05c02f7-d13b-42ec-b581-4e8ddb887bdb', title:'Course Online'};
    const seriesCard: SanityProduct = {
      _id:'local-course-series-tonrob',title:'หุ้นต้นรอบ | DongFunda',slug:{current:'tonrob'},
      category:courseCategory,subtitle:latestOpenRound() ? 'รอบล่าสุด '+currentRound.name : 'รายละเอียดและประวัติรอบเรียน',
      description:currentRound.opening,
      imageUrl:currentRound.poster,salePrice:currentRound.price,isActive:true
    };
    products = [seriesCard, ...products.filter(p => p.slug?.current !== 'tonrob')];
  }
  const hasProducts = products && products.length > 0;

  return (
    <div className="bg-gray-50">
      <ContactBar />
      <PageHeader
        badge="Our Products"
        title={pageData?.productsSection?.heading || "ผลิตภัณฑ์และคอร์สเรียน"}
        description={pageData?.productsSection?.subheading || "E-book และคอร์สเรียนด้านการลงทุนและบริหารธุรกิจ เพื่ออัปสกิลให้เหนือกว่าคู่แข่ง"}
      />

      <DongFundaTrust />

      {/* Product List */}
      <section className="pt-8 pb-20 bg-white" id="products">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Grid with category filter tabs */}
          {hasProducts ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-20 text-gray-300">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg">กำลังเตรียมสินค้า... กรุณากลับมาใหม่ภายหลัง</p>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <ProductsCTA data={pageData} />
    </div>
  );
}
