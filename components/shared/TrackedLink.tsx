'use client';

import React from 'react';
import { GA } from '@/lib/analytics';
import { trackContactIntent, type ContactChannel } from '@/lib/contact-analytics';

/**
 * Client component สำหรับ wrap link ที่ต้อง track GA4 event
 * ใช้ใน server components ที่ไม่สามารถใส่ onClick ได้โดยตรง
 *
 * ใช้งาน:
 *   <TrackedLink section="footer" eventType="line" href={url} className="...">
 *     ...children...
 *   </TrackedLink>
 */

interface TrackedLinkProps {
  href: string;
  section: string;
  eventType: ContactChannel | 'register';
  preserveMeta?: boolean;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export default function TrackedLink({
  href,
  section,
  eventType,
  children,
  className,
  target,
  rel,
  preserveMeta = true,
}: TrackedLinkProps) {
  const handleClick = () => {
    if (eventType === 'line' && preserveMeta) {
      GA.clickLine(section);
    } else if (eventType === 'register') {
      GA.clickRegister(section);
    } else {
      trackContactIntent(eventType, section);
    }
  };

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
