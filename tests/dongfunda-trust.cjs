const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
function load(file, imports = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const code = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText;
  const module = {exports: {}};
  new Function('require', 'module', 'exports', code)(name => imports[name] || require(name), module, module.exports);
  return module.exports;
}
const values = load('lib/dongfunda-trust-values.ts');
const defaults = values.DEFAULT_TRUST_VALUES;
for (const invalid of [null, {}, {...defaults, subscribers:-1}, {...defaults, subscribers:1.5}, {...defaults, videos:-1}, {...defaults, videos:NaN}, {...defaults, subscribers:Number.MAX_SAFE_INTEGER+1}, {...defaults, referenceDate:'2026-02-30'}, {...defaults, referenceDate:'2026-10-21T00:00:00Z'}]) {
  assert.deepEqual(values.normalizeTrustValues(invalid), defaults);
}
assert.equal(values.isReferenceDate('2024-02-29'), true);
assert.equal(values.isReferenceDate('2025-02-29'), false);
for (const [count, label] of [[0,'0'],[999,'999'],[1000,'1,000'],[13963,'กว่า 13,000'],[13999,'กว่า 13,000'],[14000,'14,000'],[14001,'กว่า 14,000']]) {
  assert.equal(values.formatTrustValues({...defaults,subscribers:count}).subscribers, label);
}
assert.equal(values.formatTrustValues(defaults).date,'21 ต.ค. 2569');
let saved = defaults;
let fail = false;
const helper = load('lib/dongfunda-trust.ts', {
  './dongfunda-trust-values': values,
  './sanity': {sanityClient:{withConfig(config){
    assert.equal(config.useCdn,false);assert.equal(config.perspective,'published');
    return {async fetch(query,params,options){
      assert.ok(query.includes('_id == "productsPage"'));assert.ok(query.includes('youtubeTrust'));
      assert.equal(options.next.revalidate,30);
      if(fail)throw new Error('CMS unavailable');return saved;
    }};
  }}},
});
(async()=>{
  assert.deepEqual(await helper.getDongFundaTrustValues(),defaults);
  saved = {subscribers:14963,videos:251,referenceDate:'2026-10-22'};
  const [products,course] = await Promise.all([helper.getDongFundaTrustValues(),helper.getDongFundaTrustValues()]);
  assert.deepEqual(products,saved);assert.deepEqual(course,saved);
  assert.equal(values.formatTrustValues(course).date,'22 ต.ค. 2569');
  fail=true;assert.deepEqual(await helper.getDongFundaTrustValues(),defaults);
  fail=false;saved={...defaults,videos:2.5};assert.deepEqual(await helper.getDongFundaTrustValues(),defaults);
  console.log('PASS counts, date, Thai year, rounding, shared read, invalid record and CMS outage fallback. No writes/network.');
})().catch(e=>{console.error(e);process.exitCode=1});
