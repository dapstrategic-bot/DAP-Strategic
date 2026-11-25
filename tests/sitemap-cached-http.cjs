const assert=require('node:assert/strict');
const base=process.env.BASE_URL||'http://localhost:8780';
(async()=>{
  const res=await fetch(base+'/sitemap.xml');
  assert.equal(res.status,200);
  assert.match(res.headers.get('content-type'),/application\/xml/);
  const xml=await res.text();
  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
  const locations=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  assert.ok(locations.length>=25, 'Full sitemap, not only static core');
  assert.equal(new Set(locations).size,locations.length,'No duplicate canonical URLs');
  for(const url of locations){const parsed=new URL(url);assert.equal(parsed.origin,'https://www.dap.co.th');assert.ok(!parsed.search&&!parsed.hash);}
  for(const path of ['/dongfunda/one-report','/dongfunda/one-report/bdms','/dongfunda/lh-business-cashflow-valuation','/products/tonrob-2570'])assert.ok(locations.includes('https://www.dap.co.th'+path));
  assert.ok(!res.headers.get('x-robots-tag')?.includes('noindex'));
  const cached=res.headers.get('x-nextjs-cache')||res.headers.get('x-vercel-cache');
  assert.ok(['HIT','STALE','PRERENDER'].includes(cached),`Sitemap must use persistent route cache; observed ${cached}`);
  console.log(JSON.stringify({status:res.status,urls:locations.length,cache:cached,cacheControl:res.headers.get('cache-control')},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
