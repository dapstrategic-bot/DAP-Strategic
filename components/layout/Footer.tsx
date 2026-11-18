import { DONGFUNDA_CHANNELS, DONGFUNDA_LINE_URL, DAP_WHATSAPP_URL, DAP_CONTACT_EMAIL } from '@/lib/site-identity';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { sanityClient } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';
import { SiteSettings } from '@/types';
import TrackedLink from '@/components/shared/TrackedLink';

export default async function Footer({ locale = 'th' }: { locale?: 'th' | 'en' }) {
  let settings: SiteSettings | null = null;

  try {
    settings = await sanityClient.fetch<SiteSettings>(siteSettingsQuery);
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
  }

  const english = locale === 'en';
  const companyName = settings?.companyName || 'DAP Strategic';
  const email = settings?.contact?.email || 'hello@dapstrategic.com';
  const lineUrl = DONGFUNDA_LINE_URL;
  const footerTagline = english ? 'Business, financial and strategic thinking for informed decisions.' : settings?.footerTagline || 'พาร์ทเนอร์ที่ผู้บริหารและเจ้าของธุรกิจ SME ไว้วางใจ เพื่อการเติบโตอย่างยั่งยืน';
  const logoUrl = settings?.logoUrl || '/images/logo.jpg';

  return (
    <footer className="bg-gray-950 py-12 text-gray-400 text-sm mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 flex flex-col items-start">
            <Link href={english ? '/en' : '/'} className="flex flex-col items-end justify-center select-none group mb-4">
              <span className="font-display font-black text-2xl md:text-3xl tracking-tight text-white leading-none">
                {companyName}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <Image src={logoUrl} alt={`${companyName} Logo`} width={32} height={32} className="rounded-full object-cover shrink-0" />
                <span className="font-display font-bold text-[10px] md:text-xs tracking-[0.25em] text-blue-300 leading-none -mr-[0.25em]">
                  DongFunda
                </span>
              </div>
            </Link>
            <p className="max-w-xs">{footerTagline}</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">{english ? 'Explore' : 'เมนู'}</h4>
            <ul className="space-y-2">
              <li><Link href={english ? '/en' : '/'} className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href={locale === "en" ? "/en/dongfunda" : "/dongfunda"} className="hover:text-white transition-colors">{english ? 'DongFunda by DAP' : 'DongFunda by DAP'}</Link></li>
              <li><Link href={english ? '/en/services' : '/services'} className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href={locale === "en" ? "/en/products" : "/products"} className="hover:text-white transition-colors">{english ? 'Products' : 'Products'}</Link></li>
              <li><Link href={english ? "/en/contact" : "/contact"} className="hover:text-white transition-colors">{english ? 'About / Contact' : 'About / Contact'}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">{english ? 'Contact' : 'ติดต่อ'}</h4>
            <ul className="space-y-2">
              <li>{english ? <a href={`mailto:${DAP_CONTACT_EMAIL}`} className="hover:text-white transition-colors">Email: {DAP_CONTACT_EMAIL}</a> : email}</li>
              {english && <li><a href={DAP_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp: +66 84 933 2331</a></li>}
              <li className="pt-3 font-medium text-white">{english ? 'Follow DongFunda' : 'ติดตาม DongFunda'}</li>
              {DONGFUNDA_CHANNELS.map(channel => <li key={channel.url}><a href={channel.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{channel.name}</a></li>)}
              {lineUrl && <li><TrackedLink href={lineUrl} section="footer" eventType="line" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LINE Official: @dongfunda</TrackedLink></li>}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} {companyName} Consulting. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

