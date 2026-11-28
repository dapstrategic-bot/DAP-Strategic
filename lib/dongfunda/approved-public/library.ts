import {templates} from './templates';
import {publishedReports} from '../research-catalog';
import hmpro from '../hmpro-one-report.json';
const esc=(value:unknown)=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const money=(value:number)=>value.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
export function renderOneReportLibrary(){
  const reports=publishedReports('one-report');
  const entry=reports.find(item=>item.company.slug==='hmpro');
  const latest=hmpro.at(-1)!;
  const growth=latest.revenue_yoy===null?'ปีฐาน':`${latest.revenue_yoy>=0?'+':''}${latest.revenue_yoy.toFixed(2)}% จากปีก่อน`;
  const card=entry?`<article class="stock-card" id="hmpro-card" data-company-card data-sector="retail" data-search="hmpro homepro home pro home product center โฮมโปร โฮม โปรดักส์ เซ็นเตอร์ เมกาโฮม mega home ค้าปลีก วัสดุก่อสร้าง ปรับปรุงบ้าน retail home improvement"><div class="stock-head"><div class="ticker-block">HMPRO</div><div class="company-name"><h2>โฮม โปรดักส์ เซ็นเตอร์</h2><p>Home Product Center</p><span>ค้าปลีก / Home Improvement Retail</span></div><span class="ready-tag">มีข้อมูลแล้ว</span></div><p class="stock-description">รายได้มาจากไหน สินค้ากลุ่มใด<br>และเครือข่ายสาขาขยายอย่างไร</p><div class="stock-metrics"><div><small>รายได้รวม · ปี ${latest.year}</small><strong>${money(latest.revenue)} <span>ล้านบาท</span></strong><p>${growth}</p></div><div><small>เครือข่ายสาขา · สิ้นปี ${latest.year}</small><strong>${latest.branches} <span>สาขา</span></strong><p>ไทย ${latest.thai} / มาเลเซีย ${latest.my} สาขา</p></div></div><div class="coverage"><span>รายได้ 5 ปี</span><span>Hard Line / Soft Line</span><span>บริการเรื่องบ้าน</span><span>สาขาและ Hybrid</span><span>พัฒนาการธุรกิจ</span></div><div class="card-bottom"><div><small>ช่วงข้อมูล</small><b>${esc(entry.report.coverage)}</b></div><a class="btn gold" href="${esc(entry.path)}">เปิดสรุป One Report · HMPRO</a></div><p class="source-note">สรุปจาก One Report ของหุ้น HMPRO ปี ${esc(entry.report.coverage)}</p></article>`:'';
  const guide=`<aside class="guide"><p class="eyebrow">INSIDE THE SUMMARY</p><h2>เลือกธุรกิจที่อยากเข้าใจ</h2><p>เลือกหุ้นเพื่อดูข้อมูลรายได้ โครงสร้างธุรกิจ และเครือข่ายย้อนหลัง 5 ปี</p>${reports.map(item=>`<a href="${esc(item.path)}"><b>${esc(item.company.ticker)}</b><span>${esc(item.company.name)}</span></a>`).join('')}<small>เลือกปีในหน้าบริษัทเพื่อดูรายละเอียดของปีนั้น</small></aside>`;
  return templates.library
    .replace('id="bdms-card"','id="bdms-card" data-company-card data-sector="healthcare" data-search="bdms กรุงเทพดุสิตเวชการ กรุงเทพ โรงพยาบาล healthcare bangkok dusit medical services"')
    .replace('<div id="empty-state"',card+'<div id="empty-state"')
    .replace('พบ 1 บริษัท',`พบ ${reports.length} บริษัท`)
    .replace('<option value="healthcare">โรงพยาบาล / Healthcare</option>','<option value="healthcare">โรงพยาบาล / Healthcare</option><option value="retail">ค้าปลีก / Retail</option>')
    .replace('เช่น BDMS, กรุงเทพดุสิตเวชการ, โรงพยาบาล','เช่น BDMS, HMPRO, โฮมโปร, โรงพยาบาล')
    .replace('ขณะนี้มีข้อมูลเฉพาะ BDMS<br>ลองค้นหา “BDMS” หรือ “กรุงเทพดุสิตเวชการ”','ลองค้นหาด้วยชื่อหุ้น ชื่อบริษัท หรือเลือกแสดงทุกอุตสาหกรรม')
    .replace(/<aside class="guide">[\s\S]*?<\/aside>/,guide);
}
