import Link from 'next/link';
import Image from 'next/image';
import { lhApproved as data, chapterSeconds } from '@/lib/dongfunda/lh-preview';

/** Approved LH package rendered inside the existing Next.js detail route and app shell. */
export function LhApprovedPreview() {
  return <div className="df">
    <div className="df-demo">LOCAL PREVIEW · ฉบับร่างสำหรับตรวจ ยังไม่เผยแพร่เว็บไซต์</div>
    <div className="df-container">
      <nav className="df-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span>/</span><Link href="/dongfunda">DongFunda</Link><span>/</span><span>LH</span>
      </nav>
      <article className="df-article" data-content-id={data.content_id} data-video-version={data.versions.video}>
        <header className="df-article-header">
          <div className="df-chips">LH · ธุรกิจ · งบการเงิน</div>
          <h1>{data.seo.h1}</h1>
          <p className="df-excerpt">{data.seo.summary}</p>
          <div className="df-article-meta"><span>DongFunda by DAP</span><span>วิดีโอ 1:26:06</span></div>
        </header>
        <div className="df-article-cover">
          <Image src="/dongfunda-lh-preview-cover" alt={data.seo.alt} width={1672} height={941}
            sizes="(max-width: 980px) 100vw, 920px" priority unoptimized style={{width:'100%',height:'auto'}} />
        </div>
        <div className="df-article-body">
          <section id="video"><h2>ดูวิดีโอ</h2><p id="video-title">{data.title}</p>
            <div className="df-notice">Owner แจ้งตั้งเวลาวิดีโอวันที่ 19 กันยายน 2026 — ยังไม่ยืนยันว่าเปิดดูสาธารณะได้ และไม่ทราบเวลา/เขตเวลาที่ตั้ง</div>
            <a className="df-button df-button-outline" href={data.publication.url} target="_blank" rel="noopener noreferrer">เปิดลิงก์วิดีโอใน YouTube</a>
          </section>
          <section><h2>เรื่องราวในคลิป</h2><p id="approved-description">{data.description}</p></section>
          <section id="chapters"><h2>เลือกดูตามหัวข้อ</h2>
            <ol style={{listStyle:'none',padding:0}}>{data.chapters.map(chapter=><li key={chapter.display_time}>
              <a className="lh-chapter" style={{display:'block',padding:'8px 0',color:'var(--df-blue)'}} href={`${data.publication.url}?t=${chapterSeconds(chapter.display_time)}`} target="_blank" rel="noopener noreferrer">
                <span style={{display:'inline-block',minWidth:80,fontWeight:600}}>{chapter.display_time}</span>{' '}{chapter.title}
              </a>
            </li>)}</ol>
          </section>
          <section className="df-takeaways"><h2>ร่วมแลกเปลี่ยนมุมมอง</h2><p>{data.seo.cta}</p></section>
          <details style={{border:'1px solid var(--df-line)',padding:20,borderRadius:8}}>
            <summary style={{cursor:'pointer'}}>ข้อความประกอบและ SEO สำหรับตรวจฉบับร่าง</summary>
            <section><h2>Caption</h2><p id="caption">{data.caption}</p></section>
            <section><h2>Hashtags</h2><p id="hashtags">{data.hashtags}</p></section>
            <section><h2>CTA / Brand</h2><p id="cta-brand">{data.cta_brand}</p></section>
            {data.seo.outline.map(section=><section key={section.h2}><h2>{section.h2}</h2>{section.h3.map(heading=><h3 key={heading}>{heading}</h3>)}</section>)}
          </details>
        </div>
      </article>
    </div>
  </div>;
}
