import { homeText, homeHref, type HomeLocale } from '@/lib/home-language';
import React from 'react';
import type { HomePage } from '@/types';

const defaultStats = [
  { value: '150+', label: 'ธุรกิจที่ให้ความไว้วางใจ', subLabel: 'จากหลากหลายอุตสาหกรรมทั่วประเทศ' },
  { value: '300%', label: 'ยอดขายเติบโตเฉลี่ย', subLabel: 'ภายใน 1 ปีแรกที่ร่วมงานกับเรา' },
  { value: '2.5B+', label: 'มูลค่าธุรกิจที่เพิ่มขึ้น', subLabel: 'สร้างมูลค่าเพิ่มให้กับธุรกิจ SME ไทย (บาท)' },
];

interface PortfolioHighlightProps {
  locale?: HomeLocale;
  stats?: HomePage['stats'];
}

export default function PortfolioHighlight({ stats, locale = 'th' }: PortfolioHighlightProps) {
  const items = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-3">{homeText(locale, "ผลลัพธ์ที่เราสร้างให้กับลูกค้า")}</h2>
          <p className="text-gray-500">{homeText(locale, "ตัวเลขความสำเร็จที่พิสูจน์แล้วจากประสบการณ์จริง")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {items.map((stat, i) => (
            <div key={i} className="text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="font-display text-5xl md:text-6xl font-bold text-blue-900 mb-3">{stat.value}</div>
              <div className="text-base font-semibold text-gray-900 mb-1">{stat.label}</div>
              {stat.subLabel && <p className="text-gray-500 text-sm">{stat.subLabel}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
