import React from 'react';
import TrackedLink from '@/components/shared/TrackedLink';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { DONGFUNDA_LINE_URL } from '@/lib/site-identity';

export default function PortfolioCTA() {
  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          พูดคุยเกี่ยวกับโครงการของคุณ
        </h2>
        <p className="text-lg text-gray-600 mb-10">
          ปรึกษาปัญหาธุรกิจและแนวทางการแก้ไขกับผู้เชี่ยวชาญของเราได้ฟรี ไม่มีค่าใช้จ่าย
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-blue-900 rounded-full hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20">
            นัดหมายปรึกษาฟรี
          </Link>
          <TrackedLink section="portfolio_cta" eventType="line" preserveMeta={false} href={DONGFUNDA_LINE_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-900 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all">
            <MessageCircle className="mr-2 w-5 h-5 text-[#00B900]" />
            สอบถามผ่าน LINE
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
