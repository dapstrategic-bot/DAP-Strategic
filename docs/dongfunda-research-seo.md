# DongFunda research SEO

DongFunda is the hub; One Report and financial statements are collections; each published company report has its own canonical URL. Never canonicalize all reports to the hub: they answer different searches.

## Adding a stock or a report

1. Add real data, a visible library/search result and a real route under `/dongfunda/{section}/{company-slug}`. Keep slugs lowercase and stable.
2. Register the company and report in `lib/dongfunda/research-catalog.json`. Use an accurate title, description and data coverage. Leave `published:false` until content and route are ready. Do not invent timestamps, reports or financial values.
3. The route uses `researchMetadata(section, slug)` and `<ResearchStructuredData section={section} company={slug}/>` alongside its actual content. The helpers provide self-canonical metadata, the DongFunda brand, breadcrumbs, company identity and section hierarchy.
4. Use crawlable `<a href>` links between the hub, library, report, and other reports for the same company. Include server-readable headings and values; don't depend exclusively on JavaScript for important text.
5. Run `node scripts/test-dongfunda-seo.cjs`, `node scripts/test-sitemap-cache.cjs`, then `npm run build`. Prebuild checks registered published routes exist and syncs the static core sitemap. The complete CMS sitemap uses the same registry and excludes the legacy financial redirect.
6. After release, check the route status, canonical, titles, JSON-LD, sitemap membership and real user interactions. Submit the sitemap index in the existing dap.co.th Search Console property if it is not already submitted; future entries use the same index. Publication and sitemap inclusion do not guarantee indexing or rankings.

Do not add future/empty URLs to the registry as published. No separate Search Console property is required for each stock. Keep the existing root sitemap-index.xml -> sitemap-core.xml + sitemap-pages.xml architecture and cache recovery behavior.

Article pages keep their CMS titles, descriptions, publication dates and canonical choices, with consistent DongFunda sharing metadata. No keyword stuffing, fake reviews, fake FAQ, invented financial advice, hidden crawler-only text or unsupported SearchAction markup.
