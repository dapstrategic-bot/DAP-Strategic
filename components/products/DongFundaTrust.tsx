
import { tx, type CatalogLocale } from '@/lib/catalog-language';
import Image from 'next/image';
import { ArrowUpRight, Youtube } from 'lucide-react';
import styles from './DongFundaTrust.module.css';
import {getDongFundaTrustValues} from '@/lib/dongfunda-trust';
import {formatTrustValues} from '@/lib/dongfunda-trust-values';

export default async function DongFundaTrust({ dark = false, locale = 'th' }: { dark?: boolean; locale?: CatalogLocale }) {
  const source = await getDongFundaTrustValues();
  const values = locale === 'en' ? {subscribers: source.subscribers.toLocaleString('en-US'), videos:source.videos.toLocaleString('en-US'), date:source.referenceDate} : formatTrustValues(source);
  return (
    <section id="youtube-trust" aria-labelledby="trust-title" className={`${styles.section} ${dark ? styles.dark : ''}`}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Image src="/images/logo.jpg" alt="DongFunda" width={52} height={52} />
          <div>
            <div className={styles.eyebrow}><Youtube size={24} aria-hidden="true" /> YouTube · @DongFunda</div>
            <h2 id="trust-title">{tx(locale, "รู้จัก DongFunda")}</h2>
            <p>{tx(locale, "แชร์วิธีการวิเคราะห์หุ้นพื้นฐานมานานกว่า 5 ปี การวิเคราะห์งบการเงิน และเจาะลึกงบกระแสเงินสดอย่างที่ไม่เคยเห็นมาก่อน กดชมเนื้อหาวิเคราะห์หุ้น ธุรกิจ และการเงิน ก่อนเลือกคอร์สหรือเครื่องมือที่เหมาะกับคุณ")}</p>
          </div>
        </div>
        <div className={styles.facts}>
          <div><strong>{values.subscribers} <small>{tx(locale, "คน")}</small></strong><span>{tx(locale, "ผู้ติดตาม YouTube")}</span></div>
          <div><strong>{values.videos} <small>{tx(locale, "รายการ")}</small></strong><span>{tx(locale, "วิดีโอบนช่อง")}</span></div>
          <a href="https://www.youtube.com/@DongFunda" target="_blank" rel="noopener noreferrer">{tx(locale, "ดูช่อง YouTube")}<ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
        <p className={styles.source}>{locale === 'en' ? `Figures from the Owner's reference dated ${values.date}; not live counts. Visit YouTube for current information.` : `ตัวเลขอ้างอิงภาพที่เจ้าของส่ง ณ ${values.date} กดคลิกดูช่อง YouTube เพื่อดูวีดิโอ`}</p>
      </div>
    </section>
  );
}
