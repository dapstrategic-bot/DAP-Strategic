import { SITE_URL } from '@/lib/site-identity';
import type { Metadata } from 'next';
import { Kanit, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/shared/JsonLd';
import ScrollTracker from '@/components/shared/ScrollTracker';
import AnalyticsPageView from '@/components/shared/AnalyticsPageView';
import { GoogleTagManager } from '@next/third-parties/google';
import { generatePageMetadata } from '@/lib/seo';
import { sanityClient } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';
import { SiteSettings } from '@/types';

const kanit = Kanit({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

// Default metadata สำหรับทั้งเว็บ — แต่ละหน้าจะ override ผ่าน generateMetadata()
export const metadata: Metadata = {
  ...generatePageMetadata({
    title: 'DAP Strategic Consulting | ที่ปรึกษาธุรกิจเชิงกลยุทธ์',
    description:
      'ที่ปรึกษาธุรกิจเชิงกลยุทธ์ ช่วยวิเคราะห์ วางแผน และผลักดันธุรกิจให้เติบโตอย่างยั่งยืนด้วยกลยุทธ์ที่วัดผลได้จริง',
  }),
  // metadataBase ต้องกำหนดที่ root layout เพื่อให้ relative URL ทำงานถูกต้อง
  metadataBase: new URL(SITE_URL),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();

  let settings: SiteSettings | null = null;
  try {
    settings = await sanityClient.fetch<SiteSettings>(siteSettingsQuery);
  } catch (error) {
    console.error('Failed to fetch site settings in layout:', error);
  }

  return (
    <html lang="th" className={`${kanit.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900" suppressHydrationWarning>
        <JsonLd />
        {process.env.DAP_LOCAL_PREVIEW === 'true' && (
          <div role="status" className="bg-amber-100 px-4 py-2 text-center text-sm text-amber-950">LOCAL PREVIEW · ฉบับเสนอปรับ SEO และโครงสร้างแบรนด์ · ยังไม่นำขึ้นใช้งานจริง</div>
        )}
        <div className="min-h-screen flex flex-col font-sans">
          <Header settings={settings} />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <ScrollTracker />
        {gtmId && <AnalyticsPageView />}
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
      </body>
    </html>
  );
}
