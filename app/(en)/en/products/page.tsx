import ContactBar from '@/components/layout/ContactBar';
import PageHeader from '@/components/shared/PageHeader';
import ProductGrid from '@/components/products/ProductGrid';
import ProductsCTA from '@/components/products/ProductsCTA';
import DongFundaTrust from '@/components/products/DongFundaTrust';
import products from '@/data/products-en.json';
import {generatePageMetadata} from '@/lib/seo';
export const metadata=generatePageMetadata({title:'Thai-Language Courses, E-books & Templates | DongFunda',description:'Explore DongFunda courses, E-books and templates for business and financial analysis. English overview; course instruction and learning materials are in Thai.',path:'/en/products',locale:'en'});
export default function EnglishProducts(){return <div className="bg-gray-50"><ContactBar locale="en"/><PageHeader badge="Our Products" title="Courses, E-books & Learning Resources" description="Explore business and financial analysis with DongFunda. Course instruction, videos, E-books and original product details are in Thai."/><DongFundaTrust locale="en"/><section className="pt-8 pb-20 bg-white" id="products"><div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl"><ProductGrid products={products} locale="en"/></div></section><ProductsCTA locale="en" data={{cta:{heading:'Build your understanding, step by step',description:'Choose a Thai-language course or resource that fits your learning goals. Ask us about the contents before enrolling.'}}}/></div>}
