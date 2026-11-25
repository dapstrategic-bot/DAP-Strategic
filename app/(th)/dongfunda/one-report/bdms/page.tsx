import ApprovedPublicPage from '@/components/dongfunda/ApprovedPublicPage';
import {templates} from '@/lib/dongfunda/approved-public/templates';
import {generatePageMetadata} from '@/lib/seo';
export const metadata=generatePageMetadata({title:'BDMS | Business Dashboard · DongFunda',description:'เข้าใจธุรกิจ BDMS ผ่านรายได้ ผู้ป่วย เครือโรงพยาบาล จำนวนเตียง และแผนขยายธุรกิจ ปี 2564–2568',path:'/dongfunda/one-report/bdms',ogImage:'https://www.dap.co.th/images/logo.jpg'});
export default function Page(){return <ApprovedPublicPage page="bdms" html={templates.bdms} />;}
