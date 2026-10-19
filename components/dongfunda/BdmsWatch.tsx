import Link from 'next/link';
import Image from 'next/image';
import { articleStructuredData } from '@/lib/dongfunda/seo';
import { safeLink, videoEmbed, type DongFundaContent } from '@/lib/dongfunda/model';
import styles from './BdmsWatch.module.css';
import videoMetadata from './bdms-video-metadata.json';
import { bdmsChapters, canUseBdmsWatch } from './bdms-watch-model';

export { canUseBdmsWatch };
export default function BdmsWatch({ item }: { item: DongFundaContent }) {
  const blocks = item.content_blocks || [];
  const benefits = blocks.filter(block => /^section-[0-3]$/.test(block._key));
  const description = blocks.find(block => block._key === 'approved-description');
  const archivedTitle = blocks.find(block => block._key === 'source-title');
  const embed = videoEmbed(item.video_embed || item.video_url)!;
  const structured = articleStructuredData(item);
  const structuredWithVideo = { ...structured, '@graph': [...structured['@graph'], {
    '@type': 'VideoObject', '@id': `${item.canonical_url}#video`, name: videoMetadata.name,
    description: item.meta_description || item.excerpt, thumbnailUrl: [item.thumbnail!.url],
    uploadDate: videoMetadata.uploadDate, duration: videoMetadata.duration, embedUrl: embed,
    mainEntityOfPage: item.canonical_url, publisher: { '@type': 'Organization', name: 'DongFunda' },
  }] };
  return (
    <div className={styles.root} data-bdms-watch="R04">
      {!item.demo && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredWithVideo).replace(/</g, '\\u003c') }} />}
      <div className={styles.toolbar}>
        <Link className={styles.wordmark} href="/dongfunda">DongFunda <span>by DAP</span></Link>
        <form className={styles.search} action="/dongfunda" method="get" role="search">
          <span aria-hidden="true">⌕</span><input name="q" type="search" placeholder="ค้นหาบทความ บริษัท และงบการเงิน..." aria-label="ค้นหาบทความ บริษัท และงบการเงิน" />
        </form>
      </div>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/dongfunda">DongFunda</Link> / BDMS / วิดีโอสำหรับมือใหม่</nav>
        <article>
          <h1>{item.title}</h1>
          <p className={styles.intro}>{item.excerpt || item.summary}</p>
          <div className={styles.by}>DongFunda by DAP · บทความเดิมเผยแพร่ {item.published_at && <time dateTime={item.published_at}>{new Date(item.published_at).toLocaleDateString('th-TH', { day:'numeric', month:'long', year:'numeric', timeZone:'Asia/Bangkok' })}</time>} · ข้อมูลในคลิปตามช่วงเวลาต้นทาง</div>
          <div className={styles.player} id="video">
            {item.thumbnail?.url && <Image unoptimized src={item.thumbnail.url} alt={item.thumbnail.alt || 'ภาพปก BDMS C02'} width="1672" height="941" />}
            <iframe src={embed} title={item.title} loading="eager" allow="fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
          </div>
          <div className={styles.actions}>
            <a className={styles.button} href={safeLink(item.video_url) || 'https://youtu.be/wkLXOQQ3lLc'} target="_blank" rel="noopener noreferrer">ดูคลิปเต็มบน YouTube ↗</a>
            <a className={styles.outline} href="#chapters">เลือกหัวข้อที่สนใจ ↓</a>
            <Link className={styles.outline} href="/dongfunda/companies/bdms">ดูกราฟงบ BDMS ↗</Link>
          </div>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h2>ดูคลิปนี้แล้วเข้าใจอะไรเพิ่ม?</h2>
              {benefits.map(block => <section key={block._key}><h3>{block.heading}</h3><p>{block.text}</p></section>)}
              <div className={styles.links}><h3>อ่านต่อและฝึกวิเคราะห์</h3>
                <Link href="/dongfunda/companies/bdms">กราฟรายได้ กำไร และฐานะการเงิน BDMS</Link>
                <Link href="/dongfunda/bdms-revenue-profit-business-scale">BDMS: มองขนาดธุรกิจผ่านรายได้ กำไร และเงินสด</Link>
                <Link href="/dongfunda/lh-business-cashflow-valuation">ตัวอย่างอีกธุรกิจ: LH ธุรกิจ เงินสด และมูลค่า</Link>
                <Link href="/products/dongfunda-stock-analysis(Online-Course)">ศึกษารายละเอียดคอร์สวิเคราะห์หุ้น</Link>
              </div>
            </div>
            <aside className={styles.card} id="chapters" aria-labelledby="bdms-chapter-heading">
              <h2 id="bdms-chapter-heading">เลือกดูตามหัวข้อ</h2><p>14 ช่วงจากคลิปต้นทาง · ลิงก์เปิด YouTube ณ เวลาที่เลือก</p>
              {bdmsChapters.map(chapter => <a className={styles.chapter} data-bdms-chapter href={chapter.url} key={chapter.seconds} target="_blank" rel="noopener noreferrer"><time>{chapter.time}</time><span>{chapter.label}</span><b aria-hidden="true">↗</b></a>)}
            </aside>
          </div>
          <details className={styles.description}><summary>คำอธิบายคลิปต้นทางฉบับเต็ม</summary><div className={styles.sourceText}>{description?.text}</div>
            {archivedTitle && <details className={styles.archive}><summary>ชื่อคลิปในหลักฐานอนุมัติเดิม (ชื่อปัจจุบันบน YouTube อาจต่างกัน)</summary><p>{archivedTitle.text}</p></details>}
          </details>
          <p className={styles.foot}>เนื้อหานี้จัดทำเพื่อการศึกษา ไม่ใช่คำแนะนำให้ซื้อหรือขายหลักทรัพย์ ผู้ลงทุนควรศึกษาข้อมูลเพิ่มเติมและตัดสินใจด้วยตนเอง</p>
        </article>
      </div>
    </div>
  );
}
