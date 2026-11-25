import type {MetadataRoute} from 'next';

const escapeXml = (value:string|number) => String(value).replace(/[&<>"']/g,
  character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[character]!));

export function serializeSitemap(items:MetadataRoute.Sitemap):string {
  const urls=items.map(item=>{
    const updated=item.lastModified instanceof Date?item.lastModified.toISOString():item.lastModified;
    const alternates=Object.entries(item.alternates?.languages||{}).map(([language,url])=>
      `<xhtml:link rel="alternate" hreflang="${escapeXml(language)}" href="${escapeXml(String(url))}" />`).join('');
    return `<url><loc>${escapeXml(item.url)}</loc>${updated?`<lastmod>${escapeXml(updated)}</lastmod>`:''}${item.changeFrequency?`<changefreq>${item.changeFrequency}</changefreq>`:''}${item.priority!==undefined?`<priority>${item.priority}</priority>`:''}${alternates}</url>`;
  });
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'+urls.join('\n')+'\n</urlset>\n';
}
