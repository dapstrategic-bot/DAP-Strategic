import Link from 'next/link';
import {generatePageMetadata} from '@/lib/seo';
import {listedRounds,latestOpenRound,roundPath} from '@/lib/tonrob';
import {TonrobRoundPage} from '@/components/tonrob/TonrobRoundPage';
import '@/components/tonrob/tonrob.css';
export const metadata=generatePageMetadata({title:'หุ้นต้นรอบ | คอร์สเรียน DongFunda และรอบล่าสุด',description:'เรียนรู้ธุรกิจ งบการเงิน มูลค่า และกราฟกับ DongFunda ดูรายละเอียดคอร์สหุ้นต้นรอบ รอบที่เปิดรับสมัคร และประวัติรอบเรียน',path:'/products/tonrob'});
export default function TonrobSeries(){
 const active=latestOpenRound(), history=listedRounds();
 if(active) return <><TonrobRoundPage round={active}/><section className="tonrob"><div className="tonrob-container tonrob-section" id="rounds"><h2>รอบเรียนและประวัติ</h2>{history.map(r=><p key={r.id}><Link className="tonrob-back-link" href={roundPath(r)}>{r.name} — {r.status==='open'?'เปิดรับสมัคร':'ปิดรับสมัครแล้ว'}</Link></p>)}</div></section></>;
 return <div className="tonrob"><header className="tonrob-hero"><div className="tonrob-container"><Link href="/products" className="tonrob-back">Products / คอร์สเรียน DongFunda</Link><span className="tonrob-badge">DongFunda Learning</span><h1>หุ้นต้นรอบ</h1><h2>จากความเข้าใจธุรกิจ<br/>สู่แผนลงทุนที่มีเหตุผล</h2><p>เรียนเชื่อมธุรกิจ งบการเงิน มูลค่า และกราฟ พร้อมฝึกวิเคราะห์ผ่านตัวอย่างหุ้นจริง</p><a className="tonrob-line" href={active?'#current-course':'#rounds'}>{active?'ดูรายละเอียดรอบล่าสุด':'ดูประวัติรอบเรียน'}</a></div></header>

 <section className="tonrob-container tonrob-section" id="rounds"><h2>รอบเรียนของ DongFunda</h2><p>แต่ละรอบมีรายละเอียด ราคา และสิทธิ์ของตัวเอง ตรวจข้อมูลของรอบที่สนใจก่อนตัดสินใจครับ</p>
 <div className="tonrob-round-list">{history.map(r=><article className="tonrob-round-card" key={r.id}><img src={r.poster} alt={'ภาพคอร์ส '+r.name}/><div><span className="tonrob-status">{r.status==='open'?'เปิดรับสมัคร':'ปิดรับสมัครแล้ว'}</span><h3>{r.name}</h3><p>เริ่มเรียนเดือน{r.startMonth}<br/>{r.format} · {r.teachingDays} วัน · มีบันทึกย้อนหลัง</p><del>ราคาปกติ {r.originalPrice.toLocaleString('th-TH')} บาท</del><strong className="tonrob-price">{r.price.toLocaleString('th-TH')} <small>บาท</small></strong><Link className="tonrob-buy" href={roundPath(r)}>ดูรายละเอียดรอบนี้</Link></div></article>)}</div></section>
 <section className="tonrob-container tonrob-section"><h2>เข้าใจธุรกิจก่อนมองจังหวะ</h2><p>แนวทาง DongFunda เชื่อมข้อมูลกิจการกับคุณภาพกำไร มูลค่า และโครงสร้างราคา เพื่อนำกลับไปฝึกคิดและวางแผนด้วยตัวเอง</p><p className="tonrob-note">เนื้อหาเพื่อการศึกษา ไม่ใช่คำแนะนำซื้อขายหรือการรับรองผลตอบแทน</p></section></div>
}

