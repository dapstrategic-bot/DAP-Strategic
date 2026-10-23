'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Quote, RotateCcw, Star, X } from 'lucide-react';
import data from '@/data/portfolio-selected.json';
import { DONGFUNDA_LINE_URL } from '@/lib/site-identity';
import { trackContactIntent } from '@/lib/contact-analytics';
import './portfolio-selected.css';

const projects = data.projects;
const industries = [...new Set(projects.map(p => p.industry))];
const services = [...new Set(projects.flatMap(p => p.services))];
const counts = industries.map(name => ({ name, count: projects.filter(p => p.industry === name).length })).sort((a, b) => b.count - a.count);
type Project = typeof projects[number];

const relatedServices = [
  { name: 'Feasibility Study', href: '/services/feasibility-study' },
  { name: 'Business Plan', href: '/services/business-plan' },
  { name: 'Strategic Planning', href: '/services/strategic-planner-business-strategy' },
];

function RelatedServiceLinks({ project }: { project: Project }) {
  const links = relatedServices.filter(service => project.services.includes(service.name));
  if (links.length === 0) return null;

  return <div className="pp-related-links">
    <small>บริการที่เกี่ยวข้อง</small>
    {links.map(service => <a key={service.href} href={service.href}>
      ดูบริการ {service.name}<ArrowRight aria-hidden="true" />
    </a>)}
  </div>;
}

export default function SelectedPortfolio() {
  const [query, setQuery] = useState('');
  const [industry, setIndustry] = useState('');
  const [service, setService] = useState('');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Project | null>(null);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const search = useRef<HTMLInputElement>(null);
  const additionalSection = useRef<HTMLDivElement>(null);
  const matches = projects.filter(p => (!industry || p.industry === industry) && (!service || p.services.includes(service)) && (!query.trim() || [p.title, p.industry, ...p.services, ...p.scope].join(' ').toLowerCase().includes(query.trim().toLowerCase())));
  const featured = matches.filter(p => p.featured);
  const additional = matches.filter(p => !p.featured);
  const pages = Math.max(1, Math.ceil(additional.length / 10));

  useEffect(() => {
    if (!selected) return;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [selected]);

  function open(project: Project) {
    trigger.current = document.activeElement as HTMLElement;
    setSelected(project);
  }
  function close() {
    setSelected(null);
    trigger.current?.focus();
  }
  function reset() { setQuery(''); setIndustry(''); setService(''); setPage(0); search.current?.focus(); }
  function turn(next: number) { setPage(next); additionalSection.current?.scrollIntoView({ block: 'start' }); }

  return <>
    <div id="portfolio-projects">
      <section className="pp-intro"><div><span className="pp-badge">Our Portfolio</span><h1 className="font-display">ผลงานที่ผ่านมา</h1><p className="pp-experience">ประสบการณ์ส่งมอบงานกว่า 100 รายการ</p><p>ส่วนหนึ่งของงานแผนธุรกิจ การศึกษาความเป็นไปได้ และแผนการเงิน<br />สำหรับธุรกิจหลากหลายอุตสาหกรรม</p></div></section>
      <section className="pp-overview" aria-labelledby="pp-chart-title"><div className="pp-wrap"><div className="pp-chart-heading"><div><p className="pp-chart-kicker">PORTFOLIO OVERVIEW</p><h2 id="pp-chart-title">ประสบการณ์ในหลากหลายอุตสาหกรรม</h2><p>จากตัวอย่างผลงานที่คัดเลือกในหน้านี้ 34 โครงการ</p></div><span className="pp-chart-unit">หน่วย: โครงการที่คัดเลือก</span></div><ol className="pp-bars">{counts.map(({ name, count }, i) => <li key={name} aria-label={`${name} ${count} โครงการ`}><div className="pp-bar-label"><span>{name}</span><strong>{count}</strong></div><div className="pp-bar-track" aria-hidden="true"><div className={`pp-bar-fill tone-${i % 3}`} style={{ width: `${count / 11 * 100}%` }} /></div></li>)}</ol></div></section>
      <section className="pp-catalog"><div className="pp-wrap">
        <div className="pp-controls"><div className="pp-search-wrap"><label htmlFor="pp-search">ค้นหาโครงการ</label><input ref={search} id="pp-search" type="search" placeholder="ค้นหาประเภทธุรกิจหรือขอบเขตงาน" value={query} onChange={e => { setQuery(e.target.value); setPage(0); }} /></div><div><label htmlFor="pp-industry">อุตสาหกรรม</label><select id="pp-industry" value={industry} onChange={e => { setIndustry(e.target.value); setPage(0); }}><option value="">ทุกอุตสาหกรรม</option>{industries.map(s => <option key={s}>{s}</option>)}</select></div><div><label htmlFor="pp-service">บริการ</label><select id="pp-service" value={service} onChange={e => { setService(e.target.value); setPage(0); }}><option value="">ทุกบริการ</option>{services.map(s => <option key={s}>{s}</option>)}</select></div><button className="pp-reset" aria-label="ล้างตัวกรอง" title="ล้างตัวกรอง" onClick={reset}><RotateCcw /></button></div>
        <p className="pp-count" role="status" aria-live="polite">รายการที่แสดง {matches.length} รายการ · ตัวอย่างผลงานที่คัดเลือก</p>
        {featured.length > 0 && <div className="pp-featured-section"><h2>โครงการเด่น</h2><div className="pp-featured">{featured.map(p => <article className="pp-card" key={p.title}><div className="pp-card-head"><Image src={`/images/portfolio/project-${projects.filter(item => item.featured).indexOf(p)}.svg`} alt={`ภาพประกอบเชิงแนวคิด ${p.title}`} width={600} height={300} className="pp-illustration" /><span className="pp-art-label">{p.industry}</span></div><div className="pp-card-body"><h3>{p.title}</h3><p className="pp-description">{p.scope.map((s, i) => <span key={s}>{i > 0 && <br />}{s}</span>)}</p><div className="pp-scope"><small>ขอบเขตบริการ</small><div className="owner-service-tags">{p.services.map(s => <span key={s}>{s}</span>)}</div><RelatedServiceLinks project={p} /></div><button className="pp-more" onClick={() => open(p)} aria-label={`อ่านขอบเขตงาน ${p.title}`}>อ่านขอบเขตงาน<ArrowRight /></button></div></article>)}</div></div>}
        {additional.length > 0 && <div className="pp-additional" ref={additionalSection}><h2>ตัวอย่างโครงการเพิ่มเติม</h2><div className="pp-list">{additional.slice(page * 10, (page + 1) * 10).map(p => <article className="pp-row" key={p.title}><div className="pp-row-content"><h3>{p.title}</h3><p className="pp-industry pp-mobile-industry">{p.industry}</p><RelatedServiceLinks project={p} /></div><p className="pp-industry pp-desktop-industry">{p.industry}</p><button onClick={() => open(p)} aria-label={`อ่านขอบเขตงาน ${p.title}`} title="อ่านขอบเขตงาน"><ArrowUpRight /></button></article>)}</div><nav className="pp-pager" aria-label="หน้ารายการเพิ่มเติม"><button id="pp-prev" disabled={page === 0} onClick={() => turn(page - 1)} aria-label="หน้าก่อนหน้า" title="หน้าก่อนหน้า"><ChevronLeft /></button><span className="pp-page-label">หน้า {page + 1} / {pages}</span><button id="pp-next" disabled={page === pages - 1} onClick={() => turn(page + 1)} aria-label="หน้าถัดไป" title="หน้าถัดไป"><ChevronRight /></button></nav></div>}
        {matches.length === 0 && <p className="pp-empty">ไม่พบโครงการที่ตรงกับตัวกรอง</p>}
      </div></section>
      <dialog className="pp-dialog" ref={dialog} aria-labelledby="pp-dialog-title" onClose={close} onClick={e => { if (e.target === dialog.current) { const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.current?.close(); } }}><div className="pp-dialog-top"><div><p className="pp-detail-category">{selected?.industry}</p><h2 id="pp-dialog-title">{selected?.title}</h2></div><button className="pp-close" onClick={() => dialog.current?.close()} aria-label="ปิดรายละเอียด" title="ปิดรายละเอียด"><X /></button></div><h3>ขอบเขตงาน</h3><ul className="pp-detail-scope">{selected?.scope.map(s => <li key={s}>{s}</li>)}</ul><h3>ประเภทบริการ</h3><div className="pp-detail-services owner-service-tags">{selected?.services.map(s => <span key={s}>{s}</span>)}</div>{selected && <RelatedServiceLinks project={selected} />}<a className="pp-contact" href={DONGFUNDA_LINE_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackContactIntent('line', 'portfolio_project_dialog')}>ปรึกษาโครงการลักษณะนี้</a></dialog>
    </div>
    <section className="portfolio-voices" aria-labelledby="portfolio-voices-title"><div className="pv-wrap"><h2 id="portfolio-voices-title">เสียงจากผู้ใช้บริการ</h2><p className="pv-subtitle">คัดบางส่วนจากรีวิว</p><div className="pv-grid" id="portfolio-review-cards">{data.reviews.map((quote, i) => <article key={quote} className={i === 0 ? 'pv-featured' : undefined} hidden={!expanded && i >= 6}><div className="pv-top"><span className="pv-stars" role="img" aria-label="คะแนนรีวิว 5 ดาว">{Array.from({ length: 5 }, (_, n) => <Star key={n} fill="currentColor" aria-hidden="true" />)}</span><Quote className="pv-quote-icon" aria-hidden="true" /></div><blockquote>“{quote}”</blockquote></article>)}</div><div className="pv-more-wrap"><button className="pv-show-more" aria-expanded={expanded} aria-controls="portfolio-review-cards" onClick={() => setExpanded(!expanded)}>{expanded ? 'แสดงรีวิวน้อยลง' : 'ดูรีวิวเพิ่มเติม'}</button></div></div></section>
  </>;
}
