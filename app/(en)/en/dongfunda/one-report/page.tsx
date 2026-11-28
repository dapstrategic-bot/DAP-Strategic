import dashboardSupport from '@/lib/dongfunda/dashboard-support.json';
import ApprovedPublicPage from '@/components/dongfunda/ApprovedPublicPage';
import {renderOneReportLibrary} from '@/lib/dongfunda/approved-public/library';
import ResearchStructuredData from '@/lib/dongfunda/approved-public/ResearchStructuredData';
import {researchMetadata} from '@/lib/dongfunda/research-seo';
export const metadata=researchMetadata('one-report',undefined,'en');
export default function Page(){return <><ResearchStructuredData locale="en" /><ApprovedPublicPage locale="en" page="library" html={renderOneReportLibrary().replace('<!-- DONGFUNDA_DASHBOARD_SUPPORT -->',dashboardSupport.html)} /></>;}
