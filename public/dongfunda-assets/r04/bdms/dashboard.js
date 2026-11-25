(() => {
  'use strict';
  const payload=window.BDMS_DATA;
  if(!payload || !Array.isArray(payload.years) || !payload.years.length) return;
  const symbol=typeof payload.company?.symbol==='string'?payload.company.symbol.trim():'';
  if(symbol){const label=document.getElementById('company-symbol');if(label)label.textContent=symbol;document.title=symbol+' | Business Dashboard · DongFunda';}
  const rows=payload.years;
  const sources=payload.sources;
  const queryYear=Number(new URLSearchParams(location.search).get('year'));
  let selected=rows.some(r=>r.year===queryYear)?queryYear:rows.at(-1).year;
  let pipelineFilter='future';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=(v,n=1)=>Number(v).toLocaleString('en-US',{minimumFractionDigits:n,maximumFractionDigits:n});
  const pct=v=>v===null?'ปีฐาน':`${v>=0?'+':''}${fmt(v,2)}%`;
  const ref=(year,page,label)=>`<span class="source-text">ที่มา: One Report ${year}</span>`;
  const yearButtons=()=>rows.map(r=>`<button type="button" data-year="${r.year}" aria-pressed="${r.year===selected}">${r.year}</button>`).join('');
  const narratives={
    2564:'ช่วง COVID-19 ผู้ป่วยต่างชาติมีสัดส่วนรายได้ 18% รายงานปีถัดไประบุว่ารายได้เกี่ยวเนื่อง COVID-19 คิดเป็น 14% ของค่ารักษาพยาบาลในปีนี้ (One Report 2565 น.101)',
    2565:'การผ่อนคลายการเดินทางหนุนรายได้ผู้ป่วยต่างชาติเพิ่ม 69% สัดส่วนต่างชาติขยับเป็น 24% ขณะที่รายได้เกี่ยวเนื่อง COVID-19 ลดเหลือ 10% ของค่ารักษาพยาบาล (น.101)',
    2566:'รายได้ผู้ป่วยต่างชาติเพิ่ม 23% และรายได้จากศูนย์ความเป็นเลิศ COE เพิ่ม 11% มีโรงพยาบาลใหม่สองแห่งในระยองตาม MD&A (น.89–90)',
    2567:'รายได้ผู้ป่วยต่างชาติเพิ่ม 11% รายได้นอกกรุงเทพฯ เพิ่ม 9% เทียบกรุงเทพฯ 5% จำนวนโรงพยาบาลสุทธิยังเป็น 58 แห่ง แม้มีการเปิดพญาไทศรีราชา 2 (น.99–100)',
    2568:'รายได้ดำเนินงานเพิ่มประมาณ 4% แต่กำไรสุทธิลดประมาณ 1% มีทั้งผลกระทบกัมพูชา ค่าเสื่อมจากการลงทุน และรายการพิเศษ อัตราครองเตียงลดจาก 67% เป็น 64% (น.93–96)'
  };
  function revenueChart(){
    const W=640,H=310,left=60,base=259,top=30,max=120000,bar=58,step=108,start=95;
    let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="รายได้รวม BDMS 5 ปี หน่วยล้านบาท"><title>รายได้รวม BDMS ปี2564–2568</title>`;
    for(const val of [0,30000,60000,90000,120000]){const y=base-val/max*(base-top);s+=`<line x1="${left}" x2="628" y1="${y}" y2="${y}" stroke="#2a3e55" stroke-width="1"/><text x="${left-8}" y="${y+4}" text-anchor="end">${val===0?'0':fmt(val/1000,0)+'k'}</text>`;}
    rows.forEach((r,i)=>{
      const x=start+i*step,totalH=r.total/max*(base-top);let y=base;
      s+=`<g data-year="${r.year}" role="button" tabindex="0" aria-label="เลือกปี ${r.year} รายได้รวม ${fmt(r.total)} ล้านบาท"><title>${r.year}: ${fmt(r.total)} ล้านบาท | ${pct(r.revenue_yoy_pct)}</title>`;
      for(const [key,color] of [['healthcare','#579de8'],['goods','#e7c571'],['other','#93a4ba']]){const h=r[key]/max*(base-top);y-=h;s+=`<rect x="${x}" y="${y}" width="${bar}" height="${h}" fill="${color}"/>`;}
      if(r.year===selected)s+=`<rect class="selected-outline" x="${x-5}" y="${base-totalH-6}" width="${bar+10}" height="${totalH+12}" rx="4"/>`;
      s+=`<text class="value" x="${x+bar/2}" y="${base-totalH-14}" text-anchor="middle">${fmt(r.total)}</text><text class="year-label" x="${x+bar/2}" y="285" text-anchor="middle">${r.year}</text></g>`;
    });return s+'</svg><div class="revenue-mobile">'+rows.map(r=>`<button type="button" data-year="${r.year}" aria-pressed="${r.year===selected}"><span class="mobile-revenue-label"><span>${r.year}</span><b>${fmt(r.total)}</b><small>${pct(r.revenue_yoy_pct)}</small></span><span class="mobile-revenue-track"><span class="mobile-revenue-stack" style="width:${r.total/120000*100}%"><i style="width:${r.healthcare/r.total*100}%;background:#579de8"></i><i style="width:${r.goods/r.total*100}%;background:#e7c571"></i><i style="width:${r.other/r.total*100}%;background:#93a4ba"></i></span></span></button>`).join('')+'</div>';
  }
  function networkChart(){
    const W=560,H=330,left=42,right=505,base=280,top=45,bar=43,start=73,step=96;
    const hy=v=>base-v/70*(base-top),by=v=>base-v/10000*(base-top);
    let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="กราฟโรงพยาบาลและเตียงสิ้นปี 2564 ถึง 2568 แท่งใช้แกนซ้าย เส้นใช้แกนขวา"><title>โรงพยาบาลและเตียง ณ สิ้นปี · หน่วยต่างกัน ใช้สองแกน</title><text x="${left}" y="18" class="axis-unit">แห่ง</text><text x="${right+7}" y="18" class="axis-unit bed-axis">เตียง</text>`;
    for(const v of [0,20,40,60]){const y=hy(v);s+=`<line x1="${left}" x2="${right}" y1="${y}" y2="${y}" stroke="#2a3e55"/><text x="${left-9}" y="${y+5}" text-anchor="end">${v}</text>`;}
    for(const v of [0,2500,5000,7500,10000])s+=`<text class="bed-axis" x="${right+7}" y="${by(v)+5}">${v===0?'0':fmt(v/1000,1)+'k'}</text>`;
    rows.forEach((r,i)=>{const x=start+i*step,y=hy(r.hospitals);s+=`<g data-year="${r.year}" role="button" tabindex="0" aria-label="เลือกปี ${r.year} โรงพยาบาล ${r.hospitals} แห่ง เตียง ${fmt(r.beds,0)} เตียง"><title>${r.year}: ${r.hospitals} แห่ง | ${fmt(r.beds,0)} เตียง</title><rect x="${x-bar/2}" y="${y}" width="${bar}" height="${base-y}" fill="#579de8" rx="4"/>${r.year===selected?`<rect class="selected-outline" x="${x-bar/2-5}" y="${y-5}" width="${bar+10}" height="${base-y+10}" rx="4"/>`:''}<text class="hospital-combo-label" x="${x}" y="${y+25}" text-anchor="middle">${r.hospitals}</text><text class="year-label" x="${x}" y="310" text-anchor="middle">${r.year}</text></g>`;});
    s+=`<path class="bed-series" d="${rows.map((r,i)=>(i?'L':'M')+(start+i*step)+','+by(r.beds)).join(' ')}" fill="none" stroke="#e7c571" stroke-width="3" pointer-events="none"/>`;
    rows.forEach((r,i)=>{const x=start+i*step,y=by(r.beds);s+=`<g data-year="${r.year}" role="button" tabindex="0" aria-label="เลือกจำนวนเตียงปี ${r.year} ${fmt(r.beds,0)} เตียง"><title>${r.year}: ${fmt(r.beds,0)} เตียง</title><circle cx="${x}" cy="${y}" r="${r.year===selected?6:4}" fill="#e7c571" stroke="#0d1c30" stroke-width="2"/><text class="bed-value" x="${x}" y="${y-12}" text-anchor="middle">${fmt(r.beds,0)}</text></g>`;});
    return s+'</svg>';
  }
  function mixChart(a,b,colorA,colorB,labelA,labelB){
    return rows.map(r=>`<button type="button" class="mixrow" data-year="${r.year}" aria-pressed="${r.year===selected}" aria-label="ปี ${r.year} ${labelA} ${r[a]}% ${labelB} ${r[b]}%"><span>${r.year}</span><span class="mixbar"><span style="width:${r[a]}%;background:${colorA}">${r[a]}%</span><span style="width:${r[b]}%;background:${colorB}">${r[b]}%</span></span></button>`).join('');
  }
  function locations(){
    const all=$('all-locations').checked;
    const items=payload.locations.filter(r=>all||r.year===selected);
    if(!items.length){$('location-list').innerHTML='<p class="empty">ปี 2564 เป็นปีฐานของการเปรียบเทียบนี้ ไม่ได้สรุปว่าปีนั้นไม่มีการเปิดโรงพยาบาลใหม่</p>';return;}
    $('location-list').innerHTML='<div class="locationgrid">'+items.map(r=>{
      const roster=r.status==='appeared_in_roster';
      return `<article class="locationcard"><span class="status ${roster?'roster':''}">${r.year} · ${roster?'รายชื่อปรากฏเพิ่ม':'เปิดบริการตามรายงาน'}</span><h3>${esc(r.name)}</h3><span class="province">${esc(r.province)} · ${esc(r.area)}</span><p>${esc(r.opened||'ยังไม่ยืนยันวันเริ่มเปิดครั้งแรก')}</p><p>${esc(r.notes)}</p><span class="source-text">ที่มา: One Report ${r.report}</span></article>`;
    }).join('')+'</div>';
  }
  function pipelineRef(r){
    const src=payload.pipeline.sources[r.source];
    return `<span class="source-text">ที่มา: ${esc(src.title)}</span><small>${esc(src.date)}</small>`;
  }
  function pipeline(){
    const p=payload.pipeline;if(!p||!$('pipeline-list'))return;
    for(const button of document.querySelectorAll('[data-pipeline-filter]'))button.setAttribute('aria-pressed',String(button.dataset.pipelineFilter===pipelineFilter));
    const items=p.items.filter(r=>pipelineFilter==='all'||r.state===pipelineFilter);
    const years=[...new Set(items.map(r=>r.year))].sort((a,b)=>a-b);
    $('pipeline-list').innerHTML=years.map(y=>`<div class="pipeline-year"><div class="pipeline-year-label"><b>${y}</b><span>${y===2569?'เปิดส่วนขยายแล้ว':'ปีเป้าหมาย'}</span></div><div class="pipeline-year-cards">${items.filter(r=>r.year===y).map(r=>{
      const refs=r.id==='wellera-2030'?[r.refs.find(x=>x.source==='wellera'&&x.page===21),...r.refs.filter(x=>!(x.source==='wellera'&&x.page===21))]:r.refs;
      return `<article class="pipeline-card ${r.state}"><span class="status ${r.state==='future'?'roster':''}">${esc(r.kind)}</span><h3>${esc(r.name)}</h3><p class="pipeline-place">${esc(r.location)}</p><p class="pipeline-capacity">${esc(r.capacity)}</p><span class="pipeline-status">${esc(r.status)}</span><p>${esc(r.detail)}</p><p class="pipeline-impact">${esc(r.impact)}</p><div class="pipeline-ref">${pipelineRef(refs[0])}</div>${refs.length>1?`<details class="pipeline-extra-sources"><summary>แหล่งอ้างอิงเพิ่มเติม ${refs.length-1} รายการ</summary>${refs.slice(1).map(x=>'<div class="pipeline-ref">'+pipelineRef(x)+'</div>').join('')}</details>`:''}</article>`;
    }).join('')}</div></div>`).join('');
    $('wellera-timeline').innerHTML=p.wellera_milestones.map(r=>`<article><b>${esc(r.period)}</b><strong>${esc(r.name)}</strong><small>${esc(r.status)}</small></article>`).join('');
  }
  function render(){
    const r=rows.find(r=>r.year===selected);
    $('year-tabs').innerHTML=yearButtons();
    const kpis=[
      ['รายได้รวม',fmt(r.total),'ล้านบาท',r.revenue_yoy_pct===null?'ปีฐานของชุดเปรียบเทียบ':pct(r.revenue_yoy_pct)+' จากปีก่อน'],
      ['รายได้ค่ารักษาพยาบาล',fmt(r.healthcare),'ล้านบาท',fmt(r.hospital_share)+'% ของรายได้รวม'],
      ['โรงพยาบาลในเครือรวม',r.hospitals,'แห่ง',r.hospital_net_add===null?'ปีฐานของชุดเปรียบเทียบ':`เพิ่มสุทธิ ${r.hospital_net_add} แห่ง / ${pct(r.hospital_yoy_pct)}`],
      ['รายได้จากผู้ป่วยต่างชาติ',r.foreign,'%',`ไทย ${r.thai}% / ต่างชาติ ${r.foreign}% ของค่ารักษาพยาบาล`]
    ];
    $('kpis').innerHTML=kpis.map(([label,value,unit,note])=>`<article class="kpi"><p class="kpi-label">${label} · ${r.year}</p><p class="kpi-value">${value}<small>${unit}</small></p><p class="kpi-note">${note}</p></article>`).join('');
    $('revenue-chart').innerHTML=revenueChart();$('network-chart').innerHTML=networkChart();
    $('network-total').innerHTML=`<div><span>โรงพยาบาล · สิ้นปี ${r.year}</span><strong>${r.hospitals}<small>แห่ง</small></strong><small>${r.hospital_net_add===null?'ปีฐาน':`+${r.hospital_net_add} แห่ง / ${pct(r.hospital_yoy_pct)}`}</small></div><div class="network-total-beds"><span>เตียง · สิ้นปี ${r.year}</span><strong>${fmt(r.beds,0)}<small>เตียง</small></strong><small>${r.beds_net_add===null?'ปีฐาน':`+${fmt(r.beds_net_add,0)} เตียง / ${pct(r.beds_yoy_pct)}`}</small></div>`;
    $('bed-year-detail').innerHTML=ref(r.beds_report,r.beds_page,`จำนวนเตียงปี ${r.year}`)+`<span>จำนวนเตียงตามตารางเครือโรงพยาบาล / ภาพรวมธุรกิจ ไม่ใช่เตียงที่มีผู้ป่วยใช้จริง · เส้นเตียงเป็นข้อมูลรายงานจริง ไม่รวมเป้าปี 2570</span>`;

    $('revenue-growth').innerHTML=rows.map(x=>`<div>${pct(x.revenue_yoy_pct)}<span>${x.year} · รายได้ YoY</span></div>`).join('');
    $('network-growth').innerHTML=rows.map(x=>`<div>${x.hospital_net_add===null?'ปีฐาน':`+${x.hospital_net_add} แห่ง`}<span>${x.hospital_yoy_pct===null?'—':pct(x.hospital_yoy_pct)}</span></div>`).join('');
    $('geography-chart').innerHTML=mixChart('bangkok','outside','#579de8','#e7c571','กรุงเทพฯและปริมณฑล','นอกกรุงเทพฯ');
    $('nationality-chart').innerHTML=mixChart('thai','foreign','#579de8','#65d0b3','ชาวไทย','ชาวต่างชาติ');
    $('detail-title').textContent=`โครงสร้างรายได้ปี ${r.year}`;
    $('detail-breakdown').innerHTML=[['ค่ารักษาพยาบาล','healthcare','hospital_share','#579de8'],['ขายสินค้า','goods','goods_share','#e7c571'],['รายได้อื่นรวม','other','other_share','#93a4ba']].map(([label,k,share,color])=>`<article style="border-color:${color}"><p>${label}</p><strong>${fmt(r[k])}</strong><small>ล้านบาท · ${fmt(r[share])}% ของรายได้รวม</small></article>`).join('');
    $('detail-comment').innerHTML='<p>'+esc(narratives[r.year])+'</p>';
    $('selection-announcement').textContent=`แสดงรายละเอียดปี ${r.year} รายได้รวม ${fmt(r.total)} ล้านบาท โรงพยาบาล ${r.hospitals} แห่ง`;
    locations();pipeline();
  }
  function activate(el){const y=Number(el.dataset.year);if(!rows.some(r=>r.year===y)||y===selected)return;const focused=document.activeElement===el;selected=y;render();if(focused)$('year-tabs').querySelector(`[data-year="${selected}"]`).focus({preventScroll:true});}
  document.getElementById('approved-public-content').addEventListener('click',e=>{const filter=e.target.closest('[data-pipeline-filter]');if(filter){pipelineFilter=filter.dataset.pipelineFilter;pipeline();return;}const el=e.target.closest('[data-year]');if(el)activate(el);});
  document.getElementById('approved-public-content').addEventListener('keydown',e=>{const el=e.target.closest('svg [data-year]');if(el&&['Enter',' '].includes(e.key)){e.preventDefault();activate(el);}});
  $('all-locations').addEventListener('change',locations);
  render();
})();