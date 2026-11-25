# Main sitemap fetch repair

Owner requested fixing the main sitemap's Search Console Couldn't fetch status.

Observed before change:
- /sitemap.xml returned 200/application/xml, parsed as 30 URLs, but x-vercel-cache MISS.
- Search Console continued to show Couldn't fetch even after a fresh submission.
- Google live URL inspection succeeded: crawl allowed Yes, page fetch Successful, tested 26 November 2026 01:38:18 Asia/Bangkok.
- Therefore a permanent robots/login block or malformed XML was not demonstrated. The exact original failed-fetch cause was not reported by Google.
- Code required live CMS requests on cold instances and used an instance-local snapshot only; a cold CMS timeout could return an error rather than a sitemap.

Change:
- Use Next's persistent, prerendered route cache for the complete main sitemap.
- Five-minute ISR refresh keeps CMS-published URLs current without making each crawler fetch wait for CMS.
- Keep the current complete-source loader, published/approved filters, error handling, canonical URLs, accurate modification dates, and core sitemap unchanged.
- A refresh failure does not replace the complete cached XML with an incomplete subset.

Validation:
- Production build passed and lists /sitemap.xml as static with five-minute revalidation.
- Existing sitemap cache tests updated for current public routes/course source; cover failure of each source, complete output, date integrity, bounded loader snapshot and recovery.
- Local HTTP test: 200/application/xml, HIT, 30 unique canonical URLs including CMS articles, courses, One Report and BDMS.
- One Report SEO regression checks passed.

Production and final Google processing status are recorded in review/dongfunda/SITEMAP-REPAIR-RESULT-20261126.json after deployment.
