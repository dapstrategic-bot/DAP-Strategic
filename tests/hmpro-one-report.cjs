const assert=require('node:assert/strict');
const base=process.env.BASE_URL||'http://127.0.0.1:8790';
async function read(path){const response=await fetch(base+path);assert.equal(response.status,200,path);return response.text();}
(async()=>{
 const path='/dongfunda/one-report/hmpro';const html=await read(path);
 assert.ok(html.includes('rel="canonical" href="https://www.dap.co.th'+path+'"'));
 if(process.env.EXPECT_LOCAL_PREVIEW==='true')assert.match(html,/<meta name="robots" content="noindex, nofollow"/);
 else assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(html));
 assert.match(html,/<title>HMPRO สรุป One Report 2564–2568/);
 for(const value of ['70,569.77','65,955.18','6,011.39','133'])assert.ok(html.includes(value),'server-rendered '+value);
 assert.match(html,/<section[^>]*id="kpis"[^>]*><article/);
 for(const id of ['revenue-chart','profit-chart','branch-chart'])assert.match(html,new RegExp('<div id="'+id+'"[^>]*><svg'));
 for(const year of [2564,2565,2566,2567,2568])assert.ok(html.includes('data-year="'+year+'"'));
 assert.ok(!/LOCAL MOCKUP|127\.0\.0\.1:8789/.test(html));
 assert.ok(!/<a[^>]+(?:download|href="[^"]+\.(?:csv|pdf))/.test(html));
 assert.ok(html.includes('https://www.youtube.com/channel/UCXwMXJiAI_oJKiBB7UC8v0Q/join'));
 const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 assert.ok(schemas.some(s=>s['@graph']?.some(n=>n.tickerSymbol==='SET:HMPRO')));
 const library=await read('/dongfunda/one-report');
 for(const id of ['bdms-card','hmpro-card'])assert.ok(library.includes('id="'+id+'"'));
 assert.ok(library.includes('href="'+path+'"'));
 assert.ok(library.includes('value="retail"'));
 assert.ok(!library.includes('ขณะนี้มีข้อมูลเฉพาะ BDMS'));
 for(const file of ['/sitemap-core.xml','/sitemap-pages.xml'])assert.ok((await read(file)).includes('https://www.dap.co.th'+path));
 const bdms=await read('/dongfunda/one-report/bdms');assert.ok(bdms.includes('113,272.5'));assert.ok(bdms.includes('data-year="2564"'));
 for(const file of ['data.js','dashboard.js','dashboard.css'])await read('/dongfunda-assets/r04/hmpro/'+file);
 console.log('PASS HMPRO raw content, metadata, directory, both sitemaps, assets and BDMS regression');
})().catch(error=>{console.error(error);process.exit(1);});
