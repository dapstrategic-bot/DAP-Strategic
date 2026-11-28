import ResearchStructuredData from '@/lib/dongfunda/approved-public/ResearchStructuredData';
import FinancialPublicPage from '@/components/dongfunda/FinancialPublicPage';
import {financialHtml} from '@/lib/dongfunda/approved-public/financial-rendered';
import {researchMetadata} from '@/lib/dongfunda/research-seo';
export const metadata=researchMetadata('financial-statements',undefined,'en');
export default function Page(){return <><ResearchStructuredData locale="en" section="financial-statements"/><FinancialPublicPage locale="en" html={financialHtml.library}/></>;}
