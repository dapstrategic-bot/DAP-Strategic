import Link from 'next/link';
import FinancialCharts from '@/components/dongfunda/FinancialCharts';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site-identity';
import { companyHref } from '@/lib/dongfunda/financials';

export const metadata = generatePageMetadata({
  title: 'BDMS ข้อมูลบริษัทและกราฟงบการเงิน | DongFunda',
  description: 'ข้อมูลบริษัท กรุงเทพดุสิตเวชการ (BDMS) และกราฟงบการเงินรวม เปรียบเทียบรายได้ กำไร สินทรัพย์ หนี้สิน และอัตราส่วนทางการเงินตามช่วงเวลา',
  path: companyHref,
  ogImage: `${SITE_URL}/images/logo.jpg`,
});

export default function BdmsCompanyPage() {
  return <div className="df df-finance"><div className="df-container df-f-company-page">
    <Link className="df-f-back" href="/dongfunda?q=BDMS#company-information">← กลับหน้า DongFunda</Link>
    <div className="df-f-company-heading"><div className="df-f-ticker">BDMS</div><div><p className="df-f-muted">ข้อมูลบริษัท / งบการเงิน</p><h1>กรุงเทพดุสิตเวชการ</h1><p className="df-f-muted">Bangkok Dusit Medical Services · งบการเงินรวม</p></div></div>
    <FinancialCharts />
  </div></div>;
}
