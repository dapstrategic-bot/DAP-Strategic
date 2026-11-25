const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function compile(file, imports = {}) {
  const source = fs.readFileSync(file, 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports, require: name => {
      if (!(name in imports)) throw Error(`Unexpected import ${name}`);
      return imports[name];
    }, setTimeout, clearTimeout, console, Date,
  });
  return exports;
}
const { createSitemapCache } = compile('lib/sitemap-cache.ts');
const languages = compile('lib/languages.ts');
async function main() {
  let time = 0, calls = 0, fail = false, value = ['a', 'b'];
  const warnings = [];
  const get = createSitemapCache(async () => {
    calls++;
    if (fail) throw Error('private CMS details');
    return value;
  }, { now: () => time, warn: x => warnings.push(x) });
  assert.deepEqual(await get(), ['a', 'b']);
  time = 59_999;
  await get();
  assert.equal(calls, 1);
  time = 60_000;
  value = ['a'];
  assert.deepEqual(await get(), ['a']); // Unpublished entry disappears on refresh.
  fail = true;
  time = 120_000;
  assert.deepEqual(await get(), ['a']);
  time = 359_999;
  assert.deepEqual(await get(), ['a']);
  time = 360_000;
  await assert.rejects(get(), /temporarily unavailable/);
  assert.ok(warnings.every(x => !x.includes('private')));
  fail = false;
  value = ['new'];
  assert.deepEqual(await get(), ['new']);

  const cold = createSitemapCache(async () => { throw Error('CMS down'); }, { warn: () => {} });
  await assert.rejects(cold(), /temporarily unavailable/);
  const hanging = createSitemapCache(() => new Promise(() => {}), {
    timeoutMs: 5, warn: () => {},
  });
  await assert.rejects(hanging(), /temporarily unavailable/);
  let concurrentCalls = 0;
  const concurrent = createSitemapCache(async () => {
    concurrentCalls++;
    await new Promise(resolve => setTimeout(resolve, 5));
    return ['complete'];
  });
  await Promise.all([concurrent(), concurrent(), concurrent()]);
  assert.equal(concurrentCalls, 1);

  // Exercise the complete inventory with isolated mock CMS sources.
  const site = 'https://www.dap.co.th';
  const article = { slug: 'article', updated_at: '2026-10-19T00:00:00Z' };
  for (const failedSource of [null, 'services', 'products', 'content']) {
    const route = compile('lib/sitemap-data.ts', {
      '@/lib/languages': languages,
      '@/lib/tonrob': { listedRounds: () => [{slug:'tonrob-2570'}], roundPath: r => `/products/${r.slug}` },
      '@/lib/site-identity': { SITE_URL: site },
      '@/lib/sanity': { sanityClient: { withConfig: config => {
        assert.equal(config.useCdn, false);
        assert.equal(config.perspective, 'published');
        return { fetch: async query => {
        if (query === failedSource) throw Error('mock failure');
        return [{ slug: query === 'services' ? 'business-plan' : 'course' }];
      } }; } } },
      '@/lib/queries': { serviceSlugsQuery: 'services', productSlugsQuery: 'products' },
      '@/lib/dongfunda/data': { getPublishedContent: async () => {
        if (failedSource === 'content') throw Error('mock failure');
        return [article];
      } },
      '@/lib/dongfunda/model': { contentHref: item => `/dongfunda/${item.slug}` },
      '@/lib/dongfunda/seo': { dongfundaSite: site },
      '@/lib/dongfunda/financials': { companyHref: '/dongfunda/companies/bdms' },
      '@/lib/sitemap-cache': {
        createSitemapCache: loader => createSitemapCache(loader, { warn: () => {} }),
      },
    });
    if (failedSource) {
      await assert.rejects(route.getCompleteSitemap(), /temporarily unavailable/);
    } else {
      const result = await route.getCompleteSitemap();
      const home = result.find(item => item.url === site);
      assert.equal(home.alternates.languages.en, `${site}/en`);
      assert.equal(home.alternates.languages.th, `${site}/`);
      for (const url of ['/dongfunda/one-report','/dongfunda/one-report/bdms','/products/tonrob-2570','/services/business-plan','/products/course','/dongfunda/article']) {
        assert.ok(result.some(item => item.url === site + url), `Missing ${url}`);
      }
      assert.equal(result.at(-1).lastModified, article.updated_at);
      assert.ok(result.slice(0, -1).every(item => !item.lastModified));
    }
  }
  const {serializeSitemap}=compile('lib/sitemap-xml.ts');
  const xml=serializeSitemap([{url:site+'/test?a=1&b=2',lastModified:new Date('2026-11-26T00:00:00Z'),alternates:{languages:{en:site+'/en?a=1&b=2'}}}]);
  assert.ok(xml.includes('a=1&amp;b=2'));
  assert.ok(xml.includes('<lastmod>2026-11-26T00:00:00.000Z</lastmod>'));
  assert.ok(!serializeSitemap([{url:site}]).includes('<lastmod>'));
  console.log('PASS: freshness, unpublish refresh, bounded stale, expiry, recovery, cold failure, timeout, concurrency, redacted logging, route completeness, each CMS source failure, lastmod.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
