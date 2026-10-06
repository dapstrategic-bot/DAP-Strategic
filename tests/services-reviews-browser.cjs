const assert = require('node:assert/strict');
const fs = require('node:fs');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.REVIEW_URL || 'http://localhost:3022';
const out = 'review/services-reviews';
fs.mkdirSync(out, {recursive: true});

(async () => {
  const browser = await chromium.launch({headless:true, channel:'chrome'});
  try {
    for (const width of [1440,390]) {
      const page = await browser.newPage({viewport:{width,height:1000}});
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.route(/googletagmanager|google-analytics|connect.facebook|facebook.com\/tr/, r => r.abort());
      assert.equal((await page.goto(`${base}/services`, {waitUntil:'networkidle'})).status(), 200);
      const section = page.locator('#customer-reviews');
      assert.equal(await section.locator('article').count(), 3);
      assert.equal(await section.getByText('คัดบางส่วนจากรีวิว', {exact:false}).count(), 3);
      assert.equal(await section.getByText('คะแนนในรีวิว 5.0 / 5', {exact:true}).count(), 3);
      assert.equal(await section.getByText('รีวิวจาก Fastwork', {exact:false}).count(), 0);
      assert.ok(await section.evaluate(e => e.previousElementSibling.innerText.includes('Strategic Planning') && e.nextElementSibling.innerText.includes('ไม่แน่ใจว่าบริการไหนเหมาะกับคุณ?')));
      assert.ok(await page.getByRole('link', {name:'คุยกับเราผ่าน LINE',exact:true}).getAttribute('href'));
      const boxes = await section.locator('article').evaluateAll(es=>es.map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y})));
      assert.equal(width > 700 ? boxes[0].y === boxes[2].y : boxes[0].x === boxes[2].x, true);
      for (let index=0; index<3; index++) {
        const trigger = section.getByRole('button', {name:/ดูภาพรีวิวต้นฉบับ/}).nth(index);
        await trigger.click();
        const dialog = page.getByRole('dialog');
        await dialog.waitFor({state:'visible'});
        await dialog.locator('img').evaluate(async image => {if (!image.complete) await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject});});
        assert.ok(await dialog.locator('img').evaluate(e=>e.naturalWidth>0));
        assert.equal(await page.evaluate(()=>document.body.style.overflow), 'hidden');
        if(index===0) {
          await page.keyboard.press('Escape');
        } else {
          await dialog.getByRole('button',{name:'ปิดภาพรีวิว'}).click();
        }
        await dialog.waitFor({state:'hidden'});
        assert.ok(await trigger.evaluate(e=>document.activeElement===e));
        assert.notEqual(await page.evaluate(()=>document.body.style.overflow), 'hidden');
      }
      await section.scrollIntoViewIfNeeded();
      await page.screenshot({path:`${out}/${base.includes('localhost')?'local':'live'}-${width}.png`,fullPage:true});
      await section.screenshot({path:`${out}/${base.includes('localhost')?'local':'live'}-section-${width}.png`});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth), false);
      assert.deepEqual(errors, []);
      console.log(`PASS ${base} width=${width}: content, placement, layout, 3 images, Escape, close, focus, scroll and LINE`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1});
