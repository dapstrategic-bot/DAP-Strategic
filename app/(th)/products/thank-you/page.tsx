import { sanityClient } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';
import ThankYouClient from './ThankYouClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thank You | ชำระเงินสำเร็จ',
  description: 'ขอบคุณสำหรับการสั่งซื้อสินค้า',
};

export default async function ThankYouPage() {
  const siteSettings = await sanityClient.fetch(siteSettingsQuery);
  
  // ใช้ lineUrl จาก siteSettings ถ้าไม่มีให้ใช้ fallback URL
  const lineUrl = siteSettings?.contact?.lineUrl || 'https://lin.ee/xR00RwB';
  
  return <ThankYouClient lineUrl={lineUrl} />;
}
