import ApprovedPublicPage from '@/components/dongfunda/ApprovedPublicPage';
import {hmproHtml} from '@/lib/dongfunda/approved-public/hmpro-rendered';
import ResearchStructuredData from '@/lib/dongfunda/approved-public/ResearchStructuredData';
import {researchMetadata} from '@/lib/dongfunda/research-seo';
export const metadata=researchMetadata('one-report','hmpro');
export default function Page(){return <><ResearchStructuredData company="hmpro" /><ApprovedPublicPage page="hmpro" html={hmproHtml} /></>;}
