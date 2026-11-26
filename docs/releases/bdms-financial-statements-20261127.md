# BDMS financial statements release — 27 November 2026

Owner approved publishing the reviewed mockup. Public routes:
- /dongfunda/financial-statements — searchable stock library
- /dongfunda/financial-statements/bdms — approved navy/gold dashboard
- /dongfunda/companies/bdms — permanent redirect to the new dashboard

Uses the existing lib/dongfunda/bdms-financials.json without changing values. Eight charts, seven period modes, matching period labels on every chart, compact sticky period buttons. Missing latest-period values remain missing and display waiting state. No export controls. Shared YouTube/coffee membership links retained.

scripts/build-financial-pages.cjs reproduces the approved design and shared support destinations during prebuild. The React adapter mounts the same chart renderer and disposes sticky/resize observers when leaving the page. Homepage financial navigation now opens the public library instead of the maintenance dialog. Canonicals and core sitemap cover both new routes.

Validation: production compilation/type check and build; local browser confirmed eight rendered charts, period selection and no console errors. Live checks recorded in the delivery report after rollout.
