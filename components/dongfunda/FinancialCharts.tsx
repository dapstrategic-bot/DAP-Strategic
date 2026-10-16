'use client';

import { useEffect, useRef, useState } from 'react';
import { financialData, formatFinancial, periods, type Period, type Metric } from '@/lib/dongfunda/financials';
import { renderFinancialChart } from '@/lib/dongfunda/financial-chart';

function Plot({ metric, period, label }: { metric: Metric; period: Period; label: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    let active = true;
    const draw = () => { if (active) renderFinancialChart(svg, financialData, period); };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(svg);
    void document.fonts.ready.then(draw);
    return () => { active = false; observer.disconnect(); };
  }, [period]);
  return <svg ref={ref} className="df-plot" role="img" data-metric={metric} aria-label={label} />;
}

export default function FinancialCharts() {
  const [period, setPeriod] = useState<Period>('q1');
  const rows = financialData.modes[period];
  return <section aria-labelledby="financial-overview">
    <h2 id="financial-overview">ภาพรวมงบการเงิน</h2>
    <div className="df-f-period-bar"><label htmlFor="financial-period">ช่วงข้อมูล</label><select id="financial-period" value={period} onChange={e => setPeriod(e.target.value as Period)}>{periods.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
    <p className="df-f-context" aria-live="polite">{financialData.notes[period]}</p>
    <div className="df-f-chart-grid">
      {financialData.metrics.map(metric => {
        const id = metric.id as Metric, previous = rows.at(-2)![id].value, latest = rows.at(-1)![id].value;
        const isRatio = metric.unit === '%' || metric.unit === 'เท่า';
        const diff = previous !== null && latest !== null && previous !== 0 ? (isRatio ? latest - previous : (latest / previous - 1) * 100) : null;
        const delta = diff === null ? '' : `${rows.at(-1)!.label} เทียบ ${rows.at(-2)!.label}: ${diff >= 0 ? '+' : ''}${diff.toFixed(2)}${metric.unit === '%' ? ' จุดเปอร์เซ็นต์' : metric.unit === 'เท่า' ? ' เท่า' : '%'}`;
        const isEndingValue = ['retained', 'assets', 'liabilities', 'ibde'].includes(id);
        const note = !isEndingValue ? '' : period === 'annual' ? 'ยอด ณ สิ้นปี (Q4) ไม่ใช่ผลรวมรายไตรมาส' : period === 'half' ? 'ยอด ณ สิ้นเดือนมิถุนายน (Q2)' : period === 'nine' ? 'ยอด ณ สิ้นเดือนกันยายน (Q3) ไม่ใช่ผลรวมรายไตรมาส' : 'ยอด ณ สิ้นแต่ละไตรมาส';
        return <section className="df-f-chart-card" data-metric={id} key={id}><div className="df-f-chart-heading"><h3>{metric.label}</h3><span>{metric.unit}</span></div><p className="df-f-delta">{delta}</p><Plot metric={id} period={period} label={metric.label} /><p className="df-f-note">{note}</p></section>;
      })}
    </div>
    <details className="df-f-details"><summary>ดูตัวเลขและหมายเหตุประกอบกราฟ</summary><div className="df-f-data-grid">{rows.map(row => <section key={row.year}><h3>{row.label}</h3>{financialData.metrics.map(metric => <p key={metric.id}><span>{metric.label}</span><span>{formatFinancial(row[metric.id as Metric].value, metric.unit, metric.decimals)}{row[metric.id as Metric].value !== null ? ` ${metric.unit}` : ''}</span></p>)}</section>)}</div></details>
    <div className="df-f-source"><p>ที่มา: ข้อมูลงบการเงินของบริษัทฯ</p><p>หมายเหตุ: <strong>โปรดตรวจสอบงบด้วยตนเองทุกครั้ง</strong></p></div>
  </section>;
}
