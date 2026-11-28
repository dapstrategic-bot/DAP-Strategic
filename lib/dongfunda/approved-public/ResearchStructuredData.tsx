import {serializeJsonLd} from '@/lib/site-identity';
import {researchStructuredData} from '../research-seo';
import type {ResearchSection} from '../research-catalog';
import type {ResearchLocale} from '../research-language';
export default function ResearchStructuredData({section='one-report',company,locale='th'}:{section?:'home'|ResearchSection;company?:string;locale?:ResearchLocale}) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(researchStructuredData(section,company,locale))}}/>;
}
