import products from '@/data/products-en.json';
import Hub from '@/components/dongfunda/Hub';
import ContactBar from '@/components/layout/ContactBar';
import {getContent,getRecommendations} from '@/lib/dongfunda/data';
import {discoveryContent} from '@/lib/dongfunda/model';
import {generatePageMetadata} from '@/lib/seo';
import '@/app/(th)/dongfunda/dongfunda.css';
import '@/app/(th)/dongfunda/financials.css';
export const dynamic='force-dynamic';
export const metadata=generatePageMetadata({title:'DongFunda | Business & Financial Analysis — Thai Content',description:'Understand businesses through financial statements, cash flow and valuation. English guide to DongFunda articles, videos and courses. Original content is in Thai.',path:'/en/dongfunda',locale:'en'});
const headings:Record<string,{title:string;excerpt:string}>={
'หุ้น LH ฟื้นได้ไหม? เจาะธุรกิจ เงินสด และมูลค่า':{title:'Can LH recover? Business, cash flow and value',excerpt:'Explore the business, inventory, cash flow and margins in the original Thai analysis. Valuation examples use assumptions and prices from the source period.'},
'BDMS: มองขนาดธุรกิจผ่านรายได้ กำไร และเงินสด':{title:'BDMS: understanding scale through revenue, profit and cash flow',excerpt:'Connect the scale of the hospital business with the revenue, profit and cash flow presented in the original Thai video.'}};
const labels:Record<string,string>={"หุ้น LH": "LH stock", "LH ฟื้นได้ไหม": "LH recovery", "วิเคราะห์หุ้น LH": "LH analysis", "ธุรกิจ LH": "LH business", "งบการเงิน LH": "LH financial statements", "กระแสเงินสด LH": "LH cash flow", "สินค้าคงเหลืออสังหาริมทรัพย์": "Property inventories"};
export default async function EnglishDongFunda(){const items=await getContent();const rec=await getRecommendations();return <><ContactBar locale="en"/><Hub locale="en" demo={false} items={items.map(discoveryContent).map(i=>({...i,...headings[i.title],summary:headings[i.title]?.excerpt || 'Original article and video in Thai.',tags:i.tags?.map(t=>labels[t] || t), secondary_topics:i.secondary_topics?.map(t=>labels[t] || t), primary_topic:i.primary_topic==='โรงพยาบาล'?'Healthcare':i.primary_topic}))} {...rec} product={rec.product ? {...rec.product,title:products.find(p=>p.slug.current===rec.product?.slug)?.title || 'DongFunda course (Thai)'} : null}/></>}
