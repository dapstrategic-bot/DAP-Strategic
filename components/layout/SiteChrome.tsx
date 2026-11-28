'use client';
import { usePathname } from 'next/navigation';
import { researchPaths } from '@/lib/dongfunda/research-catalog';
export default function SiteChrome({children, header, footer}: {children: React.ReactNode; header: React.ReactNode; footer: React.ReactNode}) {
  const path = usePathname().replace(/\/$/, '');
  const ownChrome = path === '/dongfunda' || researchPaths.includes(path);
  return ownChrome ? <>{children}</> : <div className="min-h-screen flex flex-col font-sans">{header}<main className="flex-1">{children}</main>{footer}</div>;
}
