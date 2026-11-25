import ApprovedPublicPage from '@/components/dongfunda/ApprovedPublicPage';
import {bdmsHtml} from '@/lib/dongfunda/approved-public/bdms-rendered';
import ResearchStructuredData from '@/lib/dongfunda/approved-public/ResearchStructuredData';
import {generatePageMetadata} from '@/lib/seo';
export const metadata=generatePageMetadata({title:'BDMS สรุป One Report 2564–2568 | รายได้ โรงพยาบาลและเตียง | DongFunda',description:'สรุป One Report BDMS ย้อนหลัง 5 ปี เปรียบเทียบรายได้ กรุงเทพฯ–ต่างจังหวัด ผู้ป่วยไทย–ต่างชาติ จำนวนโรงพยาบาลและเตียง พร้อมแผนขยายธุรกิจ ดู Dashboard ได้ฟรี',path:'/dongfunda/one-report/bdms',ogImage:'https://www.dap.co.th/images/logo.jpg'});
export default function Page(){return <><ResearchStructuredData company /><ApprovedPublicPage page="bdms" html={bdmsHtml} /></>;}
