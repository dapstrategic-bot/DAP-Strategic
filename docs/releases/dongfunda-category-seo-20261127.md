# DongFunda category SEO — 27 November 2026

Approved scope: SEO for the DongFunda hub, research collections and company reports, supporting BDMS and future stocks. No new financial values or unpublished company pages.

- Shared research registry supplies report metadata, collection lists, company identity and sitemap inventory.
- Hub heading and visible links describe One Report and financial dashboards; featured article remains intact as a secondary heading.
- Unique self-canonical titles/descriptions and DongFunda Open Graph branding across research and CMS articles.
- JSON-LD links website -> DongFunda hub -> collection -> report, with breadcrumbs and accurate company identity.
- BDMS financial KPIs and the complete default-period table are generated into initial HTML using the existing renderer/dataset, allowing values to be read before client scripts run.
- Related BDMS reports link to each other and the DongFunda hub.
- Both core and complete sitemaps use published registry entries and exclude the legacy redirect. Existing sitemap cache safeguards retained.
- Future-stock onboarding documented in docs/dongfunda-research-seo.md; test fixture verifies a second company and draft exclusion without publishing fictitious pages.

Validation: shared SEO tests; sitemap/cache tests; production build/type checks; initial HTTP HTML for five hub/research pages (200, self-canonical, single H1, indexable, breadcrumbs); both sitemap inventories; browser visual check. Live rollout results are saved in the delivery report.
