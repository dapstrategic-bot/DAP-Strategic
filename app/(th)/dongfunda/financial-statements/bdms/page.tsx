import FinancialPublicPage from '@/components/dongfunda/FinancialPublicPage';
import {financialHtml} from '@/lib/dongfunda/approved-public/financial-rendered';
import {generatePageMetadata} from '@/lib/seo';
export const metadata=generatePageMetadata({title:'BDMS งบการเงิน รายได้ กำไร และฐานะการเงิน | DongFunda',description:'Dashboard งบการเงินรวม BDMS ปี 2565–2569 ดูกราฟรายได้ กำไร อัตรากำไร สินทรัพย์ หนี้สิน กำไรสะสม และหนี้มีดอกเบี้ยต่อทุน เลือกเปรียบเทียบงวดเดียวกันข้ามปี',path:'/dongfunda/financial-statements/bdms'});
export default function Page(){return <FinancialPublicPage html={financialHtml.bdms}/>;}
