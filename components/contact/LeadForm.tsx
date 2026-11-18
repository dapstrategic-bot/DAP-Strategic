'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { GA } from '@/lib/analytics';

export default function LeadForm({ locale = 'th' }: { locale?: 'th' | 'en' }) {
  const english = locale === 'en';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedService, setSelectedService] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      service: formData.get('service'),
      message: formData.get('message'),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error((english ? "Unable to send your details. Please try again." : 'เกิดข้อผิดพลาดในการส่งข้อมูล'));

      GA.submitLead(String(data.service || 'general'));
      setIsSuccess(true);
    } catch (error: any) {
      setErrorMsg(error.message || (english ? "Something went wrong. Please try again." : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div id="lead-form" className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 text-center h-full flex flex-col justify-center items-center scroll-mt-24">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{english ? "Message sent!" : "ส่งข้อมูลสำเร็จ!"}</h3>
        <p className="text-gray-600 mb-6">{english ? "Thank you for your interest. Our team will get back to you as soon as possible." : "ขอบคุณที่ให้ความสนใจ ทีมงานจะติดต่อกลับโดยเร็วที่สุดครับ"}</p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="px-6 py-3 bg-blue-50 text-blue-900 font-medium rounded-xl hover:bg-blue-100 transition-all"
        >
          {english ? "Send another message" : "ส่งข้อความอีกครั้ง"}
        </button>
      </div>
    );
  }

  return (
    <div id="lead-form" className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 scroll-mt-24">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">{english ? "Leave your details for a callback" : "ฝากข้อมูลเพื่อให้เราติดต่อกลับ"}</h3>
      
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {errorMsg}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">{english ? "Your name" : "ชื่อของคุณ"}</label>
            <input type="text" id="name" name="name" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="DongFunda" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">{english ? "Email" : "อีเมล"}</label>
            <input type="email" id="email" name="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="DongFunda@company.com" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="service" className="text-sm font-medium text-gray-700">{english ? "Service of interest *" : "บริการที่สนใจ *"}</label>
          <select 
            id="service" 
            name="service" 
            required 
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-white"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            <option value="">{english ? "-- Select a service --" : "-- กรุณาเลือกบริการที่คุณสนใจ --"}</option>
            <option value="course">{english ? "Courses" : "คอร์สเรียน"}</option>
            <option value="feasibility">Feasibility Study</option>
            <option value="business-plan">Business Plan</option>
            <option value="strategy">Strategic Planner</option>
            <option value="other">{english ? "Other / General enquiry" : "อื่นๆ ปรึกษาทั่วไป"}</option>
          </select>
        </div>

        {selectedService === 'other' && (
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-gray-700">{english ? "Tell us about your enquiry *" : "รายละเอียดที่ต้องการปรึกษา *"}</label>
            <textarea id="message" name="message" required rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none" placeholder={english ? "Describe your project or question..." : "โปรดระบุเรื่องที่ต้องการปรึกษา..."}></textarea>
          </div>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-blue-900 rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              {english ? "Sending..." : "กำลังส่งข้อมูล..."}
              <Loader2 className="ml-2 w-5 h-5 animate-spin" />
            </>
          ) : (
            <>
              {english ? "Send enquiry" : "ส่งข้อมูลติดต่อ"}
              <Send className="ml-2 w-5 h-5" />
            </>
          )}
        </button>
        <p className="text-xs text-center text-gray-500 mt-4">
          {english ? "Your details will be kept confidential and used only to respond to your enquiry." : "ข้อมูลของคุณจะถูกเก็บเป็นความลับและใช้เพื่อการติดต่อกลับเท่านั้น"}
        </p>
      </form>
    </div>
  );
}
