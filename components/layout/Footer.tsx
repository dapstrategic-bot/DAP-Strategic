import { DONGFUNDA_CHANNELS, DONGFUNDA_LINE_URL } from '@/lib/site-identity';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { sanityClient } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';
import { SiteSettings } from '@/types';
import TrackedLink from '@/components/shared/TrackedLink';

export default async function Footer() {
  let settings: SiteSettings | null = null;

  try {
    settings = await sanityClient.fetch<SiteSettings>(siteSettingsQuery);
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
  }

  const companyName = settings?.companyName || 'DAP Strategic';
  const email = settings?.contact?.email || 'hello@dapstrategic.com';
  const lineUrl = DONGFUNDA_LINE_URL;
  const footerTagline = settings?.footerTagline || 'พาร์ทเนอร์ที่ผู้บริหารและเจ้าของธุรกิจ SME ไว้วางใจ เพื่อการเติบโตอย่างยั่งยืน';
  const logoUrl = settings?.logoUrl || '/images/logo.jpg';

  return (
    <footer className="bg-gray-950 py-12 text-gray-400 text-sm mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 flex flex-col items-start">
            <Link href="/" className="flex flex-col items-end justify-center select-none group mb-4">
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
            <h4 className="text-white font-medium mb-4">เมนู</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/dongfunda" className="hover:text-white transition-colors">DongFunda by DAP</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">About / Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">ติดต่อ</h4>
            <ul className="space-y-2">
              <li>{email}</li>
              <li className="pt-3 font-medium text-white">ติดตาม DongFunda</li>
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

