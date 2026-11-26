import ResearchStructuredData from '@/lib/dongfunda/approved-public/ResearchStructuredData';
import FinancialPublicPage from '@/components/dongfunda/FinancialPublicPage';
import {financialHtml} from '@/lib/dongfunda/approved-public/financial-rendered';
import {researchMetadata} from '@/lib/dongfunda/research-seo';
export const metadata=researchMetadata('financial-statements');
export default function Page(){return <><ResearchStructuredData section="financial-statements"/><FinancialPublicPage html={financialHtml.library}/></>;}
