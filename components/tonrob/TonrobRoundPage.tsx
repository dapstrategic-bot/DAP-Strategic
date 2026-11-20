import {notFound} from 'next/navigation';
import {serializeJsonLd} from '@/lib/site-identity';
import {checkoutUrl,courseSchema,type TonrobRound} from '@/lib/tonrob';
import {CourseView} from './CourseActions';
import {roundMarkup} from '@/lib/tonrob-r07';
import {R07Markup} from './R07Markup';
import './tonrob.css';
import './r07.css';
export function TonrobRoundPage({round}:{round:TonrobRound}){
 if(round.status==='draft')notFound();
 return <div className="tonrob tonrob-r07"><CourseView round={round}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(courseSchema(round))}}/><R07Markup html={roundMarkup(round,checkoutUrl(round))} round={round}/></div>;
}

