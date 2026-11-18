'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';

export default function NotFound() {
  return (
    <div className="bg-gray-50 min-h-[70vh] flex flex-col justify-center items-center py-20">
      <div className="container mx-auto px-4 text-center max-w-2xl">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-50 text-red-500 rounded-full mb-8 shadow-sm">
          <Search className="w-10 h-10" />
        </div>
        
        <h1 className="font-display text-7xl md:text-8xl font-bold text-gray-900 mb-4 tracking-tighter">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
          ขออภัย ไม่พบหน้าที่คุณค้นหา
        </h2>
        
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
          หน้าที่คุณพยายามเข้าถึงอาจถูกลบไปแล้ว หรือคุณอาจพิมพ์ URL ผิด
          กรุณาตรวจสอบ URL อีกครั้ง หรือกลับไปเริ่มต้นที่หน้าแรก
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-blue-900 rounded-xl hover:bg-blue-800 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
          >
            <Home className="w-5 h-5 mr-2" />
            กลับหน้าแรก
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            ย้อนกลับ
          </button>
        </div>
      </div>
    </div>
  );
}
