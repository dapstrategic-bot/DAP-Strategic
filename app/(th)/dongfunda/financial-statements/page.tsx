import ApprovedPublicPage from '@/components/dongfunda/ApprovedPublicPage';
import {generatePageMetadata} from '@/lib/seo';
export const metadata=generatePageMetadata({title:'งบการเงิน | DongFunda',description:'หน้างบการเงินอยู่ในระหว่างปรับปรุง',path:'/dongfunda/financial-statements'});
const html='<header><div class="header-inner"><a href="/dongfunda" class="brand"><img src="/dongfunda-assets/r04/home/dap-logo.jpg" alt="DongFunda"><span>DongFunda</span></a></div></header><main class="wrap" style="padding-top:90px;padding-bottom:120px;min-height:70vh"><p class="eyebrow">งบการเงิน</p><h1>อยู่ในระหว่างปรับปรุง</h1><a class="btn gold" href="/dongfunda">กลับหน้า DongFunda</a> <a class="btn outline" href="/dongfunda/one-report">ดูสรุป One Report</a></main>';
export default function Page(){return <ApprovedPublicPage page="home" html={html} />;}
