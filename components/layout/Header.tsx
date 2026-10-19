'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Youtube } from 'lucide-react';
import type { SiteSettings } from '@/types';
import { GA } from '@/lib/analytics';
import { DONGFUNDA_LINE_URL } from '@/lib/site-identity';
import './header-brand.css';

const LineIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.564.39.084.922.258 1.057.592.12.303.079.778.039 1.082-.08.621-.386 2.428-.482 3.239-.059.502.114.547.451.324.336-.223 5.424-3.555 7.402-6.079.141-.188.29-.377.424-.577 3.226-2.072 5.073-4.992 5.073-8.249z" />
  </svg>
);

const navItems = [
  { href: '/dongfunda', label: 'DongFunda' },
  { href: '/products', label: 'Products' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'ผลงานที่ผ่านมา' },
  { href: '/contact', label: 'About / Contact' },
];

interface HeaderProps {
  settings: SiteSettings | null;
}

export default function Header({ settings }: HeaderProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const [openPath, setOpenPath] = useState<string | null>(null);
  if (openPath !== null && openPath !== pathname) setOpenPath(null);
  const mobileMenuOpen = openPath === pathname;
  const setMobileMenuOpen = (open: boolean) => setOpenPath(open ? pathname : null);

  const lineUrl = DONGFUNDA_LINE_URL;
  const youtubeUrl = settings?.socialLinks?.find((link) => link.platform === 'youtube')?.url || 'https://youtube.com';

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="dap-brand-combined select-none group" aria-label="กลับหน้าแรก DAP Strategic">
          <Image src="/images/dap-symbol-share-v2.jpg" alt="" width={72} height={68} className="dap-brand-symbol" unoptimized />
          <div className="dap-brand-words">
          <span className="font-display font-black text-2xl md:text-3xl text-gray-900 leading-none">
            DAP Strategic
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <Image src="/images/logo.jpg" alt="DAP Strategic Logo" width={32} height={32} className="rounded-full object-cover shrink-0" />
            <span className="font-display font-bold text-[10px] md:text-xs tracking-[0.25em] text-blue-900 leading-none -mr-[0.25em]">
              DongFunda
            </span>
          </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'text-blue-900'
                  : 'text-gray-600 hover:text-blue-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          {lineUrl && (
            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-blue-900 rounded-full hover:bg-blue-800 shadow-sm hover:shadow transition-all"
              onClick={() => GA.clickLine('header')}
            >
              <LineIcon className="w-4 h-4 shrink-0" />
              AddLine
            </a>
          )}
          {youtubeUrl && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-blue-900 rounded-full hover:bg-blue-800 shadow-sm hover:shadow transition-all"
            >
              <Youtube className="w-4 h-4 shrink-0" />
              YouTube
            </a>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label={mobileMenuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        inert={!mobileMenuOpen}
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[calc(100dvh-5rem)] overflow-y-auto opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="container mx-auto px-4 sm:px-6 pb-6 pt-2 bg-white/95 backdrop-blur-md border-t border-gray-100">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive(item.href)
                      ? 'text-blue-900'
                      : 'text-gray-700 hover:text-blue-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 px-4 flex flex-col sm:flex-row gap-3">
            {lineUrl && (
              <a
                href={lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { setMobileMenuOpen(false); GA.clickLine('header_mobile'); }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-900 rounded-full hover:bg-blue-800 transition-colors"
              >
                <LineIcon className="w-4.5 h-4.5 shrink-0" />
                AddLine
              </a>
            )}
            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-900 rounded-full hover:bg-blue-800 transition-colors"
              >
                <Youtube className="w-4.5 h-4.5 shrink-0" />
                YouTube
              </a>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
