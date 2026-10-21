import Image from 'next/image';
import { ArrowUpRight, Youtube } from 'lucide-react';
import styles from './DongFundaTrust.module.css';

export default function DongFundaTrust({ dark = false }: { dark?: boolean }) {
  return (
    <section id="youtube-trust" aria-labelledby="trust-title" className={`${styles.section} ${dark ? styles.dark : ''}`}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Image src="/images/logo.jpg" alt="DongFunda" width={52} height={52} />
          <div>
            <div className={styles.eyebrow}><Youtube size={24} aria-hidden="true" /> YouTube · @DongFunda</div>
            <h2 id="trust-title">รู้จัก DongFunda</h2>
            <p>แชร์วิธีการวิเคราะห์หุ้นพื้นฐานมานานกว่า 5 ปี การวิเคราะห์งบการเงิน และเจาะลึกงบกระแสเงินสดอย่างที่ไม่เคยเห็นมาก่อน กดชมเนื้อหาวิเคราะห์หุ้น ธุรกิจ และการเงิน ก่อนเลือกคอร์สหรือเครื่องมือที่เหมาะกับคุณ</p>
          </div>
        </div>
        <div className={styles.facts}>
          <div><strong>กว่า 13,000 <small>คน</small></strong><span>ผู้ติดตาม YouTube</span></div>
          <div><strong>250 <small>รายการ</small></strong><span>วิดีโอบนช่อง</span></div>
          <a href="https://www.youtube.com/@DongFunda" target="_blank" rel="noopener noreferrer">ดูช่อง YouTube <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
        <p className={styles.source}>ตัวเลขอ้างอิงภาพที่เจ้าของส่ง ณ 21 ต.ค. 2569 กดคลิกดูช่อง YouTube เพื่อดูวีดิโอ</p>
      </div>
    </section>
  );
}
