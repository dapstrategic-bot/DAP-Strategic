(()=>{
'use strict';
const rows=window.CPALL_DATA,$=id=>document.getElementById(id),f=(v,n=0)=>Number(v).toLocaleString('en-US',{minimumFractionDigits:n,maximumFractionDigits:n});
const q=Number(new URLSearchParams(location.search).get('year'));let year=rows.some(r=>r.year===q)?q:2568;
const colors=['#739dde','#dfc67e','#71d5bd'];
const delta=v=>v===null?'ปีฐานสำหรับเปรียบเทียบ':`${v>=0?'+':''}${f(v,2)}% จากปีก่อน`;
const mark=(x,y)=>`<g class="watermark" aria-hidden="true" pointer-events="none"><svg x="${x-24}" y="${y-34}" width="48" height="36" viewBox="234 469 1533 1063"><image href="/dongfunda-assets/r04/cpall/watermark.png" width="2001" height="2001"/></svg><text x="${x}" y="${y+21}" text-anchor="middle">DongFunda</text></g>`;
function chart(key,max,label,unit){
 const base=272,top=48,step=94,width=52,x0=60;
 let svg=`<svg viewBox="0 0 580 325" role="img" aria-label="${label} CPALL เต็มปี 2564–2568 หน่วย ${unit} เน้นปี ${year}"><title>${label} CPALL เต็มปี 2564–2568 · เน้นปี ${year}</title>`;
 for(let i=0;i<=4;i++){const value=max*i/4,y=base-(base-top)*i/4;svg+=`<line x1="${x0}" x2="565" y1="${y}" y2="${y}" stroke="#364357"/><text x="${x0-10}" y="${y+5}" fill="#adbbcf" font-size="12" text-anchor="end">${f(value)}</text>`;}
 rows.forEach((d,i)=>{const x=x0+25+i*step,h=d[key]/max*(base-top),selected=d.year===year;svg+=`<rect x="${x}" y="${base-h}" width="${width}" height="${h}" rx="5" fill="${selected?'#dfc67e':'#739dde'}"/><text x="${x+width/2}" y="${base-h-11}" fill="${selected?'#dfc67e':'#f0f3fb'}" font-size="13" font-weight="700" text-anchor="middle">${f(d[key])}</text><text x="${x+width/2}" y="302" fill="${selected?'#dfc67e':'#adbbcf'}" font-size="15" text-anchor="middle">${d.year}</text>`;});
 return svg+mark(310,175)+'</svg>';
}
function operatorChart(){
 const base=330,top=42,max=18000,scale=(base-top)/max;
 const series=[['corporate','ร้านบริษัท','#739dde'],['sbp','Store Business Partner (SBP)','#dfc67e'],['subarea','ผู้รับสิทธิช่วงอาณาเขต','#71d5bd']];
 let s=`<svg viewBox="0 0 920 390" role="img" aria-label="จำนวนร้านแยกผู้ดำเนินการ สิ้นปี 2564 ถึง 2568 เน้นปี ${year}"><title>ร้านบริษัท SBP และผู้รับสิทธิช่วงอาณาเขต ย้อนหลัง 5 ปี · เน้นปี ${year}</title>`;
 for(let v=0;v<=18000;v+=6000){const y=base-v*scale;s+=`<line x1="65" x2="890" y1="${y}" y2="${y}" stroke="#364357"/><text x="55" y="${y+5}" fill="#adbbcf" font-size="13" text-anchor="end">${f(v)}</text>`;}
 s+=mark(480,95);
 rows.forEach((d,i)=>{const x=100+i*160,w=78;let y=base;for(const [key,label,color] of series){const h=d[key]*scale;y-=h;s+=`<rect data-operator="${key}" data-operator-year="${d.year}" x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}"><title>${d.year} · ${label} ${f(d[key])} ร้าน</title></rect><text x="${x+w/2}" y="${y+h/2+4}" fill="#101c2f" font-size="12" font-weight="700" text-anchor="middle">${f(d[key])}</text>`;}if(d.year===year)s+=`<rect x="${x-4}" y="${y-4}" width="${w+8}" height="${base-y+8}" rx="4" fill="none" stroke="#dfc67e" stroke-width="2"/>`;s+=`<text x="${x+w/2}" y="${y-14}" fill="${d.year===year?'#dfc67e':'#f0f3fb'}" font-size="15" font-weight="700" text-anchor="middle">${f(d.branches)}</text><text x="${x+w/2}" y="365" fill="${d.year===year?'#dfc67e':'#adbbcf'}" font-size="16" text-anchor="middle">${d.year}</text>`;});
 return s+'</svg>';
}
function mix(id,items){
 $(id).innerHTML='<div class="stack" aria-hidden="true">'+items.map((v,i)=>`<span style="width:${v[1]}%;background:${colors[i]}"></span>`).join('')+'</div>'+items.map((v,i)=>`<div class="mix-row"><i style="background:${colors[i]}"></i><span>${v[0]}<small>${v[2]||''}</small></span><span class="amount"><b>${f(v[1],1)}%</b></span></div>`).join('')+'<div class="mix-credit" aria-hidden="true"><svg viewBox="234 469 1533 1063"><image href="/dongfunda-assets/r04/cpall/watermark.png" width="2001" height="2001"/></svg>DongFunda</div>';
}
function render(){
 const d=rows.find(r=>r.year===year),first=rows[0],last=rows.at(-1);
 $('year-tabs').innerHTML=rows.map(r=>`<button type="button" data-year="${r.year}" aria-pressed="${r.year===year}">${r.year}</button>`).join('');
 document.querySelectorAll('[data-year]').forEach(b=>b.addEventListener('click',()=>{year=Number(b.dataset.year);render();}));
 $('selection-announcement').textContent=`กำลังดูรายละเอียดเต็มปี ${year}`;
 const cards=[['รายได้รวมของกลุ่ม',d.revenue,'ล้านบาท',delta(d.revenue_yoy),d.revenue_yoy],['กำไรสุทธิส่วนของบริษัทใหญ่',d.profit,'ล้านบาท',delta(d.profit_yoy),d.profit_yoy],['7-Eleven ในประเทศไทย',d.branches,'ร้าน ณ สิ้นปี',d.branch_change===null?'จำนวนสาขาสิ้นปี':`เพิ่มสุทธิ ${f(d.branch_change)} ร้านจากปีก่อน`,null],['อาหารและเครื่องดื่ม',d.food_pct,'% ของยอดขายสินค้า','เฉพาะธุรกิจร้านสะดวกซื้อ',null]];
 $('kpis').innerHTML=cards.map((v,i)=>`<article class="kpi"><h3>${v[0]} · ${year}</h3><div class="value">${f(v[1],i===3?1:0)} <small>${v[2]}</small></div><p class="delta ${v[4]<0?'negative':''}">${v[3]}</p></article>`).join('');
 $('five-year-insight').innerHTML=`รายได้รวม <b>+${f((last.revenue/first.revenue-1)*100,1)}%</b> · สาขาไทย <b>${f(first.branches)} → ${f(last.branches)} ร้าน</b> · กำไรสุทธิ <b>+${f((last.profit/first.profit-1)*100,1)}%</b><span>เทียบปี 2564 กับ 2568 · รายได้เพิ่มมีทั้งผลของการฟื้นตัวและการรวม Lotus’s จึงไม่ใช่การเติบโตของร้านเดิมทั้งหมด</span>`;
 $('revenue-chart').innerHTML=chart('revenue',1200000,'รายได้รวม','ล้านบาท');
 $('profit-chart').innerHTML=chart('profit',32000,'กำไรสุทธิส่วนของบริษัทใหญ่','ล้านบาท');
 $('branch-chart').innerHTML=chart('branches',20000,'จำนวนร้าน 7-Eleven ในไทย ณ สิ้นปี','ร้าน');
 $('operator-chart').innerHTML=operatorChart();
 $('operator-period').textContent=`สิ้นปี 2564–2568 · หน่วย: ร้าน · กรอบสีทองคือปี ${year}`;
 $('operator-growth').innerHTML=[['ร้านบริษัท','corporate'],['Store Business Partner (SBP)','sbp'],['ผู้รับสิทธิช่วงอาณาเขต','subarea']].map(([label,key])=>{const change=last[key]-first[key],pctChange=(last[key]/first[key]-1)*100,direction=change>0?'increase':change<0?'decrease':'unchanged',notable=Math.abs(pctChange)>=20;return `<article class="operator-change ${direction}${notable?' notable':''}"><div class="operator-change-head"><p>${label}</p>${notable?`<span class="change-badge">${change>0?'↑ เพิ่มเด่น':'↓ ลดเด่น'}</span>`:''}</div><strong>${f(first[key])} → ${f(last[key])}</strong><div class="change-metric">${change>0?'↑ เพิ่ม':change<0?'↓ ลด':'คงเดิม'} ${f(Math.abs(change))} ร้าน <b>(${change>0?'+':''}${f(pctChange,1)}%)</b></div><small>เทียบสิ้นปี 2564 กับ 2568</small></article>`;}).join('');
 document.querySelectorAll('.selected-label').forEach(n=>n.textContent=`เต็มปี ${year} · เปลี่ยนตามปีที่เลือก`);
 mix('total-mix',[['ร้านสะดวกซื้อ',d.cvs_pct,'7-Eleven'],['ค้าส่ง ค้าปลีก และศูนย์การค้า',d.wholesale_pct,'กลุ่ม Makro / Lotus’s'],['ธุรกิจอื่นในประเทศไทย',d.other_pct,'ธุรกิจสนับสนุนและบริการอื่น']]);
 mix('product-mix',[['อาหารและเครื่องดื่ม',d.food_pct],['สินค้าอุปโภค',d.nonfood_pct]]);
 $('mix-year-note').textContent=year===2564?'ปี 2564 ฐานสัดส่วนกลุ่มธุรกิจไม่รวมกำไรจากการขายเงินลงทุนและการซื้อธุรกิจเป็นขั้นตามหมายเหตุในรายงาน ส่วนสินค้าอุปโภคปี 2564–2565 ไม่รวมบัตรโทรศัพท์':year===2565?'สินค้าอุปโภคปี 2565 ไม่รวมบัตรโทรศัพท์ ตามนิยามในรายงาน':'';
 $('network-summary').innerHTML=`<div><p>7-Eleven ประเทศไทย · สิ้นปี ${year}</p><strong>${f(d.branches)}<small>ร้าน</small></strong><span class="net-growth">${d.branch_change===null?'ปีฐานสำหรับเปรียบเทียบ':`เพิ่มสุทธิ ${f(d.branch_change)} ร้านจากปีก่อน`}</span></div><div class="country"><p>บริษัทดำเนินการเอง<b>${f(d.corporate)} ร้าน</b></p><p>SBP + ผู้รับสิทธิช่วง<b>${f(d.sbp+d.subarea)} ร้าน</b></p></div>`;
 $('branch-heading').textContent=`แยกตามผู้ดำเนินการ · สิ้นปี ${year}`;
 $('branch-detail').innerHTML='<div class="branch-list">'+[['ร้านบริษัท',d.corporate],['Store Business Partner (SBP)',d.sbp],['ผู้รับสิทธิช่วงอาณาเขต',d.subarea]].map(v=>`<div class="branch-row"><span>${v[0]}</span><b>${f(v[1])} ร้าน</b></div>`).join('')+`<div class="branch-row"><span>รวมประเทศไทย</span><b class="selected-year">${f(d.branches)} ร้าน</b></div></div>`;
 const ops=[['ยอดขายเฉลี่ย / ร้าน / วัน',f(d.daily_sales),'บาท'],['ยอดซื้อต่อบิลโดยประมาณ',f(d.ticket),'บาท / บิล'],['ลูกค้าเฉลี่ย / ร้าน / วัน',f(d.customers),'คน'],['ยอดขายร้านเดิม (SSSG)',d.sssg===null?'ใกล้เคียงปีก่อน':(d.sssg>=0?'+':'')+f(d.sssg,1)+'%',d.sssg===null?'ตามคำอธิบายในรายงาน':'เทียบปีก่อน']];
 $('operations-kpis').innerHTML=ops.map(v=>`<article><p>${v[0]}</p><strong${v[1]==='ใกล้เคียงปีก่อน'?' style="font-size:21px"':''}>${v[1]}</strong><small>${v[2]}</small></article>`).join('');
 $('operations-note').textContent=`เต็มปี ${year} · ยอดขายสินค้าและบริการของธุรกิจร้านสะดวกซื้อ ${f(d.cvs_sales)} ล้านบาท เป็นคนละฐานกับรายได้รวมของกลุ่ม · ตัวเลขค่าเฉลี่ยในรายงานมีการปัดเศษ จึงไม่ควรนำยอดซื้อต่อบิลคูณจำนวนลูกค้าเพื่อสร้างรายได้รวมใหม่`;
 $('selected-story').innerHTML=`<b>${year}</b><p>${d.narrative}</p>`;
 $('timeline').innerHTML=rows.map(r=>`<article class="${year===r.year?'selected':''}"><b>${r.year}</b><h3>${r.title}</h3><p>${r.year===2564?'เริ่มรวม Lotus’s ช่วงปลายปี':r.year===2565?'รับรู้ Lotus’s ครบปี · SSSG +15.9%':r.year===2566?'เพิ่มสาขาไทยสุทธิ 707 ร้าน':r.year===2567?'อาหารและเครื่องดื่ม 76.0%':'ไทย 15,945 ร้าน · อาหารและเครื่องดื่ม 76.3%'}</p></article>`).join('');
 window.CPALL_DASHBOARD_STATE={year,rows:rows.length,revenue:d.revenue,profit:d.profit,branches:d.branches,food_pct:d.food_pct};
}
render();
const header=document.querySelector('.topbar');
function syncHeader(){document.documentElement.style.setProperty('--header-height',Math.ceil(header.getBoundingClientRect().height)+'px');}
if(typeof ResizeObserver!=='undefined')new ResizeObserver(syncHeader).observe(header);
syncHeader();
})();
