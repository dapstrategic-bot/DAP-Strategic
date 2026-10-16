import { BRAND_ID, COMPANY_ID, DONGFUNDA_TITLE, DONGFUNDA_DESCRIPTION, serializeJsonLd } from '@/lib/site-identity';
import { lhPreviewEnabled } from '@/lib/dongfunda/lh-preview';
import type { Metadata } from 'next';
import Hub from '@/components/dongfunda/Hub';
import { getContent, getRecommendations } from '@/lib/dongfunda/data';
import { demoEnabled, discoveryContent } from '@/lib/dongfunda/model';
import { generatePageMetadata } from '@/lib/seo';
import { dongfundaSite } from '@/lib/dongfunda/seo';

export const dynamic = 'force-dynamic';
export function generateMetadata(): Metadata {
  const metadata = generatePageMetadata({
    title: DONGFUNDA_TITLE,
    description:
      DONGFUNDA_DESCRIPTION,
    path: '/dongfunda',
    noIndex: demoEnabled() || lhPreviewEnabled(),
    ogImage: `${dongfundaSite}/images/logo.jpg`,
  });
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, url: `${dongfundaSite}/dongfunda` },
    alternates: { canonical: `${dongfundaSite}/dongfunda` },
  };
}

export default async function DongFundaPage() {
  const items = await getContent();
  const recommendations = await getRecommendations();
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({ "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${dongfundaSite}/dongfunda#webpage`, url: `${dongfundaSite}/dongfunda`, name: DONGFUNDA_TITLE, description: DONGFUNDA_DESCRIPTION, about: { "@id": BRAND_ID }, publisher: { "@id": COMPANY_ID }, isPartOf: { "@id": `${dongfundaSite}/#website` } }) }} />
    <Hub
      items={items.map(discoveryContent)}
      {...recommendations}
      demo={demoEnabled() || lhPreviewEnabled()}
    />
    </>
  );
}
