'use client';
import { usePathname } from 'next/navigation';
export default function SiteChrome({children, header, footer}: {children: React.ReactNode; header: React.ReactNode; footer: React.ReactNode}) {
  const path = usePathname().replace(/\/$/, '');
  const ownChrome = ['/dongfunda', '/dongfunda/one-report', '/dongfunda/one-report/bdms', '/dongfunda/financial-statements'].includes(path);
  return ownChrome ? <>{children}</> : <div className="min-h-screen flex flex-col font-sans">{header}<main className="flex-1">{children}</main>{footer}</div>;
}
