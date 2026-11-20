import {rounds,type TonrobRound} from '@/lib/tonrob';
import {roundMetadata} from '@/lib/tonrob-metadata';
import {TonrobRoundPage} from '@/components/tonrob/TonrobRoundPage';
const base=rounds.find(r=>r.id==='tonrob-2570')!;
export const metadata=roundMetadata(base);
export default async function Tonrob2570({searchParams}:{searchParams:Promise<{previewStatus?:string}>}){
 const params=await searchParams;
 const round:TonrobRound=process.env.DAP_LOCAL_PREVIEW==='true'&&params.previewStatus==='closed'?{...base,status:'closed'}:base;
 return <TonrobRoundPage round={round}/>;
}

