import ResearchStructuredData from '@/lib/dongfunda/approved-public/ResearchStructuredData';
import FinancialPublicPage from '@/components/dongfunda/FinancialPublicPage';
import {financialHtml} from '@/lib/dongfunda/approved-public/financial-rendered';
import {researchMetadata} from '@/lib/dongfunda/research-seo';
export const metadata=researchMetadata('financial-statements','bdms','en');
export default function Page(){return <><ResearchStructuredData locale="en" section="financial-statements" company="bdms"/><FinancialPublicPage locale="en" html={financialHtml.bdms}/></>;}
