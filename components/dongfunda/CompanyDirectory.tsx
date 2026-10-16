'use client';

import Link from 'next/link';
import { companyHref, matchesBdms } from '@/lib/dongfunda/financials';

export default function CompanyDirectory({ query }: { query: string }) {
  const found = matchesBdms(query);
  return <section className="df-finance df-company-directory df-container" id="company-information" aria-labelledby="company-information-title">
    <h2 id="company-information-title">ข้อมูลบริษัท</h2>
    <p className="df-f-muted">เปรียบเทียบตัวเลขแต่ละช่วงเวลา ย้อนหลังสูงสุด 5 ปี</p>
    <p className="df-f-company-count" role="status" aria-live="polite">{found ? 'พบ 1 บริษัท' : 'ยังไม่มีข้อมูลบริษัทที่ค้นหา'}</p>
    {found && <Link href={companyHref} className="df-f-company-card" aria-label="BDMS ดูกราฟงบการเงินทั้ง 8 รายการ">
      <div className="df-f-card-heading"><span className="df-f-ticker">BDMS</span><div><h3>กรุงเทพดุสิตเวชการ</h3><p className="df-f-muted">ธุรกิจโรงพยาบาล · งบการเงินรวม</p></div></div>
      <p>รายได้ กำไร สินทรัพย์ หนี้สิน และอัตราส่วนทางการเงิน ในหน้าบริษัทเดียว</p>
      <div className="df-f-tags">{['รายได้รวม', 'กำไรสุทธิ', 'อัตรากำไรขั้นต้น', 'อัตรากำไรสุทธิ', 'กำไรสะสม', 'สินทรัพย์รวม', 'หนี้สินรวม', 'หนี้สินมีดอกเบี้ยต่อส่วนของผู้ถือหุ้น'].map(text => <span key={text}>{text}</span>)}</div>
      <p className="df-f-muted">Q1–Q4 · ครึ่งปีแรก · 9 เดือน · เต็มปี</p>
      <div className="df-f-card-action">ดูกราฟ BDMS ทั้ง 8 รายการ <span aria-hidden="true">→</span></div>
    </Link>}
  </section>;
}
