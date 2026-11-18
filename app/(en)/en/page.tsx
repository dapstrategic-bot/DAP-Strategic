import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { EnglishCTA, EnglishServiceCards } from '@/components/services/EnglishServices';
export const metadata = generatePageMetadata({title: 'Business Plan, Feasibility Study & Strategy | DAP Strategic', description: 'Business and financial consulting for owners starting or expanding a business. Connect market evidence, investment, costs and cash flow with strategic decisions.', path: '/en', locale: 'en'});
export default function EnglishHome() {
  return <>
    <section className="bg-gray-50 px-5 py-20 md:py-28"><div className="mx-auto max-w-5xl text-center">
      <p className="mb-6 font-semibold text-blue-900">For business owners and investors</p>
      <h1 className="mb-7 text-4xl font-bold leading-tight md:text-6xl">Business Plan &amp; Feasibility Study<br/><span className="text-blue-900">for starting and growing your business</span></h1>
      <p className="mx-auto mb-9 max-w-3xl text-lg leading-relaxed text-gray-600">Understand the market, investment, revenue, costs and cash flow before deciding how to start, expand or prepare for funding.</p>
      <div className="flex justify-center"><EnglishCTA section="en_home_hero" /></div>
      <Link href="/en/services" className="mt-6 inline-block font-semibold text-blue-900 underline">Explore our services →</Link>
    </div></section>
    <section className="mx-auto max-w-6xl px-5 py-20"><h2 className="mb-5 text-3xl font-bold">Why DAP Strategic?</h2><p className="mb-10 text-gray-600">Business understanding, financial thinking and strategic decisions, connected in one practical framework.</p>
      <div className="grid gap-7 md:grid-cols-2">{[
        ['Business Understanding','Understand how the business creates value, earns revenue and competes, and where its risks lie.'],
        ['Financial Thinking','Connect the business model with revenue, profit, financial position and cash flow.'],
        ['Strategic Decisions','Turn evidence into decisions about investment, development and business direction.'],
        ['Repeatable Framework','Build a way of thinking that can be used again for future decisions.'],
      ].map(([h,p])=><article key={h} className="rounded-2xl bg-gray-50 p-7"><h3 className="mb-3 text-xl font-bold">{h}</h3><p className="leading-relaxed text-gray-600">{p}</p></article>)}</div>
    </section>
    <section className="bg-gray-50 px-5 py-20"><div className="mx-auto max-w-6xl"><h2 className="mb-9 text-3xl font-bold">Our core services</h2><EnglishServiceCards /></div></section>
    <section className="mx-auto max-w-5xl px-5 py-20"><h2 className="mb-5 text-3xl font-bold">Experience that informs the analysis</h2><p className="mb-6 leading-relaxed text-gray-600">Explore publicly shareable project scopes in business planning, feasibility and financial modelling. Client-sensitive information stays confidential.</p><Link href="/en/portfolio" className="text-blue-900 underline">View project experience →</Link></section>
    <section className="bg-blue-50 px-5 py-16"><div className="mx-auto max-w-5xl"><h2 className="mb-5 text-3xl font-bold">DAP Strategic and DongFunda</h2><p className="mb-5 leading-relaxed text-gray-600">DAP Strategic provides business consulting. DongFunda is our business and financial education media brand, including videos and learning resources.</p><div className="flex flex-wrap gap-6"><Link href="/dongfunda" hrefLang="th" className="text-blue-900 underline">Explore DongFunda (Thai)</Link><Link href="/products" hrefLang="th" className="text-blue-900 underline">Courses and products (Thai)</Link></div></div></section>
  </>;
}
