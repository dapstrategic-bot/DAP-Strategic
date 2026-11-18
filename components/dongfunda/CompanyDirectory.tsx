'use client';

import { tx, type CatalogLocale } from '@/lib/catalog-language';

import Link from 'next/link';
import { companyHref, matchesBdms } from '@/lib/dongfunda/financials';

export default function CompanyDirectory({ query, locale = 'th' }: { query: string; locale?: CatalogLocale }) {
  const found = matchesBdms(query);
  return <section className="df-finance df-company-directory df-container" id="company-information" aria-labelledby="company-information-title">
    <h2 id="company-information-title">{tx(locale, "ข้อมูลบริษัท")}</h2>
    <p className="df-f-muted">{tx(locale, "เปรียบเทียบตัวเลขแต่ละช่วงเวลา ย้อนหลังสูงสุด 5 ปี")}</p>
    <p className="df-f-company-count" role="status" aria-live="polite">{found ? tx(locale, "พบ 1 บริษัท") : tx(locale, "ยังไม่มีข้อมูลบริษัทที่ค้นหา")}</p>
    {found && <Link href={companyHref} className="df-f-company-card" aria-label={tx(locale, "BDMS ดูกราฟงบการเงินทั้ง 8 รายการ")}>
      <div className="df-f-card-heading"><span className="df-f-ticker">BDMS</span><div><h3>{tx(locale, "กรุงเทพดุสิตเวชการ")}</h3><p className="df-f-muted">{tx(locale, "ธุรกิจโรงพยาบาล · งบการเงินรวม")}</p></div></div>
      <p>{tx(locale, "รายได้ กำไร สินทรัพย์ หนี้สิน และอัตราส่วนทางการเงิน ในหน้าบริษัทเดียว")}</p>
      <div className="df-f-tags">{[tx(locale, "รายได้รวม"), tx(locale, "กำไรสุทธิ"), tx(locale, "อัตรากำไรขั้นต้น"), tx(locale, "อัตรากำไรสุทธิ"), tx(locale, "กำไรสะสม"), tx(locale, "สินทรัพย์รวม"), tx(locale, "หนี้สินรวม"), tx(locale, "หนี้สินมีดอกเบี้ยต่อส่วนของผู้ถือหุ้น")].map(text => <span key={text}>{tx(locale,text)}</span>)}</div>
      <p className="df-f-muted">{tx(locale, "Q1–Q4 · ครึ่งปีแรก · 9 เดือน · เต็มปี")}</p>
      <div className="df-f-card-action">{tx(locale, "ดูกราฟ BDMS ทั้ง 8 รายการ")}<span aria-hidden="true">→</span></div>
    </Link>}
  </section>;
}
