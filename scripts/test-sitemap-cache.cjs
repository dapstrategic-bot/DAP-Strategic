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
    }, setTimeout, clearTimeout, console,
  });
  return exports;
}
const { createSitemapCache } = compile('lib/sitemap-cache.ts');
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

  // Exercise the actual route with isolated mock CMS sources; no network or analytics.
  const site = 'https://www.dap.co.th';
  const article = { slug: 'article', updated_at: '2026-10-19T00:00:00Z' };
  for (const failedSource of [null, 'services', 'products', 'content']) {
    const route = compile('app/sitemap.ts', {
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
      await assert.rejects(route.default(), /temporarily unavailable/);
    } else {
      const result = await route.default();
      assert.equal(result.length, 10);
      assert.equal(result.at(-1).lastModified, article.updated_at);
      assert.equal(result[0].url, site);
      assert.ok(result.slice(0, -1).every(item => !item.lastModified));
    }
  }
  console.log('PASS: freshness, unpublish refresh, bounded stale, expiry, recovery, cold failure, timeout, concurrency, redacted logging, route completeness, each CMS source failure, lastmod.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
