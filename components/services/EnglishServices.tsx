import Link from 'next/link';
import { englishServices } from '@/data/services-en';
import TrackedLink from '@/components/shared/TrackedLink';
import { DONGFUNDA_LINE_URL, DAP_WHATSAPP_URL, DAP_CONTACT_EMAIL } from '@/lib/site-identity';
import { Mail, MessageCircle, ArrowUpRight } from 'lucide-react';

export function EnglishCTA({section = 'en_services'}: {section?: string}) {
  const secondary = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold text-blue-900 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500";
  return <div className="min-w-0">
    <p className="mb-4 font-semibold">Discuss your project</p>
    <div className="flex flex-wrap gap-3">
      <a href={DAP_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-500"><MessageCircle aria-hidden="true" size={18}/>WhatsApp<ArrowUpRight aria-hidden="true" size={16}/></a>
      <TrackedLink href={DONGFUNDA_LINE_URL} eventType="line" section={section} target="_blank" rel="noopener noreferrer" className={secondary}><MessageCircle aria-hidden="true" size={18}/>LINE<ArrowUpRight aria-hidden="true" size={16}/></TrackedLink>
      <a href={`mailto:${DAP_CONTACT_EMAIL}`} className={secondary}><Mail aria-hidden="true" size={18}/>Email</a>
    </div>
  </div>;
}

export function EnglishServiceCards() {
  return <div className="grid gap-6 md:grid-cols-3">{englishServices.map(service => <article key={service.slug} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-7">
    <h2 className="mb-4 text-2xl font-bold">{service.title}</h2>
    <p className="mb-6 grow leading-relaxed text-gray-600">{service.description}</p>
    <Link className="font-semibold text-blue-900 underline underline-offset-4" href={`/en/services/${service.slug}`}>Explore the service →</Link>
  </article>)}</div>;
}

export function EnglishServiceDetail({service}: {service: typeof englishServices[number]}) {
  return <>
    <section className="bg-gray-950 px-5 py-20 text-white"><div className="mx-auto max-w-5xl">
      <Link href="/en/services" className="mb-8 inline-block text-blue-200 underline">← All services</Link>
      <p className="mb-4 font-semibold text-blue-300">{service.title}</p>
      <h1 className="mb-7 max-w-4xl text-3xl font-bold leading-tight md:text-5xl">{service.headline}</h1>
      <p className="mb-9 max-w-3xl text-lg leading-relaxed text-gray-300">{service.description}</p>
      <EnglishCTA section={`en_${service.slug}_hero`} />
    </div></section>
    <div className="mx-auto max-w-5xl space-y-16 px-5 py-16">
      <section><h2 className="mb-4 text-2xl font-bold">Who this is for</h2><p className="leading-relaxed text-gray-600">{service.audience}</p></section>
      <section><h2 className="mb-4 text-2xl font-bold">How we approach the work</h2><p className="leading-relaxed text-gray-600">{service.approach}</p></section>
      <div className="grid gap-10 md:grid-cols-2">
        <section className="rounded-2xl bg-blue-50 p-7"><h2 className="mb-5 text-2xl font-bold">Proposed deliverables</h2><ul className="list-disc space-y-3 pl-5">{service.deliverables.map(s=><li key={s}>{s}</li>)}</ul><p className="mt-6 text-sm text-gray-600">The proposal confirms the exact scope, deliverables, fee and timeline before work starts.</p></section>
        <section><h2 className="mb-5 text-2xl font-bold">Information to prepare</h2><ul className="list-disc space-y-3 pl-5 text-gray-600">{service.inputs.map(s=><li key={s}>{s}</li>)}</ul></section>
      </div>
      {service.sections.map(section=><section key={section.title}><h2 className="mb-5 text-2xl font-bold">{section.title}</h2><div className="space-y-5 leading-relaxed text-gray-600">{section.paragraphs.map(p=><p key={p}>{p}</p>)}</div></section>)}
      {service.slug === 'feasibility-study' && <section><h2 className="mb-5 text-2xl font-bold">Pool Villa: connect project inputs with decisions</h2><div className="overflow-x-auto rounded-xl border border-gray-200"><table className="w-full text-left text-sm"><thead className="bg-blue-50"><tr><th scope="col" className="p-4">Input</th><th scope="col" className="p-4">What it helps assess</th></tr></thead><tbody>{[
        ['Location, land area and land price','Project scope and land investment'],
        ['Sale or rental model, target customers and pricing','Revenue assumptions and timing of receipts'],
        ['Construction, fit-out, systems and investment schedule','Capital expenditure and payment timing'],
        ['Operating costs and funding sources','Cash requirements and working capital'],
        ['Delays, cost increases or lower-than-planned revenue','Scenarios to compare before committing'],
      ].map(row=><tr className="border-t border-gray-200" key={row[0]}>{row.map((cell,i)=>i===0?<th scope="row" className="p-4 font-medium" key={cell}>{cell}</th>:<td className="p-4" key={cell}>{cell}</td>)}</tr>)}</tbody></table></div><Link href="/portfolio" hrefLang="th" className="mt-5 inline-block text-blue-900 underline">View the Pool Villa portfolio (Thai) →</Link></section>}
      <section><h2 className="mb-5 text-2xl font-bold">Frequently asked questions</h2>{service.faq.map(([q,a])=><details key={q} className="border-b border-gray-200 py-5"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-4 leading-relaxed text-gray-600">{a}</p></details>)}</section>
      <section><h2 className="mb-5 text-2xl font-bold">Discuss the scope before you start</h2><EnglishCTA section={`en_${service.slug}_footer`} /><div className="mt-8 flex flex-wrap gap-5">{englishServices.filter(s=>s.slug!==service.slug).map(s=><Link key={s.slug} href={`/en/services/${s.slug}`} className="text-blue-900 underline">{s.title}</Link>)}</div></section>
    </div>
  </>;
}
