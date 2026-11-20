import dataset from '@/data/tonrob-rounds.json';
export type RoundStatus = 'open' | 'closed' | 'draft';
export type TonrobRound = Omit<(typeof dataset.rounds)[number], 'status'> & {status: RoundStatus};
export const rounds: TonrobRound[] = dataset.rounds as TonrobRound[];
export const listedRounds = () => rounds.filter(r => r.status !== 'draft');
export const latestOpenRound = () => listedRounds().find(r => r.id === dataset.currentRoundId && r.status === 'open') ?? null;
export const roundPath = (round: Pick<TonrobRound,'slug'>) => '/products/' + round.slug;
export function checkoutUrl(round: TonrobRound): string | null {
 if(round.status !== 'open') return null;
 const u=new URL(round.paymentUrl);
 if(u.origin !== 'https://pay.sn' || u.pathname !== '/dongfunda/'+round.price+'/'+round.paymentProduct) throw new Error('Round payment mismatch');
 return u.href;
}
export function courseSchema(round: TonrobRound) {
 return {'@context':'https://schema.org','@type':'Course', name:round.name, description:round.opening,
 inLanguage:'th', provider:{'@type':'Organization',name:'DongFunda',url:'https://www.dap.co.th/dongfunda'},
 url:'https://www.dap.co.th'+roundPath(round),
 offers:{'@type':'Offer',price:round.price,priceCurrency:round.currency,url:'https://www.dap.co.th'+roundPath(round),
 availability:round.status==='open'?'https://schema.org/InStock':'https://schema.org/SoldOut'}};
}

