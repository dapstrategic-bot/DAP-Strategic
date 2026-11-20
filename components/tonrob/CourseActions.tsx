'use client';
import {useEffect,useRef} from 'react';
import type {TonrobRound} from '@/lib/tonrob';
declare global { interface Window { __tonrobPreviewEvents?: Array<Record<string,unknown>>; } }
type EventName='view_item'|'tonrob_line_click'|'tonrob_payment_summary'|'begin_checkout';
function record(name:EventName, round:TonrobRound, placement:string) {
 const payload={course_series:'tonrob',round_id:round.id,course_status:round.status,currency:'THB',value:round.price,placement,page_language:'th'};
 if(process.env.NEXT_PUBLIC_DAP_PREVIEW==='true') {
  window.__tonrobPreviewEvents ??= [];window.__tonrobPreviewEvents.push({event:name,...payload});return;
 }
 const params={...payload,items:[{item_id:round.id,item_name:round.name,price:round.price}]};
 if(typeof window.gtag==='function') window.gtag('event',name,params);
 else {window.dataLayer ??= [];window.dataLayer.push({event:name,...params});}
}
export const recordCourseEvent=record;
export function CourseView({round}:{round:TonrobRound}) {const seen=useRef(false);useEffect(()=>{if(!seen.current){seen.current=true;record('view_item',round,'round_page')}},[round]);return null;}
export function CourseLine({round,children,placement='course'}:{round:TonrobRound;children:React.ReactNode;placement?:string}) {
 return <a className="tonrob-line" href={round.lineUrl} target="_blank" rel="noopener noreferrer" onClick={()=>record('tonrob_line_click',round,placement)}>{children}</a>;
}
export function CoursePayment({round,url}:{round:TonrobRound;url:string|null}) {
 const dialog=useRef<HTMLDialogElement>(null);
 if(!url) return <div className="tonrob-closed"><strong>ปิดรับสมัครแล้ว</strong><p>ดูรายละเอียดรอบล่าสุดที่หน้าหลักหุ้นต้นรอบ</p><a href="/products/tonrob">ดูรอบล่าสุด</a></div>;
 return <><button className="tonrob-buy" onClick={()=>{record('tonrob_payment_summary',round,'purchase');dialog.current?.showModal()}}>สมัครเรียน / ชำระเงิน</button>
 <dialog className="tonrob-dialog" ref={dialog}><div className="tonrob-dialog-head"><span>รายละเอียดก่อนชำระเงิน</span><button aria-label="ปิด" onClick={()=>dialog.current?.close()}>×</button></div>
 <h2>{round.name}</h2><p>{round.format} · {round.teachingDays} วัน · มีบันทึกให้ดูย้อนหลังได้</p>
 <del>ราคาปกติ {round.originalPrice.toLocaleString('th-TH')} บาท</del><h3>{round.price.toLocaleString('th-TH')} บาท</h3>
 <dl><div><dt>ร้านค้า</dt><dd>dongfunda</dd></div><div><dt>สินค้า</dt><dd>{round.paymentProduct}</dd></div></dl>
 <p className="tonrob-note">กรุณาสอบถามวันเวลาและเงื่อนไขสมัครให้ครบก่อนชำระเงิน</p>
 <a className="tonrob-buy" data-checkout-link href={url} target="_blank" rel="noopener noreferrer" onClick={()=>record('begin_checkout',round,'payment_dialog')}>ไปหน้าชำระเงิน {round.price.toLocaleString('th-TH')} บาท</a>
 <CourseLine round={round} placement="payment_dialog">สอบถามทาง LINE ก่อน</CourseLine><small>การเปิดลิงก์ไม่ถือว่าชำระเงินสำเร็จ</small></dialog></>;
}

