# DongFunda research SEO and Search Console

Owner requested SEO and Search Console setup on 26 November 2026.

Implementation:
- Descriptive Thai titles/descriptions for One Report library and BDMS.
- Canonical, social metadata and existing robots/sitemap discovery retained.
- Research WebPage/CollectionPage and BreadcrumbList JSON-LD, identifying BDMS accurately.
- Initial BDMS chart/KPI/pipeline HTML generated at build time from the same approved browser renderer/data. Content and appearance are identical for visitors and crawlers. No second dataset, no crawler-specific rendering, no hidden SEO text.
- Client year selection remains interactive; client script no longer overwrites the descriptive server title.
- Financial maintenance page marked noindex while unfinished.

Checks:
- Production build/typecheck passed.
- tests/dongfunda-research-seo.cjs checks HTTP status, canonical, indexability, JSON-LD, raw initial chart/KPI HTML, no export links, maintenance noindex and both sitemap entries.
- Native browser confirmed year 2564 selection and zero observed console errors; appearance inspected.

Search Console:
- DAP STRATEGIC account, https://www.dap.co.th/ property.
- Google auto-verified using existing domain-provider/DNS evidence. No DNS, credentials or access permissions changed by this task.
- Core sitemap resubmitted once: Google reports Success, 22 discovered pages, last read 26 November 2026.
- Main dynamic sitemap submitted once: initially Couldn't fetch; direct HTTP check returned 200/application/xml with 30 parseable URLs. Cause not established; core sitemap successfully covers the new research URLs.
- BDMS inspection: Discovered – currently not indexed, with sitemap-core.xml as discovery source. Requests for indexing and final deployment result are recorded separately after rollout.

Google decides crawling/indexing/ranking; setup and submission are not an indexing or ranking guarantee.
References: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics and https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
