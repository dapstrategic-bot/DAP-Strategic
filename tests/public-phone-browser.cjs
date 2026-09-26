const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.REVIEW_URL || 'http://127.0.0.1:3021';
const target = /(?:0|\+?66)[\s().-]*84[\s().-]*933[\s().-]*2331/;

(async () => {
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
  assert.ok(urls.length > 5);
  for (const route of new Set([...urls, '/contact', '/products/thank-you'])) {
    const response = await fetch(`${base}${route}`);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.doesNotMatch(html, target, route);
    assert.doesNotMatch(html, /02-XXX-XXXX|href=["']tel:|"telephone"/, route);
  }
  console.log(`PASS: ${new Set([...urls, '/contact', '/products/thank-you']).size} public pages contain no phone in HTML, serialized data or JSON-LD`);
  const browser = await chromium.launch({headless: true, channel: 'chrome'});
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({viewport: {width, height: 1000}});
      await page.route(/googletagmanager|google-analytics|connect.facebook|facebook.com\/tr/, route => route.abort());
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}/contact`);
      const contactHeading = page.getByRole('heading', {name: 'ช่องทางการติดต่อ', exact: true});
      await contactHeading.scrollIntoViewIfNeeded();
      const mail = page.locator('a[href^="mailto:"]');
      assert.ok(await mail.count() > 0);
      assert.match(await mail.first().getAttribute('href'), /dapstrategic@gmail\.com/i);
      assert.ok(await page.getByText('@DAPStrategic', {exact: true}).isVisible());
      assert.ok(await page.getByText('Office', {exact: true}).isVisible());
      assert.equal(await page.locator('a[href^="tel:"]').count(), 0);
      assert.equal(await page.getByText('Phone', {exact: true}).count(), 0);
      assert.ok(await page.locator('form input[type="email"]').isEnabled());
      assert.ok(await page.locator('form select').isEnabled());
      assert.ok(await page.getByRole('button', {name: 'ส่งข้อมูลติดต่อ'}).isEnabled());
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.screenshot({path: `review/dongfunda/phone-removed-${base.includes('127.0.0.1') ? 'local' : 'live'}-${width}.png`});
      assert.deepEqual(errors, []);
      console.log(`PASS: ${width}px contact layout, LINE/email/address and form controls intact; no form submitted`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => {console.error(error); process.exitCode = 1;});
