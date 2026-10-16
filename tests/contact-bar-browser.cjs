const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.REVIEW_URL || 'http://localhost:3022';
const out = `review/contact-bar/${base.includes('localhost') ? 'local' : 'live'}`;
const links = ['https://lin.ee/ntNa1Tb', 'tel:0849332331', 'https://www.facebook.com/DongFunda', 'https://www.youtube.com/@DongFunda'];

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const xml = await (await fetch(`${base}/sitemap.xml`)).text();
  const routes = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname))];
  assert.ok(routes.length >= 17);
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const width of [1440, 390, 320, 768, 1024]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.route(/googletagmanager|google-analytics|connect.facebook|facebook.com\/tr/, r => r.abort());
      for (const route of routes) {
        assert.equal((await page.goto(`${base}${route}`)).status(), 200, route);
        const bar = page.locator('[data-contact-bar]');
        assert.equal(await bar.count(), 1, route);
        const purchase = page.locator('div.fixed.bottom-0.lg\\:hidden');
        const hasPurchase = width < 1024 && await purchase.count() > 0 && await purchase.first().isVisible();
        assert.equal(await bar.isVisible(), !hasPurchase, `${width} ${route}`);
        assert.deepEqual(await bar.locator('a').evaluateAll(es => es.map(e => e.getAttribute('href'))), links);
        assert.equal(await bar.getByText('Line: @dongfunda', { exact: true }).count(), 1);
        assert.equal(await page.locator('a[href^="tel:"]').count(), 1);
        assert.equal(await page.locator('footer a[href^="tel:"]').count(), 0);
        for (const text of await page.locator('script[type="application/ld+json"], meta').evaluateAll(es => es.map(e => e.textContent + (e.getAttribute('content') || '')))) {
          assert.doesNotMatch(text, /084[- ]?933[- ]?2331|"telephone"/);
        }
        const overflow = await page.evaluate(() => {
          const before = document.documentElement.scrollWidth;
          const bar = document.querySelector('[data-contact-bar]');
          const parent = bar.parentNode;
          const next = bar.nextSibling;
          bar.remove();
          const without = document.documentElement.scrollWidth;
          parent.insertBefore(bar, next);
          return { before, without, viewport: innerWidth };
        });
        assert.ok(overflow.before <= Math.max(overflow.without, width), `${width} ${route} new overflow`);
        if (overflow.without > width) console.log(`Existing overflow without contact bar: ${width}px ${route} (${overflow.without}px)`);
        if (!hasPurchase) {
          const before = await bar.boundingBox();
          assert.equal(await bar.locator('a').evaluateAll(es => es.every(e => e.clientWidth >= e.scrollWidth && e.clientHeight >= e.scrollHeight)), true, `${width} ${route} text fits`);
          assert.ok(before.y + before.height <= 901);
          if (width < 1024) assert.ok(Math.abs(before.width - width) < 2);
          else assert.ok(Math.abs(before.x + before.width - (width - 24)) < 2);
          await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
          await page.waitForTimeout(100);
          const after = await bar.boundingBox();
          assert.ok(Math.abs(after.y - before.y) < 2, 'fixed while scrolling');
          const footer = await page.locator('footer').boundingBox();
          assert.ok(footer.y + footer.height <= after.y + 2, `${route} footer unobscured`);
          if (['/', '/services', '/contact', '/dongfunda', '/products/premium-stock-analysis-1on1'].includes(route)) {
            await page.screenshot({ path: `${out}/${route.replace(/\W/g, '-') || 'home'}-${width}.png` });
          }
        }
      }
      for (const route of ['/products/thank-you', '/dongfunda-review', '/not-a-real-page', '/products/not-a-real-product', '/services/not-a-real-service', '/dongfunda/not-a-real-article']) {
        await page.goto(`${base}${route}`);
        assert.equal(await page.locator('[data-contact-bar]').count(), 0, `excluded ${route}`);
      }
      await page.goto(`${base}/services`);
      await page.locator('footer').getByRole('link', { name: 'Home', exact: true }).click();
      await page.waitForURL(`${base}/`);
      assert.equal(await page.locator('[data-contact-bar]').count(), 1, 'client navigation');
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}px: ${routes.length} public routes, 6 exclusions, links, layout, scrolling, phone isolation and navigation`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
