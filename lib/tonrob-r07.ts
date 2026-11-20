import template from '@/data/tonrob-r07-template.json';
import type {TonrobRound} from '@/lib/tonrob';
const esc=(v:unknown)=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function roundMarkup(round:TonrobRound,url:string|null){
 const year=round.name.match(/\d{4}$/)?.[0]??'';
 const name=esc(round.name),title=year?esc(round.name.slice(0,-year.length))+'<span>'+esc(year)+'</span>':name;
 const topics=round.topics.map((t,i)=>'<article><div class="module-icon">'+esc(['ธุรกิจ','งบ','มูลค่า','กราฟ','แผน'][i]||'เรียน')+'</div><div><h3>'+esc(t.title)+'</h3><p>'+esc(t.detail)+'</p><span class="output">'+esc((t as typeof t & {output?:string}).output||'')+'</span></div><span class="module-type">'+esc(['BUSINESS','FINANCIAL','VALUATION','TIMING','WORKSHOP'][i]||'')+'</span></article>').join('');
 const faqs=round.faqs.map(f=>'<details><summary>'+esc(f.question)+'</summary><p>'+esc(f.answer)+'</p></details>').join('');
 const values:Record<string,string>={TITLE:title,NAME:name,YEAR:esc(year),START_YEAR:esc(round.startMonth.match(/\d{4}$/)?.[0]??''),OPENING:esc(round.opening),START:esc(round.startMonth),GOAL:esc(round.goalText),DAYS:esc(round.teachingDays),FORMAT:esc(round.format),POSTER:esc(round.poster),BENEFIT:esc(round.benefit),TOPICS:topics,FAQS:faqs,PRICE:esc(round.price.toLocaleString('th-TH')),ORIGINAL:esc(round.originalPrice.toLocaleString('th-TH')),PAYMENT:esc(url||''),PAYMENT_PRODUCT:esc(round.paymentProduct),LINE:esc(round.lineUrl)};
 let html=template.html.replace(/\{\{([A-Z_]+)\}\}/g,(_,key)=>{if(!(key in values))throw Error('Unknown course template token');return values[key]});
 if(!url){
  html=html.replace(/<dialog[\s\S]*?<\/dialog>/g,'');
  html=html.replace(/<button[^>]*class="[^"]*purchase-open[^"]*"[^>]*>[\s\S]*?<\/button>/g,'<div class="tonrob-closed"><strong>ปิดรับสมัครแล้ว</strong><p><a href="/products/tonrob">ดูรอบล่าสุด</a></p></div>');
 }
 return html;
}

