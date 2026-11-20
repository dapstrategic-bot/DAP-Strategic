'use client';
import {useEffect,useRef} from 'react';
import type {TonrobRound} from '@/lib/tonrob';
import {recordCourseEvent} from './CourseActions';
export function R07Markup({html,round}:{html:string;round:TonrobRound}){
 const el=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const root=el.current;if(!root)return;
  const click=(event:MouseEvent)=>{
   const target=event.target as Element;
   if(target.closest('.purchase-open')){recordCourseEvent('tonrob_payment_summary',round,'purchase');root.querySelector<HTMLDialogElement>('dialog')?.showModal();}
   if(target.closest('.dialog-close'))root.querySelector<HTMLDialogElement>('dialog')?.close();
   const link=target.closest<HTMLAnchorElement>('a');
   if(link?.href===round.lineUrl)recordCourseEvent('tonrob_line_click',round,'r07_page');
   if(link?.hasAttribute('data-checkout-link'))recordCourseEvent('begin_checkout',round,'payment_dialog');
  };root.addEventListener('click',click);return()=>root.removeEventListener('click',click);
 },[round]);
 return <div ref={el} dangerouslySetInnerHTML={{__html:html}}/>;
}

