import FinancialPublicPage from '@/components/dongfunda/FinancialPublicPage';
import {financialHtml} from '@/lib/dongfunda/approved-public/financial-rendered';
import {generatePageMetadata} from '@/lib/seo';
export const metadata=generatePageMetadata({title:'งบการเงินและกราฟเปรียบเทียบหุ้น | DongFunda',description:'ค้นหาหุ้นและดู Dashboard งบการเงิน เริ่มจาก BDMS เปรียบเทียบรายได้ กำไร ฐานะการเงิน และอัตราส่วน เลือกรายปี รายไตรมาส ครึ่งปี และ 9 เดือน',path:'/dongfunda/financial-statements'});
export default function Page(){return <FinancialPublicPage html={financialHtml.library}/>;}
