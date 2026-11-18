import LeadForm from '@/components/contact/LeadForm';
import { EnglishCTA } from '@/components/services/EnglishServices';
import { generatePageMetadata } from '@/lib/seo';
export const metadata = generatePageMetadata({title: 'About & Contact | DAP Strategic', description: 'Business and financial strategy for Thai SMEs. Learn about DAP Strategic and discuss your project through WhatsApp, LINE, email or our enquiry form.', path: '/en/contact', locale: 'en'});
const missions = [
  ['Improve business decisions', 'Help entrepreneurs, investors and organisations analyse business, finance and investment systematically.'],
  ['Build practical tools and knowledge', 'Develop feasibility studies, financial models, business strategies, digital products and online courses that help people think clearly, make decisions and grow.'],
  ['Connect strategy, business and finance', 'Bring experience in project development, business analysis and financial planning together to develop an approach suited to each business.'],
  ['Support the long-term competitiveness of Thai SMEs', 'We believe Thai SMEs have the potential to grow with a clear direction and a sound way of thinking.'],
];
const principles = [
  ['Business Mindset', 'A business should be able to scale. Clear logic, measurable processes and continuous improvement help make this possible. We use data, technology and strategy to simplify operations and support long-term growth.'],
  ['Financial Thinking', 'Marketing, expansion, investment and management decisions should connect with financial results: profit, cash flow and the ability to grow sustainably. We focus on feasibility, business planning and decisions grounded in real information.'],
  ['Strategic Perspective', 'A strategy needs to be actionable and measurable. We analyse industries, competitors, positioning and growth opportunities to help owners make better-informed decisions.'],
  ['Practical Execution', 'Our work supports investors, entrepreneurs and organisations in putting ideas into practice through frameworks, tools, business strategy and a clear way of thinking. Sustainable growth starts with action in the right direction.'],
];
export default function EnglishContactPage() {
  return <>
    <section className="bg-gray-50 px-5 py-20"><div className="mx-auto max-w-6xl"><p className="mb-5 font-semibold text-blue-900">About DAP Strategic</p><h1 className="mb-7 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">Clear strategy behind business progress</h1><p className="max-w-3xl text-lg leading-relaxed text-gray-600">DAP Strategic was founded on the belief that Thai SMEs can grow nationally with the right direction. We combine experience working with leading organisations with an understanding of the context of small and medium-sized businesses.</p></div></section>
    <section className="mx-auto max-w-6xl px-5 py-16"><h2 className="mb-6 text-3xl font-bold">Our vision</h2><p className="max-w-3xl text-lg leading-relaxed text-gray-600">To be a strategic and financial partner for Thai SMEs, helping businesses grow steadily through data, analysis and practical strategic thinking.</p><h2 className="mb-8 mt-14 text-3xl font-bold">Our mission</h2><div className="grid gap-6 md:grid-cols-2">{missions.map(([title,body])=><article key={title} className="rounded-2xl bg-gray-50 p-7"><h3 className="mb-3 text-xl font-bold">{title}</h3><p className="leading-relaxed text-gray-600">{body}</p></article>)}</div></section>
    <section className="bg-gray-900 px-5 py-16 text-white"><div className="mx-auto max-w-6xl"><h2 className="mb-9 text-3xl font-bold">Our core philosophy</h2><div className="grid gap-6 md:grid-cols-2">{principles.map(([title,body])=><article key={title} className="rounded-2xl border border-gray-700 bg-gray-800 p-7"><h3 className="mb-4 text-2xl font-bold">{title}</h3><p className="leading-relaxed text-gray-300">{body}</p></article>)}</div></div></section>
    <section className="mx-auto max-w-6xl px-5 py-16"><h2 className="mb-4 text-3xl font-bold">Start a conversation</h2><p className="mb-9 text-gray-600">Tell us about your business and the decision you need to make. Contact us for an initial consultation.</p><div className="grid gap-10 lg:grid-cols-2"><div><EnglishCTA section="en_about_contact" /><h3 className="mb-3 mt-10 text-xl font-bold">Office</h3><address className="max-w-md not-italic leading-relaxed text-gray-600">711/209 Moo 9, Nai Khlong Bang Pla Kot,<br/>Phra Samut Chedi, Samut Prakan 10290, Thailand</address></div><LeadForm locale="en" /></div></section>
  </>;
}
