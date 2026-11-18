import SiteLayout, { defaultMetadata } from '@/components/layout/SiteLayout';
export const metadata = defaultMetadata;
export default function ThaiLayout({children}: {children: React.ReactNode}) { return <SiteLayout locale="th">{children}</SiteLayout>; }
