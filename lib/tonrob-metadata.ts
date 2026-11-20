import type {Metadata} from 'next';
import type {TonrobRound} from '@/lib/tonrob';
import {roundPath} from '@/lib/tonrob';
import {generatePageMetadata} from '@/lib/seo';
import {SITE_URL} from '@/lib/site-identity';
export function roundMetadata(round:TonrobRound):Metadata {
 const title=round.name+' | เรียน '+round.format+' '+round.teachingDays+' วันกับ DongFunda';
 const description=round.name+' ราคาปกติ '+round.originalPrice.toLocaleString('th-TH')+' บาท เหลือ '+round.price.toLocaleString('th-TH')+' บาท เริ่ม '+round.startMonth+' มีบันทึกย้อนหลัง พร้อมเข้ากลุ่ม Online ฟรี';
 const meta=generatePageMetadata({title,description,path:roundPath(round),ogImage:SITE_URL+round.poster,noIndex:round.status==='draft'});
 return {...meta,openGraph:{...meta.openGraph,images:[{url:SITE_URL+round.poster,width:1080,height:1350,alt:round.name}]}};
}

