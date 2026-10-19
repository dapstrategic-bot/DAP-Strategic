import styles from './ContactBar.module.css';
import TrackedLink from '@/components/shared/TrackedLink';

export default function ContactBar({ mobilePurchaseBar = false }: { mobilePurchaseBar?: boolean }) {
  if (process.env.DAP_LOCAL_PREVIEW === 'true' || process.env.DONGFUNDA_DEMO === 'true' || process.env.DONGFUNDA_LH_PREVIEW === 'true') return null;

  return (
    <nav aria-label="ติดต่อ DAP และ DongFunda" data-contact-bar className={`${styles.bar} ${mobilePurchaseBar ? styles.desktopOnly : ''}`}>
      <TrackedLink section="contact_bar" eventType="line" preserveMeta={false} className={styles.line} href="https://lin.ee/ntNa1Tb" target="_blank" rel="noopener noreferrer">
        <strong>ปรึกษาฟรี</strong><span>Line: @dongfunda</span>
      </TrackedLink>
      <TrackedLink section="contact_bar" eventType="phone" preserveMeta={false} className={styles.phone} href="tel:0849332331">
        <strong>โทรปรึกษา</strong><span>084-933-2331</span>
      </TrackedLink>
      <TrackedLink section="contact_bar" eventType="facebook" preserveMeta={false} className={styles.facebook} href="https://www.facebook.com/DongFunda" target="_blank" rel="noopener noreferrer">
        <strong>Facebook</strong><span>DongFunda</span>
      </TrackedLink>
      <TrackedLink section="contact_bar" eventType="youtube" preserveMeta={false} className={styles.youtube} href="https://www.youtube.com/@DongFunda" target="_blank" rel="noopener noreferrer">
        <strong>YouTube</strong><span>DongFunda</span>
      </TrackedLink>
    </nav>
  );
}
