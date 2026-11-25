import {BRAND_ID, COMPANY_ID, SITE_URL, serializeJsonLd} from '@/lib/site-identity';

export default function ResearchStructuredData({company=false}:{company?:boolean}) {
  const library=SITE_URL+'/dongfunda/one-report';
  const url=company?library+'/bdms':library;
  const crumbs=[{name:'DongFunda',item:SITE_URL+'/dongfunda'},{name:'สรุป One Report',item:library},...(company?[{name:'BDMS',item:url}]:[])];
  const graph=[{
    '@type':company?'WebPage':'CollectionPage','@id':url+'#webpage',url,
    name:company?'BDMS สรุป One Report ปี 2564–2568':'สรุป One Report รายบริษัท | DongFunda',
    description:company?'รายได้ โครงสร้างผู้ป่วย เครือโรงพยาบาล จำนวนเตียง และแผนขยายธุรกิจ BDMS':'เลือกหุ้นและค้นหาสรุป One Report รายบริษัท เริ่มต้นด้วย BDMS',
    inLanguage:'th',isAccessibleForFree:true,isPartOf:{'@id':SITE_URL+'/#website'},
    publisher:{'@id':COMPANY_ID},author:{'@id':BRAND_ID},
    ...(company?{about:{'@type':'Corporation',name:'บริษัท กรุงเทพดุสิตเวชการ จำกัด (มหาชน)',alternateName:'BDMS',tickerSymbol:'SET:BDMS'}}:{mainEntity:{'@type':'ItemList',itemListElement:[{'@type':'ListItem',position:1,name:'BDMS สรุป One Report ปี 2564–2568',url:library+'/bdms'}]}}),
  },{'@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,...c}))}];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd({'@context':'https://schema.org','@graph':graph})}} />;
}
