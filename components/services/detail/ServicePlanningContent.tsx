'use client';

import { useRef, useState } from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import topics from '@/data/dap-service-planning.json';
import styles from './ServicePlanningContent.module.css';

function Topic({ topic, label }: { topic: typeof topics[number]; label: string }) {
  return <section className={styles.section} data-planning-topic={topic.id}>
    <span className={styles.eyebrow}>{label}</span>
    <h2>{topic.title}</h2>
    {topic.copy.map(text => <p key={text}>{text}</p>)}
    <div className={styles.table} role="table" aria-label={topic.title}>
      <div className={styles.head} role="row" style={{ gridTemplateColumns: `repeat(${topic.table.headers.length}, minmax(0, 1fr))` }}>
        {topic.table.headers.map(text => <strong role="columnheader" key={text}>{text}</strong>)}
      </div>
      {topic.table.rows.map(row => <div role="row" className={styles.row} key={row[0]} style={{ gridTemplateColumns: `repeat(${topic.table.headers.length}, minmax(0, 1fr))` }}>
        {row.map((text, i) => <div role="cell" key={i}><span className={styles.mobileLabel}>{topic.table.headers[i]}</span>{i === 0 ? <strong>{text}</strong> : text}</div>)}
      </div>)}
    </div>
    {topic.afterTable.map(section => <div key={section.heading}><h3>{section.heading}</h3><p>{section.text}</p></div>)}
    <div className={styles.faq}><h3>คำถามที่พบบ่อย</h3>{topic.faq.map(faq => <details key={faq.q}><summary>{faq.q}<Plus size={20} aria-hidden="true" /></summary><p>{faq.a}</p></details>)}</div>
    <div className={styles.ctas}>{topic.ctas.map((cta, i) => <a key={cta.href} className={i === 0 ? styles.primary : styles.secondary} href={cta.href}>{cta.text}<ArrowUpRight size={18} aria-hidden="true" /></a>)}</div>
  </section>;
}

export default function ServicePlanningContent({ slug }: { slug?: string }) {
  const [active, setActive] = useState(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  if (slug === 'business-plan') return <div id="new-content" className={styles.root}><Topic topic={topics[2]} label="เตรียมข้อมูลก่อนเริ่มงาน" /></div>;
  if (slug !== 'feasibility-study') return null;
  return <div id="new-content" className={styles.root}>
    <div role="tablist" aria-label="เลือกประเภทโครงการ" className={styles.tabs}>
      {['Pool Villa', 'โรงงานผลิต'].map((label, i) => <button key={label} type="button" role="tab" id={`industry-tab-${i}`} aria-controls={`industry-${i}`} aria-selected={active === i} tabIndex={active === i ? 0 : -1} ref={node => { buttons.current[i] = node; }} onClick={() => setActive(i)} onKeyDown={event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - i;
        setActive(next); buttons.current[next]?.focus();
      }}>{label}</button>)}
    </div>
    {topics.slice(0, 2).map((topic, i) => <div key={topic.id} role="tabpanel" id={`industry-${i}`} aria-labelledby={`industry-tab-${i}`} hidden={active !== i}><Topic topic={topic} label={i === 0 ? 'โครงการอสังหาริมทรัพย์' : 'อุตสาหกรรมและการผลิต'} /></div>)}
  </div>;
}
