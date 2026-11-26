import {generatePageMetadata, type SEOInput} from '@/lib/seo';
import {SITE_URL, BRAND_ID, COMPANY_ID, DONGFUNDA_TITLE, DONGFUNDA_DESCRIPTION} from '@/lib/site-identity';
import {researchCatalog, researchEntry, publishedReports, sectionPath, type ResearchSection} from './research-catalog';
export function dongfundaMetadata(input:SEOInput) {
  const metadata=generatePageMetadata(input);
  return {...metadata,title:{absolute:input.title!},openGraph:{...metadata.openGraph,siteName:'DongFunda by DAP'}};
}
export function researchMetadata(section:ResearchSection, slug?:string) {
  const entry=researchEntry(section,slug);
  return dongfundaMetadata({...entry,ogImage:SITE_URL+'/images/logo.jpg'});
}
export function researchStructuredData(section:'home'|ResearchSection, slug?:string) {
  const hub=SITE_URL+'/dongfunda';
  const entry=section==='home'?{path:'/dongfunda',title:DONGFUNDA_TITLE,description:DONGFUNDA_DESCRIPTION,name:'DongFunda'}:researchEntry(section,slug);
  const url=SITE_URL+entry.path;
  const company=section!=='home'&&slug?researchCatalog.companies.find(c=>c.slug===slug):undefined;
  const category=researchCatalog.sections.find(s=>s.slug===section);
  const crumbs=[{name:'Home',item:SITE_URL},{name:'DongFunda',item:hub},...(category?[{name:category.name,item:SITE_URL+sectionPath(section as ResearchSection)}]:[]),...(company?[{name:company.ticker,item:url}]:[])];
  const parent=section==='home'?SITE_URL+'/#website':company?SITE_URL+sectionPath(section as ResearchSection)+'#webpage':hub+'#webpage';
  const children=section==='home'?researchCatalog.sections.map(s=>({name:s.name,url:SITE_URL+'/dongfunda/'+s.slug})):publishedReports(section as ResearchSection).map(r=>({name:`${r.company.ticker} ${category?.name} ${r.report.coverage}`,url:SITE_URL+r.path}));
  return {'@context':'https://schema.org','@graph':[
    {'@type':company?'WebPage':'CollectionPage','@id':url+'#webpage',url,name:entry.name,description:entry.description,inLanguage:'th-TH',isAccessibleForFree:true,isPartOf:{'@id':parent},publisher:{'@id':COMPANY_ID},about:company?{'@id':hub+'#company-'+company.slug}:{'@id':BRAND_ID},...(company?{}:{mainEntity:{'@type':'ItemList',itemListElement:children.map((item,i)=>({'@type':'ListItem',position:i+1,...item}))}})},
    {'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,...c}))},
    ...(company?[{'@type':'Corporation','@id':hub+'#company-'+company.slug,name:company.name,alternateName:company.ticker,tickerSymbol:company.exchange+':'+company.ticker}]:[])
  ]};
}
