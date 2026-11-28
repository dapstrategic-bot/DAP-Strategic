import {generatePageMetadata, type SEOInput} from '@/lib/seo';
import {SITE_URL, BRAND_ID, COMPANY_ID, DONGFUNDA_TITLE, DONGFUNDA_DESCRIPTION} from '@/lib/site-identity';
import {researchCatalog, publishedReports, sectionPath, type ResearchSection} from './research-catalog';
import {localizedResearchEntry} from './research-copy';
import {researchEnglish,type ResearchLocale} from './research-language';
export function dongfundaMetadata(input:SEOInput) {
  const metadata=generatePageMetadata(input);
  return {...metadata,title:{absolute:input.title!},openGraph:{...metadata.openGraph,siteName:'DongFunda by DAP'}};
}
export function researchMetadata(section:ResearchSection, slug?:string,locale:ResearchLocale='th') {
  const entry=localizedResearchEntry(section,slug,locale);
  return dongfundaMetadata({...entry,locale,ogImage:SITE_URL+'/images/logo.jpg'});
}
export function researchStructuredData(section:'home'|ResearchSection, slug?:string,locale:ResearchLocale='th') {
  const prefix=locale==='en'?'/en':'';
  const label=(text:string)=>locale==='en'?researchEnglish(text):text;
  const hub=SITE_URL+prefix+'/dongfunda';
  const entry=section==='home'?{path:prefix+'/dongfunda',title:DONGFUNDA_TITLE,description:DONGFUNDA_DESCRIPTION,name:'DongFunda'}:localizedResearchEntry(section,slug,locale);
  const url=SITE_URL+entry.path;
  const company=section!=='home'&&slug?researchCatalog.companies.find(c=>c.slug===slug):undefined;
  const category=researchCatalog.sections.find(s=>s.slug===section);
  const crumbs=[{name:'Home',item:SITE_URL+(prefix||'/')},{name:'DongFunda',item:hub},...(category?[{name:label(category.name),item:SITE_URL+prefix+sectionPath(section as ResearchSection)}]:[]),...(company?[{name:company.ticker,item:url}]:[])];
  const parent=section==='home'?SITE_URL+'/#website':company?SITE_URL+prefix+sectionPath(section as ResearchSection)+'#webpage':hub+'#webpage';
  const children=section==='home'?researchCatalog.sections.map(s=>({name:label(s.name),url:SITE_URL+prefix+'/dongfunda/'+s.slug})):publishedReports(section as ResearchSection).map(r=>({name:label(`${r.company.ticker} ${category?.name} ${r.report.coverage}`),url:SITE_URL+prefix+r.path}));
  return {'@context':'https://schema.org','@graph':[
    {'@type':company?'WebPage':'CollectionPage','@id':url+'#webpage',url,name:entry.name,description:entry.description,inLanguage:locale==='en'?'en-US':'th-TH',isAccessibleForFree:true,isPartOf:{'@id':parent},publisher:{'@id':COMPANY_ID},about:company?{'@id':SITE_URL+'/dongfunda#company-'+company.slug}:{'@id':BRAND_ID},...(company?{}:{mainEntity:{'@type':'ItemList',itemListElement:children.map((item,i)=>({'@type':'ListItem',position:i+1,...item}))}})},
    {'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,...c}))},
    ...(company?[{'@type':'Corporation','@id':SITE_URL+'/dongfunda#company-'+company.slug,name:label(company.name),alternateName:company.ticker,tickerSymbol:company.exchange+':'+company.ticker}]:[])
  ]};
}
