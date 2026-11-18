import { notFound } from 'next/navigation';
import { englishServices } from '@/data/services-en';
import { EnglishServiceDetail } from '@/components/services/EnglishServices';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL, COMPANY_ID, serializeJsonLd } from '@/lib/site-identity';
export const dynamicParams = false;
export function generateStaticParams(){return englishServices.map(s=>({slug:s.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const service=englishServices.find(s=>s.slug===slug); if(!service) return generatePageMetadata({title:'Service not found | DAP Strategic',path:`/en/services/${slug}`,locale:'en',noIndex:true});return generatePageMetadata({title:`${service.title} | DAP Strategic`,description:service.description,path:`/en/services/${slug}`,locale:'en'});}
export default async function EnglishServicePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const service=englishServices.find(s=>s.slug===slug);if(!service)notFound();return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd({'@context':'https://schema.org','@type':'Service',name:service.title,description:service.description,provider:{'@id':COMPANY_ID},url:`${SITE_URL}/en/services/${slug}`})}}/><EnglishServiceDetail service={service}/></>;}
