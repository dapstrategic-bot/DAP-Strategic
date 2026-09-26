const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');

test('contact and footer do not render a phone or fallback', () => {
  for (const file of ['components/contact/ContactInfo.tsx', 'components/layout/Footer.tsx']) {
    const source = read(file);
    assert.doesNotMatch(source, /tel:|\bPhone\b|contact\?\.phone|02-XXX-XXXX/);
    assert.match(source, /lineUrl/);
    assert.match(source, /email/);
  }
  assert.match(read('components/contact/ContactInfo.tsx'), /address/);
});

test('public settings and structured data do not expose phone', () => {
  const query = read('lib/queries.ts').split('export const siteSettingsQuery = `')[1].split('`;')[0];
  assert.doesNotMatch(query, /\bphone\b/);
  assert.doesNotMatch(read('components/shared/JsonLd.tsx'), /telephone|contact\??\.phone/);
});
