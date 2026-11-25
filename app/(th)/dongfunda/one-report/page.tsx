import ApprovedPublicPage from '@/components/dongfunda/ApprovedPublicPage';
import {templates} from '@/lib/dongfunda/approved-public/templates';
import ResearchStructuredData from '@/lib/dongfunda/approved-public/ResearchStructuredData';
import {generatePageMetadata} from '@/lib/seo';
export const metadata=generatePageMetadata({title:'สรุป One Report หุ้นไทย | ค้นหาบริษัทและดู Business Dashboard | DongFunda',description:'ค้นหาสรุป One Report รายบริษัท ดูโครงสร้างรายได้ ลูกค้า และแผนขยายธุรกิจผ่าน Dashboard เริ่มจาก BDMS ปี 2564–2568 เปิดให้ทุกคนดูได้โดยไม่ต้องเข้าสู่ระบบ',path:'/dongfunda/one-report',ogImage:'https://www.dap.co.th/images/logo.jpg'});
export default function Page(){return <><ResearchStructuredData /><ApprovedPublicPage page="library" html={templates.library} /></>;}
