'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  MessageCircle,
  Home,
  ShoppingBag,
  Sparkles,
  PartyPopper,
} from 'lucide-react';
import { GA } from '@/lib/analytics';

interface ThankYouClientProps {
  lineUrl: string;
}

function ThankYouContent({ lineUrl }: ThankYouClientProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  // ปิด confetti animation หลัง 4 วินาที
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden">

      {/* ── Decorative background elements ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-green-100/30 via-blue-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />

      {/* ── Confetti particles ── */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="confetti-particle"
              style={{
                left: `${(i * 37) % 100}%`,
                animationDelay: `${(i % 10) * 0.2}s`,
                animationDuration: `${2 + (i % 5) * 0.35}s`,
                backgroundColor: [
                  '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
                  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
                ][i % 8],
              }}
            />
          ))}
        </div>
      )}

      {/* ── Main card ── */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">

          {/* Success icon with pulse */}
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="absolute inset-0 w-24 h-24 rounded-full bg-green-100 animate-ping opacity-20" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-xl shadow-green-500/25">
              <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Celebration icon */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <PartyPopper className="w-6 h-6 text-amber-500" />
            <Sparkles className="w-5 h-5 text-blue-500" />
          </div>

          {/* Heading (Generic) */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            ทำรายการสำเร็จ!
          </h1>

          <p className="text-xl text-gray-500 mb-3 leading-relaxed max-w-lg mx-auto">
            ขอบคุณที่ไว้วางใจซื้อสินค้ากับเรา
          </p>

          <p className="text-md text-gray-400 mb-10">
            สามารถ Add Line เพื่อส่งหลักฐานการชำระเงิน และพูดคุยกับเราได้เลย <br />
            👇
          </p>

          {/* ── LINE CTA — ปุ่มหลักเด่น ── */}
          <a
            href={lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => GA.clickLine('thank_you')}
            className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4.5 rounded-full bg-[#00B900] hover:bg-[#00a000] text-white font-bold text-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-xl shadow-[#00B900]/25 hover:shadow-[#00B900]/40 mb-5"
          >
            <MessageCircle className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span>Add LINE เพื่อส่งหลักฐานการชำระเงิน</span>
          </a>

          {/* Sub-text for LINE */}
          <p className="text-xs text-gray-400 mb-10">
            เพิ่มเพื่อนเพื่อติดตามสถานะ และรับโปรโมชันพิเศษก่อนใคร
          </p>

          {/* ── Secondary actions ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors w-full sm:w-auto"
            >
              <Home className="w-4 h-4" />
              กลับหน้าแรก
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-blue-900 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors w-full sm:w-auto"
            >
              <ShoppingBag className="w-4 h-4" />
              ดูสินค้าเพิ่มเติม
            </Link>
          </div>
        </div>
      </div>

      {/* ── Confetti CSS ── */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti-particle {
          position: absolute;
          top: -10px;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          animation: confetti-fall linear forwards;
        }
      `}</style>
    </div>
  );
}

export default function ThankYouClient({ lineUrl }: ThankYouClientProps) {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div></div>}>
      <ThankYouContent lineUrl={lineUrl} />
    </Suspense>
  );
}
