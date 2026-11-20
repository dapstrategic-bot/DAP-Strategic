const fs=require('node:fs'),path=require('node:path');
function syncXml(xml,rounds) {
 const clean=xml.replace(/\s*<url><loc>https:\/\/www\.dap\.co\.th\/products\/tonrob(?:-[^<]*)?<\/loc>[\s\S]*?<\/url>/g,'');
 const urls=['tonrob',...rounds.filter(r=>r.status!=='draft').map(r=>r.slug)];
 return clean.replace('</urlset>',[...new Set(urls)].map(slug=>'  <url><loc>https://www.dap.co.th/products/'+slug+'</loc></url>').join('\n')+'\n</urlset>');
}
function validate(data) {
 const ids=new Set(),slugs=new Set();
 for(const r of data.rounds){
  if(!r.id||!/^tonrob-[a-z0-9-]+$/.test(r.slug)||ids.has(r.id)||slugs.has(r.slug)) throw Error('Invalid or duplicate course identity');
  ids.add(r.id);slugs.add(r.slug);
  if(!['open','closed','draft'].includes(r.status))throw Error('Invalid round status');
  if(r.status==='draft')continue;
  if(!Number.isFinite(r.price)||r.price<=0||!Number.isFinite(r.originalPrice)||r.originalPrice<r.price||!r.name||!r.startMonth||!r.goalText||!r.topics?.length)throw Error('Incomplete listed round');
  if(r.status==='open' && r.paymentUrl!=='https://pay.sn/dongfunda/'+r.price+'/'+r.paymentProduct)throw Error('Payment link mismatch');
 }
 if(!ids.has(data.currentRoundId))throw Error('Unknown currentRoundId');
}
if(require.main===module){const data=JSON.parse(fs.readFileSync(path.resolve('data/tonrob-rounds.json'),'utf8'));validate(data);const target=path.resolve('public/sitemap-core.xml');const next=syncXml(fs.readFileSync(target,'utf8'),data.rounds);fs.writeFileSync(target,next);console.log('Synced course sitemap: '+data.rounds.filter(r=>r.status!=='draft').length+' listed round(s)');}
module.exports={syncXml,validate};

