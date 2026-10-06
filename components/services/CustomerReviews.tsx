'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, X } from 'lucide-react';
import review17 from '@/public/images/service-reviews/17-blurred.jpg';
import review4 from '@/public/images/service-reviews/4-blurred.jpg';
import review36 from '@/public/images/service-reviews/36-blurred.jpg';

const reviews = [
  {
    id: '17',
    date: '29/06/2025',
    dateTime: '2025-06-29',
    quote: 'สิ่งที่ประทับใจมากคือความรวดเร็วในการทำงาน การใส่ใจรายละเอียด และความสามารถในการสื่อสารที่ดีเยี่ยม',
    image: review17,
  },
  {
    id: '4',
    date: '07/10/2025',
    dateTime: '2025-10-07',
    quote: 'ขอบคุณคุณโด่งมาก ๆ สำหรับการทำงานที่ละเอียด ใส่ใจ และเป็นมืออาชีพจริง ๆ',
    image: review4,
  },
  {
    id: '36',
    date: '03/03/2025',
    dateTime: '2025-03-03',
    quote: 'มีความอดทน รับฟังคำถามอย่างใจเย็น แก้ปัญหาของลูกค้าได้',
    image: review36,
  },
];

export default function CustomerReviews() {
  const [selected, setSelected] = useState<(typeof reviews)[number] | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!selected) return;
    const element = dialog.current;
    if (!element) return;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  return (
    <section id="customer-reviews" aria-labelledby="customer-reviews-title" className="bg-white py-12 md:py-[72px]">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
        <h2 id="customer-reviews-title" className="mb-3 text-center font-display text-[26px] md:text-[32px] font-bold leading-snug text-gray-900">
          เสียงจากลูกค้าที่ใช้บริการจริง
        </h2>
        <p className="mb-8 text-center text-base text-gray-500">ส่วนหนึ่งของประสบการณ์ที่ลูกค้าแบ่งปันหลังร่วมงานกับ DAP Strategic</p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.id} className="flex flex-col gap-4 rounded-lg border border-gray-200 p-6">
              <p className="text-[13px] text-yellow-800">คะแนนในรีวิว 5.0 / 5</p>
              <blockquote className="flex-1 text-[17px] leading-relaxed text-gray-900">“{review.quote}”</blockquote>
              <p className="text-xs text-gray-500">คัดบางส่วนจากรีวิว · <time dateTime={review.dateTime}>{review.date}</time></p>
              <button
                type="button"
                aria-haspopup="dialog"
                aria-label={`ดูภาพรีวิวต้นฉบับ วันที่ ${review.date}`}
                onClick={() => setSelected(review)}
                className="inline-flex min-h-11 items-center gap-2 self-start text-left text-sm font-semibold text-blue-900 hover:underline cursor-pointer"
              >
                ดูภาพรีวิวต้นฉบับ <ArrowRight size={16} aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
        <p className="mt-6 text-center text-[13px] text-gray-500">ปิดบังชื่อและรูปโปรไฟล์เพื่อรักษาความเป็นส่วนตัวของผู้รีวิว</p>
      </div>
      <dialog
        ref={dialog}
        aria-labelledby="review-dialog-title"
        onCancel={() => setSelected(null)}
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const bounds = event.currentTarget.getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setSelected(null);
          }
        }}
        className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-6xl overflow-auto rounded-lg border border-gray-200 bg-white p-4 text-gray-900 shadow-xl backdrop:bg-black/60 sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 id="review-dialog-title" className="text-base font-semibold">รีวิวต้นฉบับ · {selected?.date}</h3>
          <button type="button" aria-label="ปิดภาพรีวิว" title="ปิดภาพรีวิว" onClick={() => setSelected(null)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md hover:bg-gray-100 cursor-pointer">
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        {selected && <Image src={selected.image} alt={`รีวิวต้นฉบับวันที่ ${selected.date} ที่ปิดบังชื่อและรูปโปรไฟล์แล้ว`} sizes="(max-width: 1200px) 95vw, 1100px" className="h-auto w-full" />}
      </dialog>
    </section>
  );
}
