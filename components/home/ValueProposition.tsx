import { homeText, homeHref, type HomeLocale } from '@/lib/home-language';
import React from 'react';
import { BarChart3, ShieldCheck, Target, Zap } from 'lucide-react';
import type { HomePage } from '@/types';

const defaultPropositions = [
  {
    icon: BarChart3,
    title: "Data-Driven Decisions",
    desc: "ตัดสินใจแม่นยำด้วยข้อมูล ไม่ใช่แค่ความรู้สึก ลดความเสี่ยงในการดำเนินธุรกิจ"
  },
  {
    icon: ShieldCheck,
    title: "Proven Frameworks",
    desc: "ใช้โมเดลธุรกิจที่ผ่านการพิสูจน์แล้วว่าได้ผลจริงกับธุรกิจระดับประเทศ"
  },
  {
    icon: Target,
    title: "Tailored Solutions",
    desc: "กลยุทธ์ออกแบบเฉพาะสำหรับธุรกิจของคุณ เพราะแต่ละธุรกิจมีความท้าทายต่างกัน"
  },
  {
    icon: Zap,
    title: "Execution Focused",
    desc: "ไม่ใช่แค่แผนงานบนกระดาษ แต่เราช่วยคุณลงมือทำจนเกิดผลลัพธ์ที่จับต้องได้"
  }
];

const iconMap = [BarChart3, ShieldCheck, Target, Zap];

interface ValuePropositionProps {
  locale?: HomeLocale;
  valueProps?: HomePage['valueProps'];
}

export default function ValueProposition({ valueProps, locale = 'th' }: ValuePropositionProps) {
  // ถ้ามีข้อมูลจาก Sanity ใช้ข้อมูลนั้น ถ้าไม่มีใช้ default
  const items = valueProps && valueProps.length > 0
    ? valueProps.map((vp, i) => ({
        icon: iconMap[i % iconMap.length],
        title: vp.title,
        desc: vp.description,
      }))
    : defaultPropositions;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">{homeText(locale, "ทำไมต้อง DAP Strategic?")}</h2>
          <p className="text-gray-600 text-lg">{homeText(locale, "เราไม่ใช่แค่ที่ปรึกษา แต่เราคือพาร์ทเนอร์ที่พร้อมลงมือทำไปกับคุณ")}</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div key={i} className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

