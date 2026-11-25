import ApprovedPublicPage from '@/components/dongfunda/ApprovedPublicPage';
import {templates} from '@/lib/dongfunda/approved-public/templates';
import {generatePageMetadata} from '@/lib/seo';
export const metadata=generatePageMetadata({title:'สรุป One Report | DongFunda',description:'เลือกหุ้นและค้นหาสรุป One Report รายบริษัท เปิดให้ทุกคนใช้งาน ขณะนี้มีข้อมูล BDMS ปี 2564–2568',path:'/dongfunda/one-report',ogImage:'https://www.dap.co.th/images/logo.jpg'});
export default function Page(){return <ApprovedPublicPage page="library" html={templates.library} />;}
