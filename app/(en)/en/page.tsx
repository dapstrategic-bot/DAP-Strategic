import HeroSection from '@/components/home/HeroSection';
import ValueProposition from '@/components/home/ValueProposition';
import ServicesOverview from '@/components/home/ServicesOverview';
import PortfolioSection from '@/components/home/PortfolioSection';
import PortfolioHighlight from '@/components/home/PortfolioHighlight';
import HomeCTA from '@/components/home/HomeCTA';
import ContactBar from '@/components/layout/ContactBar';
import { generatePageMetadata } from '@/lib/seo';
import copy from '@/data/english-home.json';
export const metadata = generatePageMetadata({...copy.homePageQuery.seo, path:'/en', locale:'en'});
export default function EnglishHome() {
 const home = copy.homePageQuery;
 return <>
 <HeroSection locale="en" hero={home.hero} />
 <ContactBar locale="en" />
 <ValueProposition locale="en" valueProps={home.valueProps} />
 <ServicesOverview locale="en" services={copy.servicesQuery} />
 <PortfolioSection locale="en" portfolios={copy.portfolioQuery} />
 <PortfolioHighlight locale="en" stats={home.stats} />
 <HomeCTA locale="en" cta={home.cta} />
 </>;
}
