'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { languagePair } from '@/lib/languages';

export default function LanguageSwitcher() {
  const path = usePathname();
  const pair = languagePair(path);
  if (!pair) return null;
  const english = path === '/en' || path.startsWith('/en/');
  return <nav aria-label="Language / ภาษา" className="flex shrink-0 items-center rounded-full border border-gray-200 p-1 text-xs font-semibold">
    <Link href={pair.th} hrefLang="th" lang="th" aria-current={!english ? 'page' : undefined} aria-label="ภาษาไทย" className={`rounded-full px-2 py-2 ${!english ? 'bg-blue-900 text-white' : 'text-gray-600'}`}>TH</Link>
    <Link href={pair.en} hrefLang="en" lang="en" aria-current={english ? 'page' : undefined} aria-label="English" className={`rounded-full px-2 py-2 ${english ? 'bg-blue-900 text-white' : 'text-gray-600'}`}>EN</Link>
  </nav>;
}
