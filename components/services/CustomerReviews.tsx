'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Quote, Star, X } from 'lucide-react';
import './customer-reviews.css';
import review17 from '@/public/images/service-reviews/17-blurred.jpg';
import review4 from '@/public/images/service-reviews/4-blurred.jpg';
import review36 from '@/public/images/service-reviews/36-blurred.jpg';

const reviews = [
  {
    id: '17',
    services: ['business-plan'],
    date: '29/06/2025',
    dateTime: '2025-06-29',
    quote: 'ขอขอบคุณสำหรับบริการเขียนแผนธุรกิจที่มีคุณภาพสูงและเป็นมืออาชีพมากค่ะ ผู้เขียนสามารถเข้าใจธุรกิจของเราได้อย่างลึกซึ้ง วิเคราะห์ข้อมูลอย่างครบถ้วน และถ่ายทอดออกมาในรูปแบบที่ชัดเจน เข้าใจง่าย และมีความน่าเชื่อถือ เหมาะสำหรับใช้ยื่นขอสินเชื่อกับสถาบันการเงิน หรือเสนอกับนักลงทุนได้อย่างมั่นใจ',
    image: review17,
  },
  {
    id: '4',
    services: ['feasibility-study'],
    date: '07/10/2025',
    dateTime: '2025-10-07',
    quote: 'ขอบคุณคุณโด่งมาก ๆ สำหรับการทำงานที่ละเอียด ใส่ใจ และเป็นมืออาชีพจริง ๆ',
    image: review4,
  },
  {
    id: '36',
    services: ['strategic-planner-business-strategy', 'strategic-planner'],
    date: '03/03/2025',
    dateTime: '2025-03-03',
    quote: 'มีความอดทน รับฟังคำถามอย่างใจเย็น แก้ปัญหาของลูกค้าได้',
    image: review36,
  },
];

export default function CustomerReviews({ serviceId }: { serviceId: string }) {
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

  const review = reviews.find((item) => item.services.includes(serviceId));
  if (!review) return null;
  const dialogTitle = `review-dialog-title-${serviceId}`;

  return (
    <>
            <article className="service-review" aria-label="รีวิวจากลูกค้าจริง" data-review-id={review.id}>
              <div className="service-review-heading">
                <div className="service-review-rating">
                  <span className="service-review-stars" role="img" aria-label="คะแนนในรีวิว 5 จาก 5">
                    {Array.from({ length: 5 }, (_, i) => <Star key={i} aria-hidden="true" />)}
                  </span>
                  <span>คะแนนในรีวิว 5.0 / 5</span>
                </div>
                <Quote className="service-review-quote" aria-hidden="true" />
              </div>
              <blockquote>“{review.quote}”</blockquote>
              <div className="service-review-bottom">
              <p className="service-review-caption">รีวิวจากลูกค้าจริง</p>
              <button
                type="button"
                aria-haspopup="dialog"
                aria-label={`ดูภาพรีวิวต้นฉบับ วันที่ ${review.date}`}
                onClick={() => setSelected(review)}
                className="service-review-open inline-flex min-h-11 items-center gap-2 text-left text-sm font-semibold text-blue-900 hover:underline cursor-pointer"
              >
                ดูภาพรีวิวต้นฉบับ <ArrowRight size={16} aria-hidden="true" />
              </button>
              </div>
            </article>
      <dialog
        ref={dialog}
        aria-labelledby={dialogTitle}
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
          <h3 id={dialogTitle} className="text-base font-semibold">ภาพรีวิวต้นฉบับ</h3>
          <button type="button" aria-label="ปิดภาพรีวิว" title="ปิดภาพรีวิว" onClick={() => setSelected(null)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md hover:bg-gray-100 cursor-pointer">
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        {selected && <Image src={selected.image} alt={`รีวิวต้นฉบับวันที่ ${selected.date} ที่ปิดบังชื่อและรูปโปรไฟล์แล้ว`} sizes="(max-width: 1200px) 95vw, 1100px" className="h-auto w-full" />}
      </dialog>
    </>
  );
}
