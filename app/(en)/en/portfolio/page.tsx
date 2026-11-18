import EnglishSelectedPortfolio from '@/components/portfolio/EnglishSelectedPortfolio';
import { EnglishCTA } from '@/components/services/EnglishServices';
import { generatePageMetadata } from '@/lib/seo';
export const metadata = generatePageMetadata({title: 'Portfolio | DAP Strategic', description: 'Selected business planning, feasibility, financial planning and strategy assignments across a range of industries.', path: '/en/portfolio', locale: 'en'});
export default function EnglishPortfolioPage() {
  return <div className="bg-gray-50"><EnglishSelectedPortfolio /><section className="mx-auto max-w-6xl px-5 py-16"><h2 className="mb-6 text-3xl font-bold">Planning a similar project?</h2><EnglishCTA section="en_portfolio" /></section></div>;
}
