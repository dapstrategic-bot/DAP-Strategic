# Main sitemap fetch repair

Owner requested fixing the main sitemap's Search Console Couldn't fetch status.

Observed before change:
- /sitemap.xml returned 200/application/xml, parsed as 30 URLs, but x-vercel-cache MISS.
- Search Console continued to show Couldn't fetch even after a fresh submission.
- Google live URL inspection succeeded: crawl allowed Yes, page fetch Successful, tested 26 November 2026 01:38:18 Asia/Bangkok.
- Therefore a permanent robots/login block or malformed XML was not demonstrated. The exact original failed-fetch cause was not reported by Google.
- Code required live CMS requests on cold instances and used an instance-local snapshot only; a cold CMS timeout could return an error rather than a sitemap.

Final change:
- Canonical main sitemap is /sitemap-index.xml, a small literal static sitemap index advertised by robots.txt. /sitemap.xml retains identical index bytes for backward compatibility.
- The index references the existing /sitemap-core.xml and /sitemap-pages.xml.
- Complete 30-URL inventory moved to /sitemap-pages.xml, using Next's persistent prerendered route cache.
- Dedicated XML serializer escapes text/attributes, preserves real modification dates and language alternates, and puts extension elements after standard sitemap fields.
- Five-minute ISR refresh keeps CMS-published URLs current without making each crawler fetch wait for CMS.
- Keep the current complete-source loader, published/approved filters, error handling, canonical URLs, accurate modification dates, and core sitemap unchanged.
- A refresh failure does not replace the complete cached XML with an incomplete subset.

Validation:
- Production build passed and lists /sitemap-pages.xml as static with five-minute revalidation; the index is a public static asset.
- Existing sitemap cache tests updated for current public routes/course source; cover failure of each source, complete output, date integrity, bounded loader snapshot and recovery.
- Local HTTP test: valid sitemap index and child XML, 200/application/xml, HIT, 30 unique canonical URLs including CMS articles, courses, One Report and BDMS.
- One Report SEO regression checks passed.

Production and final Google processing status are recorded in review/dongfunda/SITEMAP-REPAIR-RESULT-20261126.json after deployment.

An initial cache-only deployment improved transport caching but did not clear Google's existing error. Google then successfully read the new full child at /sitemap-pages.xml and discovered all 30 URLs, while the old /sitemap.xml submission continued showing Couldn't fetch even after static-index deployment and resubmission. The canonical index moved to /sitemap-index.xml so Google can process it under a new submission URL. The old URL still works; no website pages or index-removal requests were deleted. No firewall or security settings were weakened. The historical URL's exact failure cause remains unconfirmed.
