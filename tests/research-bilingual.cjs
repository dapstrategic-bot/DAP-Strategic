const assert=require('node:assert/strict');
const base=process.env.BASE_URL||'http://127.0.0.1:8796';
const paths=['one-report','one-report/bdms','one-report/hmpro','one-report/cpall','financial-statements','financial-statements/bdms'];
async function read(path){const res=await fetch(base+path);assert.equal(res.status,200,path);return res.text();}
(async()=>{
 const core=await read('/sitemap-core.xml'),pages=await read('/sitemap-pages.xml');
 for(const locale of ['th','en'])for(const path of paths){
  const route=(locale==='en'?'/en':'')+'/dongfunda/'+path;
  const html=await read(route);
  assert.match(html,new RegExp('<html[^>]*lang="'+locale+'"'));
  assert.ok(html.includes('rel="canonical" href="https://www.dap.co.th'+route+'"'),route+' canonical');
  for(const language of ['th','en'])assert.ok(html.includes('hrefLang="'+language+'"')||html.includes('hreflang="'+language+'"'),route+' alternate '+language);
  assert.ok(html.includes('data-locale="th"'));assert.ok(html.includes('data-locale="en"'));
  assert.ok(!html.includes('MOCKUP R01'));
  if(process.env.EXPECT_LOCAL_PREVIEW!=='true')assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(html),route+' indexable');
  const root=html.match(/<div[^>]+id="(?:approved-public-content|financial-public-content)"[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(root,route+' visible content');
  if(locale==='en'){
   assert.ok(!/เข้าใจธุรกิจ|เลือกปีเพื่อดูรายละเอียด|เลือกช่วงงบที่ต้องการดู|ค้นหาหุ้นหรือบริษัท/.test(root),route+' English first-load content');
   assert.ok(root.includes(path.includes('financial-statements')?'Financial Statements':'One Report'));
  }
  const data=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  assert.ok(data.some(d=>d['@graph']?.some(n=>n.inLanguage===(locale==='en'?'en-US':'th-TH')&&n.url==='https://www.dap.co.th'+route)),route+' schema');
  for(const sitemap of [core,pages])assert.ok(sitemap.includes('https://www.dap.co.th'+route),route+' sitemap');
  if(path.startsWith('one-report/'))for(const year of [2564,2565,2566,2567,2568])assert.ok(root.includes('data-year="'+year+'"'),route+' year '+year);
  if(path==='financial-statements/bdms')for(const value of ['113,385.9','15,848.2','60,172.9'])assert.ok(root.includes(value),route+' value '+value);
 }
 const chart=await read('/dongfunda-assets/financial-statements/financial-chart.js');
 assert.ok(chart.includes("dataURL:'/images/dongfunda-chart-watermark.png'"));
 await read('/dongfunda-assets/shared/research-language.css');
 console.log('PASS 12 bilingual routes, server content, metadata, hreflang, schemas, sitemaps, selectors and source values');
})().catch(error=>{console.error(error);process.exit(1)});
