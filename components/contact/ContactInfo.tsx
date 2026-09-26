import React from 'react';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import type { SiteSettings } from '@/types';
import TrackedLink from '@/components/shared/TrackedLink';

interface ContactInfoProps {
  contact?: SiteSettings['contact'];
}

export default function ContactInfo({ contact }: ContactInfoProps) {
  const lineUrl = contact?.lineUrl || "https://line.me";
  const email = contact?.email || "hello@dapstrategic.com";
  const address = contact?.address || "123 Business Center, ชั้น 15\nถนนสุขุมวิท, กรุงเทพฯ 10110";

  return (
    <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">ช่องทางการติดต่อ</h3>
      
      <div className="space-y-6">
        <TrackedLink href={lineUrl} section="contact" eventType="line" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-[#00B900]/10 rounded-full flex items-center justify-center group-hover:bg-[#00B900] transition-colors">
            <MessageCircle className="w-6 h-6 text-[#00B900] group-hover:text-white transition-colors" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">LINE Official</div>
            <div className="text-gray-900 font-bold">@DAPStrategic</div>
          </div>
        </TrackedLink>
        
        <a href={`mailto:${email}`} className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
            <Mail className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Email</div>
            <div className="text-gray-900 font-bold">{email}</div>
          </div>
        </a>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-gray-600" />
          </div>
          <div className="pt-1">
            <div className="text-sm text-gray-500 font-medium">Office</div>
            <div className="text-gray-900 font-medium leading-relaxed whitespace-pre-line">
              {address}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
