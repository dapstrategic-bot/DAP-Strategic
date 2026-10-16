'use client';

import BrandOverview from './BrandOverview';
import CompanyDirectory from './CompanyDirectory';
import { matchesBdms } from '@/lib/dongfunda/financials';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Search,
  X,
  FileText,
  PlayCircle,
  ChartNoAxesColumnIncreasing,
  Lightbulb,
  Users,
  Flame,
  Sprout,
  BookOpen,
} from 'lucide-react';
import {
  contentHref,
  contentTopics,
  filterContent,
  safeLink,
  type DongFundaContent,
  type Recommendation,
} from '@/lib/dongfunda/model';
import { ContentCard, Thumbnail } from './ContentCard';
import { Recommendations } from './Recommendations';

export default function Hub({
  items,
  product,
  services,
  demo,
}: {
  items: DongFundaContent[];
  product: Recommendation | null;
  services: Recommendation[];
  demo: boolean;
}) {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('');
  const [series, setSeries] = useState('');
  const [all, setAll] = useState(false);
  useEffect(() => {
    const read = () => {
      const params = new URLSearchParams(location.search);
      setQuery(params.get('q') || '');
      setTopic(params.get('topic') || '');
      setSeries(params.get('series') || '');
    };
    read();
    window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, []);
  function update(q: string, t: string, s: string) {
    setQuery(q);
    setTopic(t);
    setSeries(s);
    setAll(false);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (t) params.set('topic', t);
    if (s) params.set('series', s);
    window.history.replaceState(
      null,
      '',
      `${location.pathname}${params.size ? `?${params}` : ''}`,
    );
  }
  const filtered = useMemo(
    () => filterContent(items, query, topic, series),
    [items, query, topic, series],
  );
  const topics = [...new Set(items.flatMap(contentTopics))];
  const seriesList = [
    ...new Map(
      items.filter((i) => i.series).map((i) => [i.series!.slug, i.series!]),
    ).values(),
  ];
  const feature = items.find((item) => item.featured) || items[0];
  const trending = items
    .filter(
      (i) =>
        i.trending_rank &&
        (demo
          ? i.trending_source === 'demo'
          : i.trending_source === 'analytics' && !!i.trending_measured_at),
    )
    .sort((a, b) => a.trending_rank! - b.trending_rank!)
    .slice(0, 3);
  const searching = !!(query.trim() || topic || series);
  const visible = searching || all ? filtered : filtered.slice(0, 3);
  const seriesName = seriesList.find((s) => s.slug === series)?.title;
  const icons = [Sprout, ChartNoAxesColumnIncreasing, Lightbulb];
  return (
    <div className="df">
      {demo && (
        <div className="df-demo">
          LOCAL PREVIEW · ข้อมูลและอันดับตัวอย่าง ยังไม่เผยแพร่
        </div>
      )}
      <div className="df-toolbar df-container">
        <Link href="/dongfunda" className="df-wordmark">
          DongFunda <span>by DAP</span>
        </Link>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (!query.trim()) return;
            document.getElementById(matchesBdms(query) ? 'company-information' : 'df-latest')?.scrollIntoView({ block: 'start' });
          }}
          className="df-search"
        >
          <Search size={19} />
          <input
            type="search"
            aria-label="ค้นหาบทความ บริษัท และงบการเงิน"
            placeholder="ค้นหาบทความ บริษัท และงบการเงิน..."
            value={query}
            onChange={(e) => update(e.target.value, topic, series)}
          />
          {query && (
            <button
              type="button"
              title="ล้างคำค้น"
              aria-label="ล้างคำค้น"
              onClick={() => update('', topic, series)}
            >
              <X size={17} />
            </button>
          )}
        </form>
      </div>
      {query.trim() && <div className="df-container df-f-search-summary" aria-live="polite">
        <p role="status">ผลการค้นหา “{query.trim()}”</p>
        <div><a href="#company-information">ข้อมูลบริษัท ({matchesBdms(query) ? 1 : 0})</a><a href="#df-latest">บทความ ({filtered.length})</a></div>
      </div>}
      {feature && !searching && (
        <section className="df-hero">
          <div className="df-container df-hero-grid">
            <Link
              href={contentHref(feature)}
              className="df-hero-image"
              aria-label={`อ่าน ${feature.title}`}
            >
              <Thumbnail item={feature} priority />
            </Link>
            <div className="df-hero-copy">
              <span className="df-eyebrow">Featured Content</span>
              <h1>{feature.title}</h1>
              <h2>{feature.excerpt}</h2>
              <p>
                {feature.demo
                  ? 'วิเคราะห์ธุรกิจผ่านงบ เพื่อเข้าใจหุ้นให้ลึกกว่าราคา'
                  : feature.summary?.slice(0, 140)}
              </p>
              <div className="df-hero-actions">
                <Link
                  className="df-button df-button-primary"
                  href={contentHref(feature)}
                >
                  <FileText size={20} />
                  อ่านบทความ
                </Link>
                {safeLink(feature.video_url) && (
                  <a
                    className="df-button df-button-outline"
                    href={safeLink(feature.video_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PlayCircle size={23} />
                    ดูวิดีโอ
                  </a>
                )}
              </div>
              <div className="df-attributes">
                <span>
                  <ChartNoAxesColumnIncreasing />
                  วิเคราะห์จากงบจริง
                </span>
                <span>
                  <Lightbulb />
                  มุมมองเชิงลึก
                </span>
                <span>
                  <Users />
                  เรียนรู้การลงทุน
                </span>
              </div>
            </div>
            <blockquote className="df-hero-quote">
              “ ตัวเลข
              <br />
              ไม่ได้โกหก
              <br />
              แค่เราต้องอ่าน
              <br />
              ให้เป็น ”
              <cite>
                DONGFUNDA
                <br />
                by DAP
              </cite>
            </blockquote>
          </div>
        </section>
      )}
      {!!query.trim() && <CompanyDirectory query={query} />}
      {!searching && <BrandOverview />}
      <div className="df-container df-content">
        {(!feature || searching) && (
          <h1 className="df-empty-heading">DongFunda</h1>
        )}
        <div
          className={`df-discovery ${trending.length && !searching ? '' : 'df-discovery-wide'}`}
        >
          <section aria-labelledby="df-latest">
            <div className="df-section-heading">
              <div>
                <h2 id="df-latest">
                  {searching
                    ? seriesName || topic || 'ผลการค้นหา'
                    : 'บทความล่าสุด'}
                </h2>
                <p>
                  {searching
                    ? `${filtered.length} บทความ`
                    : 'เข้าใจธุรกิจและการลงทุน ผ่านมุมมองของ DongFunda'}
                </p>
              </div>
              {!searching && items.length > 3 && (
                <button className="df-text-link" onClick={() => setAll(!all)}>
                  {all ? 'แสดงล่าสุด' : 'ดูทั้งหมด'}
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
            {searching && (
              <div className="df-active-filters">
                <button
                  className="df-text-link"
                  onClick={() => update('', '', '')}
                >
                  <X size={16} />
                  ล้างตัวกรอง
                </button>
              </div>
            )}
            <div className="df-grid" aria-live="polite">
              {visible.map((item) => (
                <ContentCard key={item._id} item={item} />
              ))}
            </div>
            {!filtered.length && (
              <div className="df-empty">
                <BookOpen size={36} />
                <h3>
                  {searching
                    ? 'ไม่พบบทความที่ตรงกับการค้นหา'
                    : 'ยังไม่มีบทความเผยแพร่'}
                </h3>
                {searching && (
                  <button
                    className="df-text-link"
                    onClick={() => update('', '', '')}
                  >
                    ดูบทความทั้งหมด
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            )}
          </section>
          {!!trending.length && !searching && (
            <aside className="df-trending">
              <h2>
                <Flame size={23} />
                Trending
              </h2>
              <ol>
                {trending.map((item, i) => (
                  <li key={item._id}>
                    <Link href={contentHref(item)}>
                      <span className="df-rank">{i + 1}</span>
                      <Thumbnail item={item} compact />
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.excerpt}</p>
                        <small>
                          {item.duration_minutes
                            ? `${item.duration_minutes} นาที`
                            : item.primary_topic}
                        </small>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </aside>
          )}
        </div>
        {!!topics.length && (
          <section className="df-topics" aria-labelledby="df-topics-heading">
            <div className="df-section-heading">
              <h2 id="df-topics-heading">Explore Topics</h2>
            </div>
            <div className="df-chips">
              {topics.map((t) => (
                <button
                  key={t}
                  className={topic === t ? 'is-active' : ''}
                  aria-pressed={topic === t}
                  onClick={() => update(query, topic === t ? '' : t, series)}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>
        )}
        {!!seriesList.length && !searching && (
          <section className="df-series">
            <div className="df-section-heading">
              <div>
                <h2>DongFunda Series</h2>
                <p>
                  ซีรีส์ความรู้ ที่ช่วยให้คุณเข้าใจธุรกิจและการลงทุนได้ลึกขึ้น
                </p>
              </div>
            </div>
            <div className="df-series-grid">
              {seriesList.map((s, i) => {
                const Icon = icons[i % icons.length];
                return (
                  <article className="df-series-card" key={s._id}>
                    <div className="df-series-heading">
                      <Icon size={30} />
                      <div>
                        <h3>{s.title}</h3>
                        <p>{s.description}</p>
                      </div>
                      <button
                        className="df-text-link"
                        onClick={() => {
                          update('', '', s.slug);
                          document
                            .getElementById('df-latest')
                            ?.scrollIntoView({
                              block: 'start',
                              behavior: 'smooth',
                            });
                        }}
                        aria-label={`ดูทั้งหมด ${s.title}`}
                      >
                        <ArrowRight size={19} />
                      </button>
                    </div>
                    <div className="df-series-items">
                      {items
                        .filter((item) => item.series?.slug === s.slug)
                        .slice(0, 3)
                        .map((item) => (
                          <Link key={item._id} href={contentHref(item)}>
                            <Thumbnail item={item} compact />
                            <div>
                              <h4>{item.title}</h4>
                              <span>{item.duration_minutes} นาที</span>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
        <Recommendations product={product} services={services} />
      </div>
    </div>
  );
}
