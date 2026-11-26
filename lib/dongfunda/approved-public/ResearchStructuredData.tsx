import {serializeJsonLd} from '@/lib/site-identity';
import {researchStructuredData} from '../research-seo';
import type {ResearchSection} from '../research-catalog';
export default function ResearchStructuredData({section='one-report',company}:{section?:'home'|ResearchSection;company?:string}) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(researchStructuredData(section,company))}}/>;
}
