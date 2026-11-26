import { templates } from './templates';
import {contentHref, contentTopics, safeLink, type DongFundaContent} from '../model';
const esc=(value: unknown)=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
function image(item:DongFundaContent, feature=false){
  const src=safeLink(item.thumbnail?.url);
  if(!src) return '<div class="portrait-cover">DongFunda</div>';
  const portrait=(item.thumbnail?.aspectRatio??2)<1;
  return `<img src="${esc(src)}" alt="${esc(item.thumbnail?.alt||item.title)}" ${feature?'fetchpriority="high"':'loading="lazy"'} style="${portrait?'object-fit:contain;background:#131f33;':''}" />`;
}
export function renderHome(items:DongFundaContent[]){
  const feature=items.find(i=>i.featured)||items[0];
  const articles=items.map(i=>`<article class="article" data-search="${esc([i.title,i.excerpt,...contentTopics(i),...(i.companies||[])].join(' ').toLowerCase())}"><a href="${esc(contentHref(i))}">${image(i)}<div class="article-body"><span>${esc(i.tickers?.[0]||i.primary_topic||'DongFunda')}</span><h3>${esc(i.title)}</h3><p>${esc(i.excerpt)}</p><b>อ่านบทความ</b></div></a></article>`).join('');
  const topics=[...new Set(items.flatMap(contentTopics))];
  const video=feature&&safeLink(feature.video_url);
  const title=feature ? esc(feature.title).replace(/(เจาะธุรกิจ.*)$/, '<em>$1</em>') : '';
  const hero=feature?`<section class="featured wrap"><div class="featured-cover"><a href="${esc(contentHref(feature))}">${image(feature,true)}</a><span class="cover-caption">FEATURED CONTENT / บทวิเคราะห์จากคลิป</span></div><div class="featured-copy"><p class="eyebrow">DONGFUNDA INSIGHT</p><h2>${title}</h2><p>${esc(feature.excerpt)}</p><div class="hero-actions"><a class="btn gold" href="${esc(contentHref(feature))}">อ่านบทความ</a>${video?`<a class="btn outline" href="${esc(video)}" target="_blank" rel="noopener noreferrer">ดูวิดีโอ</a>`:''}</div></div></section>`:'<section class="featured wrap"><h2>บทวิเคราะห์ธุรกิจและสรุป One Report</h2></section>';
  const hub=`<section class="research-hub wrap" aria-labelledby="dongfunda-heading"><h1 id="dongfunda-heading">DongFunda · สรุป One Report และงบการเงินหุ้นไทย</h1><p>เข้าใจธุรกิจจากรายได้ ลูกค้า และแผนขยาย พร้อมเปรียบเทียบงบการเงินรายบริษัท ผ่าน Dashboard ที่เปิดให้ดูได้ฟรี</p><div class="hero-actions"><a class="btn gold" href="/dongfunda/one-report">เลือกหุ้น · สรุป One Report</a><a class="btn outline" href="/dongfunda/financial-statements">เลือกหุ้น · งบการเงิน</a></div></section>`;
  return templates.home.replace('{{FEATURE}}',hub+hero).replace('{{ARTICLES}}',articles).replace('{{TOPICS}}','<button data-topic="">ทั้งหมด</button>'+topics.map(t=>`<button data-topic="${esc(t)}">${esc(t)}</button>`).join(''));
}
