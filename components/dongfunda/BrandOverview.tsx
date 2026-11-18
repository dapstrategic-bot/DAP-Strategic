
import { tx, type CatalogLocale } from '@/lib/catalog-language';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { DONGFUNDA_CHANNELS, INSTRUCTOR_PROFILE } from '@/lib/site-identity';

export default function BrandOverview({locale = 'th'}: {locale?: CatalogLocale}) {
  return (
    <section aria-labelledby="dongfunda-brand-title" className="border-y border-slate-200 bg-white">
      <div className="df-container py-9 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-800">DongFunda by DAP Strategic</p>
            <h2 id="dongfunda-brand-title" className="text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">{tx(locale, "อ่านธุรกิจให้เข้าใจ")}<br />{tx(locale, "ผ่านงบการเงินและมูลค่า")}</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
              {locale === 'en' ? <>DongFunda is the business and financial education brand of <Link href="/en" className="font-medium text-blue-800 underline underline-offset-4">DAP Strategic</Link>. Learn business analysis, financial statement reading and valuation through Thai-language articles, videos and courses.</> : <>              DongFunda เป็นแบรนด์สื่อและการเรียนรู้ภายใต้{' '}
              <Link href="/" className="font-medium text-blue-800 underline underline-offset-4">DAP Strategic</Link>
              {' '}ถ่ายทอดการวิเคราะห์ธุรกิจ อ่านงบการเงิน และประเมินมูลค่า
              ผ่านบทความ วิดีโอ และคอร์สออนไลน์ เพื่อให้เข้าใจเหตุผลเบื้องหลังตัวเลขอย่างเป็นระบบ
</>}
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">{tx(locale, "ช่องทางทางการของ DongFunda")}</h3>
            <div className="mt-3 divide-y divide-slate-200">
              {DONGFUNDA_CHANNELS.map(channel => (
                <a key={channel.url} href={channel.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 py-3 font-medium text-blue-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4">
                  {channel.name}<ArrowUpRight size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm">
              <a href={INSTRUCTOR_PROFILE} target="_blank" rel="noopener noreferrer" className="text-blue-800 underline underline-offset-4">{tx(locale, "รู้จักผู้สอนบน Facebook")}</a>
              <Link href={locale === "en" ? "/en/products" : "/products"} className="text-blue-800 underline underline-offset-4">{tx(locale, "ดูคอร์สและสื่อการเรียนรู้")}</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
