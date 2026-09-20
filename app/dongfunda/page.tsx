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
    title: 'DongFunda | บทวิเคราะห์ธุรกิจและการลงทุน',
    description:
      'อ่านธุรกิจผ่านงบการเงิน เรียนรู้กระแสเงินสด มูลค่า และพื้นฐานการลงทุน กับ DongFunda by DAP',
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
    <Hub
      items={items.map(discoveryContent)}
      {...recommendations}
      demo={demoEnabled() || lhPreviewEnabled()}
    />
  );
}
