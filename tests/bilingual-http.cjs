const {test}=require('node:test');
const assert=require('node:assert/strict');
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3128';
const pairs=['','/portfolio','/contact','/services','/services/business-plan','/services/feasibility-study','/services/strategic-planner-business-strategy'];
for(const path of pairs){test(`paired HTML and SEO: ${path||'/'}`,async()=>{
 for(const lang of ['th','en']){
  const route=lang==='en'?'/en'+path:(path||'/');const res=await fetch(base+route);assert.equal(res.status,200);const html=await res.text();
  assert.match(html,new RegExp(`<html[^>]*lang="${lang}"`));assert.equal((html.match(/<h1[\s>]/g)||[]).length,1);
  const normalise=s=>s.replace(/\/$/,'');
  const canonical='https://www.dap.co.th'+route;assert.equal(normalise(html.match(/<link rel="canonical" href="([^"]+)"/)[1]),normalise(canonical));
  const th='https://www.dap.co.th'+(path||'/'),en='https://www.dap.co.th/en'+path;
  assert.equal(normalise(html.match(/hrefLang="th" href="([^"]+)"/)[1]),normalise(th));assert.equal(normalise(html.match(/hrefLang="en" href="([^"]+)"/)[1]),normalise(en));
 }
});}
test('untranslated English service must not masquerade as English',async()=>{assert.equal((await fetch(base+'/en/services/not-translated')).status,404)});
test('existing routes retained',async()=>{for(const path of ['/contact','/portfolio','/products'])assert.equal((await fetch(base+path)).status,200)});
