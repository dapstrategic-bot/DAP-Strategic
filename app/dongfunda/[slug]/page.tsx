import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getContent,
  getContentBySlug,
  getRecommendations,
} from '@/lib/dongfunda/data';
import { contentTopics, safeLink, videoEmbed } from '@/lib/dongfunda/model';
import { articleMetadata, articleStructuredData } from '@/lib/dongfunda/seo';
import { ContentCard, Thumbnail } from '@/components/dongfunda/ContentCard';
import { ArticleBlocks } from '@/components/dongfunda/ArticleBlocks';
import { Recommendations } from '@/components/dongfunda/Recommendations';

// Read current published CMS state on every request, including previous 404s.
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;

  const item = await getContentBySlug(slug);
  return item
    ? articleMetadata(item)
    : {
        title: 'ไม่พบบทความ | DongFunda',
        robots: { index: false, follow: false },
      };
}

export default async function DongFundaDetail({ params }: Props) {
  const slug = (await params).slug;

  const item = await getContentBySlug(slug);
  if (!item) notFound();
  const items = await getContent();
  const related = items
    .filter((i) => i._id !== item._id)
    .sort(
      (a, b) =>
        Number(
          item.related_content?.includes(b._id) ||
            b.series?._id === item.series?._id,
        ) -
        Number(
          item.related_content?.includes(a._id) ||
            a.series?._id === item.series?._id,
        ),
    )
    .slice(0, 3);
  const recommendations = await getRecommendations();
  const embed = videoEmbed(item.video_embed || item.video_url);
  return (
    <div className="df">
      {item.demo && (
        <div className="df-demo">
          LOCAL PREVIEW · บทความตัวอย่าง ยังไม่อนุมัติเผยแพร่
        </div>
      )}
      {!item.demo && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleStructuredData(item)).replace(
              /</g,
              '\\u003c',
            ),
          }}
        />
      )}
      <div className="df-container">
        <nav className="df-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/dongfunda">DongFunda</Link>
          <span>/</span>
          <span>{item.title}</span>
        </nav>
        <article className="df-article">
          <header className="df-article-header">
            <div className="df-chips">
              {contentTopics(item)
                .slice(0, 5)
                .map((topic) => (
                  <Link
                    className="df-text-link"
                    key={topic}
                    href={`/dongfunda?topic=${encodeURIComponent(topic)}`}
                  >
                    {topic}
                  </Link>
                ))}
            </div>
            <h1>{item.title}</h1>
            {item.excerpt && <p className="df-excerpt">{item.excerpt}</p>}
            <div className="df-article-meta">
              <span>DongFunda by DAP</span>
              {item.series && (
                <Link
                  href={`/dongfunda?series=${encodeURIComponent(item.series.slug)}`}
                >
                  {item.series.title}
                </Link>
              )}
              {item.published_at && (
                <time dateTime={item.published_at}>
                  {new Date(item.published_at).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'Asia/Bangkok',
                  })}
                </time>
              )}
              {item.duration_minutes && (
                <span>{item.duration_minutes} นาที</span>
              )}
            </div>
          </header>
          <div className="df-article-cover" style={item.thumbnail?.aspectRatio && item.thumbnail.aspectRatio > 0 && item.thumbnail.aspectRatio < 1 ? {maxWidth: 324, marginInline: 'auto'} : undefined}>
            <Thumbnail item={item} priority preserveAspect />
          </div>
          <div className="df-article-body">
            {item.demo && (
              <div className="df-notice">
                {item.content_id === 'DF-CX-20260914-LH-LF01'
                  ? 'ฉบับร่างสำหรับตรวจรูปแบบเว็บไซต์ ยังไม่ยืนยันสถานะวิดีโอสาธารณะ'
                  : item.research_status === 'clip_based_not_independently_verified'
                  ? 'บทความร่างจากคลิป DongFunda: ตัวเลขโดยประมาณตามคลิป ยังไม่อนุมัติเผยแพร่'
                  : item.research_status === 'macro_context_sourced'
                  ? 'บทความร่าง: ส่วนภาพใหญ่ของธุรกิจมีแหล่งอ้างอิงแล้ว ส่วนอื่น รวมถึงภาพปกและกราฟ ยังเป็นตัวอย่างสำหรับตรวจหน้าเว็บ ไม่ใช่คำแนะนำลงทุน'
                  : 'เนื้อหาและตัวเลขสมมติสำหรับตรวจหน้าเว็บ ไม่ใช่บทวิเคราะห์บริษัทหรือคำแนะนำลงทุน'}
              </div>
            )}
            {item.summary && <p>{item.summary}</p>}
            {!!item.key_takeaways?.length && (
              <section className="df-takeaways">
                <h2>Key Takeaways</h2>
                <ul>
                  {item.key_takeaways.map((text, i) => (
                    <li key={i}>{text}</li>
                  ))}
                </ul>
              </section>
            )}
            {embed ? (
              <section id="video">
                <h2>ดูวิดีโอ</h2>
                <iframe
                  className="df-video"
                  src={embed}
                  title={item.title}
                  loading="lazy"
                  allow="fullscreen; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
                {safeLink(item.video_url) && (
                  <a className="df-text-link" href={safeLink(item.video_url)} target="_blank" rel="noopener noreferrer">
                    เปิดวิดีโอบนแพลตฟอร์มต้นทาง
                  </a>
                )}
              </section>
            ) : safeLink(item.video_url) ? (
              <section>
                <a
                  className="df-button df-button-outline"
                  href={safeLink(item.video_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ดูวิดีโอ
                </a>
              </section>
            ) : null}
            <ArticleBlocks blocks={item.content_blocks || []} />
          </div>
        </article>
        {!!related.length && (
          <section className="df-related">
            <div className="df-section-heading">
              <h2>อ่านต่อกับ DongFunda</h2>
            </div>
            <div className="df-grid">
              {related.map((i) => (
                <ContentCard item={i} key={i._id} />
              ))}
            </div>
          </section>
        )}
        <div className="df-content">
          <Recommendations
            {...recommendations}
            product={item.product || recommendations.product}
            service={item.service}
          />
        </div>
      </div>
    </div>
  );
}
