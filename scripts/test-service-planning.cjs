const assert = require('node:assert/strict');
const { parse } = require('parse5');
const topics = require('../data/dap-service-planning.json');
const walk = n => [n, ...(n.childNodes || []).flatMap(walk)];
const attr = (n, key) => n.attrs?.find(a => a.name === key)?.value;
const text = n => n.nodeName === '#text' ? n.value : (n.childNodes || []).map(text).join('');
const originalText = n => ['script','style'].includes(n.tagName) || attr(n,'id') === 'new-content' ? '' : n.nodeName === '#text' ? n.value : (n.childNodes || []).map(originalText).join('');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3187';
const baseline = process.env.TEST_BASELINE_URL || 'https://www.dap.co.th';
function metadata(nodes) {
  // Next's font sizing marker differs between dev and production, not page SEO.
  return nodes.filter(n => n.tagName === 'title' || (n.tagName === 'meta' && attr(n,'name') !== 'next-size-adjust') || (n.tagName === 'link' && attr(n, 'rel') === 'canonical') || (n.tagName === 'script' && attr(n, 'type') === 'application/ld+json')).map(n => ({tag:n.tagName, attrs:n.attrs.filter(a => !['nonce'].includes(a.name)).sort((a,b)=>a.name.localeCompare(b.name)), text:text(n)})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
}
(async () => {
  assert.equal(topics.length, 3);
  assert.deepEqual(topics.map(t => t.id), ['DAP-POOL-VILLA-R01', 'DAP-FACTORY-MODEL-R01', 'DAP-BUSINESS-PLAN-PREP-R01']);
  for (const t of topics) {
    assert.equal(t.faq.length, 5);
    assert(t.table.rows.every(row => row.length === t.table.headers.length));
    assert(t.ctas.every(c => /^https:\/\/(www\.dap\.co\.th\/|line\.me\/R\/ti\/p\/@dongfunda$)/.test(c.href)));
  }
  assert(topics[2].copy.some(t => t.includes('ไม่ใช่รายการเอกสารบังคับของทุกธนาคาร')));
  assert(topics[2].faq.some(f => f.a.startsWith('ไม่รับประกัน')));
  const results = [];
  for (const [slug, selected] of [['feasibility-study',topics.slice(0,2)],['business-plan',[topics[2]]],['strategic-planner-business-strategy',[]]]) {
    const route = '/services/' + slug;
    const response = await fetch(base + route);
    assert.equal(response.status,200);
    const nodes = walk(parse(await response.text()));
    assert.equal(nodes.filter(n => attr(n,'data-planning-topic')).length, selected.length);
    for (const topic of selected) {
      const node = nodes.find(n => attr(n,'data-planning-topic') === topic.id);
      const content = text(node);
      for (const sentence of [topic.title,...topic.copy,...topic.table.headers,...topic.table.rows.flat(),...topic.faq.flatMap(f=>[f.q,f.a]),...topic.afterTable.flatMap(s=>[s.heading,s.text])]) assert(content.includes(sentence), `${slug}: missing approved text`);
      const links = walk(node).filter(n => n.tagName === 'a').map(n => attr(n,'href'));
      assert.deepEqual(links,topic.ctas.map(c=>c.href));
    }
    const original = await fetch(baseline + route);
    assert.equal(original.status,200);
    const originalNodes = walk(parse(await original.text()));
    assert.deepEqual(metadata(nodes), metadata(originalNodes), `${slug}: metadata changed`);
    assert.equal(originalText(nodes.find(n=>n.tagName==='main')).replace(/\s+/g,' ').trim(),originalText(originalNodes.find(n=>n.tagName==='main')).replace(/\s+/g,' ').trim(), `${slug}: original content changed`);
    results.push({route,status:response.status,approvedContent:true,metadataUnchanged:true,originalContentUnchanged:true});
  }
  console.log(JSON.stringify({passed:true,results},null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
