const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/campaign-links.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: exportsObject, URLSearchParams, Object });
const { campaignDestination, CAMPAIGN_CHANNELS, CAMPAIGN_DESTINATIONS } = exportsObject;
for (const [channel, expected] of Object.entries(CAMPAIGN_CHANNELS)) {
  for (const [destination, path] of Object.entries(CAMPAIGN_DESTINATIONS)) {
    const result = new URL(campaignDestination(channel, destination), 'https://www.dap.co.th');
    assert.equal(result.pathname, path);
    assert.equal(result.searchParams.get('utm_source'), expected.source);
    assert.equal(result.searchParams.get('utm_medium'), expected.medium);
    assert.equal(result.searchParams.get('utm_campaign'), destination === 'course' ? 'tonrob_2570' : 'one_report_free');
  }
}
for (const value of ['__proto__', 'constructor', 'unknown', 'https://example.com']) {
  assert.equal(campaignDestination(value, 'bdms'), null);
  assert.equal(campaignDestination('youtube', value), null);
}
assert.match(campaignDestination('youtube', 'bdms', 'bdms_video_01'), /utm_content=bdms_video_01/);
for (const content of ['customer@example.com', 'https://example.com', 'a'.repeat(81), '']) {
  assert.equal(new URL(campaignDestination('youtube', 'bdms', content), 'https://www.dap.co.th').searchParams.get('utm_content'), 'bdms');
}
console.log('PASS: 32 campaign destinations, channel attribution, allowlist, and content validation');
