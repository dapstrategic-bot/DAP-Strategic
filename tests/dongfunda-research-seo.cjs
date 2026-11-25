const assert=require('node:assert/strict');
const base=process.env.BASE_URL||'http://localhost:8780';
(async()=>{
  for(const route of ['/dongfunda/one-report','/dongfunda/one-report/bdms']){
    const response=await fetch(base+route); assert.equal(response.status,200);
    const html=await response.text();
    assert.ok(html.includes(`rel="canonical" href="https://www.dap.co.th${route}"`),'canonical');
    assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(html),'public research is indexable');
    const schema=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
    assert.ok(schema.some(s=>s['@graph']?.some(n=>n['@type']==='BreadcrumbList')),'breadcrumbs');
    assert.ok(!/<a[^>]+(?:download|href="[^"]+\.(?:csv|pdf))/.test(html),'no export links');
    if(route.endsWith('/bdms')){
      assert.match(html,/<section[^>]+id="kpis"[^>]*><article/,'KPI content present before JavaScript');
      assert.match(html,/<div id="revenue-chart"[^>]*><svg/,'revenue SVG present before JavaScript');
      assert.match(html,/<div id="network-chart"[^>]*><svg/,'hospital/bed SVG present before JavaScript');
      assert.match(html,/<div id="pipeline-list"[^>]*>[^<]*</,'pipeline container populated');
      assert.ok(schema.some(s=>s['@graph']?.some(n=>n.about?.tickerSymbol==='SET:BDMS')),'company identification');
      assert.match(html,/<title>BDMS สรุป One Report/);
    }
    console.log('PASS',route);
  }
  const maintenance=await(await fetch(base+'/dongfunda/financial-statements')).text();
  assert.match(maintenance,/<meta name="robots" content="noindex, nofollow"/,'maintenance is noindex');
  for(const file of ['/sitemap-pages.xml','/sitemap-core.xml']){
    const response=await fetch(base+file);assert.equal(response.status,200);
    const xml=await response.text();
    assert.ok(xml.includes('<loc>https://www.dap.co.th/dongfunda/one-report/bdms</loc>'));
  }
  console.log('PASS maintenance and both sitemaps');
})().catch(error=>{console.error(error);process.exit(1)});
