import ApprovedPublicPage from '@/components/dongfunda/ApprovedPublicPage';
import {cpallHtml} from '@/lib/dongfunda/approved-public/cpall-rendered';
import ResearchStructuredData from '@/lib/dongfunda/approved-public/ResearchStructuredData';
import {researchMetadata} from '@/lib/dongfunda/research-seo';
export const metadata=researchMetadata('one-report','cpall','en');
export default function Page(){return <><ResearchStructuredData locale="en" company="cpall" /><ApprovedPublicPage locale="en" page="cpall" html={cpallHtml} /></>;}
