import ApprovedPublicPage from '@/components/dongfunda/ApprovedPublicPage';
import {cpallHtml} from '@/lib/dongfunda/approved-public/cpall-rendered';
import ResearchStructuredData from '@/lib/dongfunda/approved-public/ResearchStructuredData';
import {researchMetadata} from '@/lib/dongfunda/research-seo';
export const metadata=researchMetadata('one-report','cpall');
export default function Page(){return <><ResearchStructuredData company="cpall" /><ApprovedPublicPage page="cpall" html={cpallHtml} /></>;}
