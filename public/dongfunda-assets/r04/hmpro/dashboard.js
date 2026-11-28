(()=>{
'use strict';
const rows=window.HMPRO_DATA,$=id=>document.getElementById(id),f=(x,n=1)=>Number(x).toLocaleString('en-US',{minimumFractionDigits:n,maximumFractionDigits:n});
const query=Number(new URLSearchParams(location.search).get('year'));let year=rows.some(d=>d.year===query)?query:2568;
const colors=['#739dde','#dfc67e','#71d5bd','#b3a1e0','#93a4ba'];
const pct=v=>v===null?'ปีฐาน 2564':`${v>=0?'+':''}${f(v,2)}% จากปีก่อน`;
const watermark=(x,y)=>`<g class="watermark" aria-hidden="true" pointer-events="none"><svg x="${x-24}" y="${y-35}" width="48" height="36" viewBox="234 469 1533 1063"><image href="/images/dongfunda-chart-watermark.png" width="2001" height="2001"/></svg><text x="${x}" y="${y+21}" text-anchor="middle">DongFunda</text></g>`;
function barChart(key,max,ticks,label,integer=false){
const base=272,top=45,W=580,H=325,x0=60,plot=495,step=94,width=52;
let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label} เต็มปี 2564–2568"><title>${label} HMPRO เต็มปี 2564–2568</title>`;
for(let i=0;i<=ticks;i++){const val=max*i/ticks,y=base-(base-top)*i/ticks;s+=`<line x1="${x0}" x2="565" y1="${y}" y2="${y}" stroke="#364357"/><text x="${x0-10}" y="${y+5}" fill="#adbbcf" font-size="13" text-anchor="end">${f(val,0)}</text>`;}
rows.forEach((d,i)=>{const x=x0+25+i*step,h=d[key]/max*(base-top),sel=d.year===year;s+=`<rect x="${x}" y="${base-h}" width="${width}" height="${h}" rx="5" fill="${sel?'#dfc67e':'#739dde'}"/><text x="${x+width/2}" y="${base-h-11}" fill="${sel?'#dfc67e':'#f0f3fb'}" font-size="15" font-weight="700" text-anchor="middle">${f(d[key],integer?0:1)}</text><text x="${x+width/2}" y="302" fill="${sel?'#dfc67e':'#adbbcf'}" font-size="15" text-anchor="middle">${d.year}</text>`;});
s+=watermark(310,150);
return s+'</svg>';
}
function mix(target,items,base){
$(target).innerHTML='<div class="stack" aria-hidden="true">'+items.map((d,i)=>`<span style="width:${d[1]/base*100}%;background:${colors[i]}"></span>`).join('')+'</div>'+items.map((d,i)=>`<div class="mix-row"><i style="background:${colors[i]}"></i><span>${d[0]}<small>${d[2]||''}</small></span><span class="amount"><b>${f(d[1]/base*100,2)}%</b><small>${f(d[1],2)} ล้านบาท</small></span></div>`).join('')+'<div class="mix-credit" aria-hidden="true"><svg viewBox="234 469 1533 1063"><image href="/images/dongfunda-chart-watermark.png" width="2001" height="2001"/></svg>DongFunda</div>';
}
const stories=[['ปรับตัวผ่าน COVID-19','ออนไลน์และบริการเรื่องบ้านช่วยรองรับพฤติกรรมลูกค้าที่เปลี่ยนไป'],['รายได้ขยายตัว','รายได้รวมเพิ่ม และเครือข่ายรวม 117 สาขา'],['เพิ่ม MegaHome และ Hybrid','126 สาขารวม · Hybrid 2 แห่ง'],['เร่งรูปแบบ Hybrid','129 สาขารวม · Hybrid 7 แห่ง'],['เครือข่ายใหญ่ขึ้น','133 สาขารวม · Hybrid 14 แห่ง']];
function render(){
const d=rows.find(r=>r.year===year);
$('year-tabs').innerHTML=rows.map(r=>`<button type="button" data-year="${r.year}" aria-pressed="${r.year===year}">${r.year}</button>`).join('');
document.querySelectorAll('[data-year]').forEach(b=>b.addEventListener('click',()=>{year=Number(b.dataset.year);render();}));
$('selection-announcement').textContent=`กำลังดูรายละเอียดเต็มปี ${year}`;
const cards=[['รายได้รวม',d.revenue,'ล้านบาท',pct(d.revenue_yoy),d.revenue_yoy],['รายได้สินค้าและบริการ',d.contracts,'ล้านบาท',`${f(d.contracts/d.revenue*100,2)}% ของรายได้รวม`,null],['สาขาในเครือรวม',d.branches,'สาขา',d.branch_change===null?'จำนวนสาขาสิ้นปี':`เพิ่มสุทธิ ${d.branch_change} สาขาจากปีก่อน`,null],['กำไรสุทธิ',d.profit,'ล้านบาท',pct(d.profit_yoy),d.profit_yoy]];
$('kpis').innerHTML=cards.map((v,i)=>`<article class="kpi"><h3>${v[0]} · ${year}</h3><div class="value">${f(v[1],i===2?0:2)} <small>${v[2]}</small></div><p class="delta ${v[4]<0?'negative':''}">${v[3]}</p></article>`).join('');
const first=rows[0],last=rows.at(-1);$('five-year-insight').innerHTML=`รายได้รวม <b>+${f((last.revenue/first.revenue-1)*100,2)}%</b> · สาขา <b>${first.branches} → ${last.branches} แห่ง</b> · กำไรสุทธิ <b>+${f((last.profit/first.profit-1)*100,2)}%</b><span>เปรียบเทียบสิ้นปี 2564 กับ 2568 · จำนวนสาขาที่เพิ่มขึ้น ไม่ได้ทำให้รายได้หรือกำไรเพิ่มขึ้นทุกปี</span>`;
$('revenue-chart').innerHTML=barChart('revenue',80000,4,'รายได้รวม');$('profit-chart').innerHTML=barChart('profit',8000,4,'กำไรสุทธิ');$('branch-chart').innerHTML=barChart('branches',160,4,'จำนวนสาขาสิ้นปี',true);
document.querySelectorAll('.selected-label').forEach(n=>n.textContent=`เต็มปี ${year} · หน่วย: ล้านบาท`);
mix('total-mix',[['สินค้าและบริการ',d.contracts,'รายได้จากสัญญาที่ทำกับลูกค้า'],['ค่าเช่าและบริการพื้นที่',d.rent],['รายได้อื่น',d.other]],d.revenue);
mix('product-mix',[['Hard Line',d.hard,'วัสดุก่อสร้าง อุปกรณ์ปรับปรุงบ้าน และเครื่องใช้ไฟฟ้า'],['Soft Line',d.soft,'เฟอร์นิเจอร์ ของตกแต่ง และของใช้ในบ้าน'],['บริการเรื่องบ้าน',d.service,'Home Service / กลุ่มบริการตามรายงาน'],['บริษัทย่อย',d.subs,'คงเป็นหมวดแยก ไม่แบ่งซ้ำเป็น Hard / Soft']],d.contracts);
$('network-summary').innerHTML=`<div><p>สาขารวม · สิ้นปี ${year}</p><strong>${d.branches}<small>สาขา</small></strong><span class="net-growth">${d.branch_change===null?'ปีฐานสำหรับเปรียบเทียบ':`เพิ่มสุทธิ ${d.branch_change} สาขา / +${f(d.branch_change/rows[rows.indexOf(d)-1].branches*100,2)}%`}</span></div><div class="country"><p>ประเทศไทย<b>${d.thai} สาขา</b></p><p>มาเลเซีย<b>${d.my} สาขา</b></p></div>`;
$('branch-heading').textContent=`แยกสาขาตามรูปแบบ · สิ้นปี ${year}`;
$('branch-detail').innerHTML='<div class="branch-list">'+[['HomePro',d.hp],['HomePro S',d.hps],['MegaHome',d.mega],['Hybrid Store',d.hybrid],['HomePro มาเลเซีย',d.my]].map(v=>`<div class="branch-row"><span>${v[0]}</span><b>${v[1]===null?'<small>ไม่แยกหมวดในรายงาน</small>':v[1]+' สาขา'}</b></div>`).join('')+'</div>';
$('selected-story').innerHTML=`<b>${year}</b><p>${d.narrative}</p>`;
$('timeline').innerHTML=rows.map((r,i)=>`<article class="${year===r.year?'selected':''}"><b>${r.year}</b><h3>${stories[i][0]}</h3><p>${stories[i][1]}</p></article>`).join('');
window.HMPRO_DASHBOARD_STATE={year,rows:rows.length,revenue:d.revenue,branches:d.branches};
}
render();
})();