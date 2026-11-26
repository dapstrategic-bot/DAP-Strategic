import ApprovedPublicPage from '@/components/dongfunda/ApprovedPublicPage';
import {bdmsHtml} from '@/lib/dongfunda/approved-public/bdms-rendered';
import ResearchStructuredData from '@/lib/dongfunda/approved-public/ResearchStructuredData';
import {researchMetadata} from '@/lib/dongfunda/research-seo';
export const metadata=researchMetadata('one-report','bdms');
export default function Page(){return <><ResearchStructuredData company="bdms" /><ApprovedPublicPage page="bdms" html={bdmsHtml} /></>;}
