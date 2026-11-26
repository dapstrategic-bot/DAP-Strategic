import ResearchStructuredData from '@/lib/dongfunda/approved-public/ResearchStructuredData';
import {dongfundaMetadata} from '@/lib/dongfunda/research-seo';
import { DONGFUNDA_TITLE, DONGFUNDA_DESCRIPTION } from '@/lib/site-identity';
import { lhPreviewEnabled } from '@/lib/dongfunda/lh-preview';
import type { Metadata } from 'next';
import ApprovedPublicPage from '@/components/dongfunda/ApprovedPublicPage';
import {renderHome} from '@/lib/dongfunda/approved-public/render';
import { getContent } from '@/lib/dongfunda/data';
import { demoEnabled, discoveryContent } from '@/lib/dongfunda/model';
import { dongfundaSite } from '@/lib/dongfunda/seo';

export const dynamic = 'force-dynamic';
export function generateMetadata(): Metadata {
  const metadata = dongfundaMetadata({
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
    alternates: { ...metadata.alternates, canonical: `${dongfundaSite}/dongfunda` },
  };
}

export default async function DongFundaPage() {
  const items = await getContent();
  return (
    <>
    <ResearchStructuredData section="home" />
    <ApprovedPublicPage page="home" html={renderHome(items.map(discoveryContent))} />
    </>
  );
}
