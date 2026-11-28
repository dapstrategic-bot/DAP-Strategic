# DongFunda research bilingual release — 28 November 2026

Owner approved publishing the TH / EN mockup for One Report and financial statements.

- Thai and English directories plus BDMS, HMPRO and CPALL One Reports; BDMS financial dashboard. English uses `/en/dongfunda/...` with translated initial HTML, metadata, schema, canonical and reciprocal hreflang.
- TH / EN switches preserve the active dashboard without reloading. Fiscal years display as B.E. in Thai and C.E. in English. Selected years and reporting periods are included in the switched URL for refresh/sharing.
- Search terms and industry selections survive switching. Both directories link to the active language's detail pages.
- Approved translations are shared by the server renderer and client widgets. Original numeric datasets are unchanged. Missing financial periods remain missing; no figures are estimated.
- The seven financial reporting modes and eight metrics retain their existing calculation/rendering. Financial chart watermark URLs now resolve correctly from both language routes.
- English research routes share the approved dashboard layout, without a second site header/footer. Both sitemaps include all twelve routes.

Validation: Next build and type checks; bilingual HTTP test across all twelve routes; existing HMPRO/CPALL content and BDMS regressions; browser checks of all fifteen stock-year selections and all seven financial periods, numeric equality across languages, search/filter persistence, native directory navigation, period deep-links, desktop and mobile layout.

Production verification and deployment identifiers are recorded in the local release evidence after deployment. No preview banner, noindex setting or mockup source archive is deployed.
