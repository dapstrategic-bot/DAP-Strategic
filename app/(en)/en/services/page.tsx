import Link from 'next/link';
import ContactBar from '@/components/layout/ContactBar';
import PageHeader from '@/components/shared/PageHeader';
import ServiceCard from '@/components/services/ServiceCard';
import CustomerReviews from '@/components/services/CustomerReviews';
import ServicesCTA from '@/components/services/ServicesCTA';
import { englishServices } from '@/data/services-en';
import { DONGFUNDA_LINE_URL, SITE_URL } from '@/lib/site-identity';
import { generatePageMetadata } from '@/lib/seo';
export const metadata = generatePageMetadata({title:'Business Consulting, Feasibility & Business Plans | DAP Strategic',description:'Explore feasibility studies, business plans and strategic planning. Review the scope, deliverables and next steps with DAP Strategic.',path:'/en/services',locale:'en',ogImage:`${SITE_URL}/images/dap-symbol-share-v2.jpg`});
const order = ['feasibility-study','business-plan','strategic-planner-business-strategy'];
export default function EnglishServicesPage(){
 return <div className="bg-gray-50">
 <ContactBar locale="en" />
 <PageHeader badge="Our services" title="Business Consulting, Feasibility Studies & Business Plans" description="Practical strategies and measurable plans to help you work through business challenges and move forward with clarity." />
 <section className="py-20"><div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl"><div className="space-y-16">
 {[...englishServices].sort((a,b)=>order.indexOf(a.slug)-order.indexOf(b.slug)).map(s=><div key={s.slug}>
 <ServiceCard locale="en" lineUrl={DONGFUNDA_LINE_URL} showFeasibilityOffer={s.slug==='feasibility-study'} service={{id:s.slug,slug:s.slug,title:s.slug==='feasibility-study'?'Feasibility Study':s.title,subtitle:s.description,problem:s.audience,solution:s.approach,deliverables:[...s.deliverables]}} />
 <CustomerReviews locale="en" serviceId={s.slug} />
 </div>)}
 </div></div></section>
 <section className="bg-white px-6 pt-8 pb-12 text-center"><h2 className="text-2xl font-bold mb-4">Our portfolio</h2><Link href="/en/portfolio" className="inline-block p-3 text-blue-900 font-semibold underline">Explore our work →</Link></section>
 <ServicesCTA locale="en" data={{cta:{heading:'Not sure which service fits your project?',description:'Tell us about the decision you need to make. We can discuss the scope, information required, deliverables, fees and timeline before work starts.'}}} />
 </div>
}
