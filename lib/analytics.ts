import { trackContactIntent, trackLeadSuccess } from './contact-analytics';
// lib/analytics.ts
// ──────────────────────────────────────────────────────────
// Centralized GA4 and Meta event tracking utilities.
// GTM loads the provider tags that expose `window.gtag()` and `window.fbq()`.
// ──────────────────────────────────────────────────────────

/**
 * ส่ง custom event ไป GA4 ผ่าน gtag
 */
type AnalyticsValue =
  | string
  | number
  | boolean
  | string[]
  | Record<string, unknown>[]
  | undefined;

export function trackEvent(
  eventName: string,
  params?: Record<string, AnalyticsValue>,
) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

export function trackMetaEvent(
  eventName: string,
  params?: Record<string, AnalyticsValue>,
) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, params);
  }
}

// พจนานุกรมแปลชื่อตัวแปรให้เป็นภาษาไทย เพื่อให้ลูกค้าดู Dashboard ง่ายขึ้น
const SECTION_LABELS: Record<string, string> = {
  header: 'แถบเมนูด้านบน (Header Desktop)',
  header_mobile: 'เมนูด้านบน (Header Mobile)',
  product_hero: 'ส่วนhero section products',
  products_cta: 'ส่วนชักชวนหน้าสินค้า (CTA)',
  home_cta: 'ส่วนชักชวนหน้าแรก (CTA)',
  services_cta: 'ส่วนชักชวนหน้า services (CTA)',
  footer: 'ส่วนล่างสุดของเว็บ (Footer)',
  contact: 'ส่วนข้อมูลหน้าติดต่อเรา',
  thank_you: 'หน้าชำระเงินสำเร็จ (Thank You)',
};

const PAYMENT_LABELS: Record<string, string> = {
  purchase: 'สั่งซื้อสินค้า',
  booking: 'จองบริการ',
};

/**
 * Predefined GA4 event helpers — เรียกใช้ง่ายจากทุก component
 */
export const GA = {
  /** คนเปิดดูหน้าสินค้า */
  viewProduct: (productName: string, productId: string, value: number) => {
    trackEvent('view_item', {
      currency: 'THB',
      value,
      items: [{ item_id: productId, item_name: productName, price: value }],
    });
    trackMetaEvent('ViewContent', {
      content_name: productName,
      content_ids: [productId],
      content_type: 'product',
      value,
      currency: 'THB',
    });
  },

  /** คนกดปุ่ม LINE (Add Line) */
  clickLine: (section: string) => {
    const readableSection = SECTION_LABELS[section] || section;
    trackContactIntent('line', section);
    trackMetaEvent('Contact', {
      content_name: readableSection,
    });
  },

  /** คนกดปุ่มสมัคร / register */
  clickRegister: (section: string) => {
    const readableSection = SECTION_LABELS[section] || section;
    trackEvent('click_register', {
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      section_id: section,
      section_name: readableSection,
      event_label: `กดสมัครจาก: ${readableSection}`,
    });
    trackMetaEvent('CompleteRegistration', {
      content_name: readableSection,
    });
  },

  /** คนส่งแบบฟอร์มให้ติดต่อกลับสำเร็จ */
  submitLead: (service: string) => {
    trackLeadSuccess(service);
    trackMetaEvent('Lead', {
      content_name: service,
    });
  },

  /** คนกดปุ่มชำระเงิน (สั่งซื้อ / จอง) */
  clickPayment: (
    productName: string,
    paymentType: 'purchase' | 'booking',
    value?: number,
  ) => {
    const readableType = PAYMENT_LABELS[paymentType] || paymentType;
    trackEvent('click_payment', {
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      product_name: productName,
      payment_type: readableType,
      event_label: `กด${readableType}: ${productName}`,
    });
    trackEvent('begin_checkout', {
      currency: 'THB',
      value,
      items: [{ item_name: productName, price: value }],
    });
    trackMetaEvent('InitiateCheckout', {
      content_name: productName,
      content_type: 'product',
      value,
      currency: 'THB',
    });
  },

  /** ใช้เฉพาะหลังระบบชำระเงินยืนยันธุรกรรมแล้ว */
  purchase: (
    source: string,
    productSlug: string,
    value: number,
    transactionId: string,
  ) => {
    const readableSource = PAYMENT_LABELS[source] || source;
    trackEvent('purchase', {
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      source_type: readableSource,
      product_id: productSlug,
      event_label: `${readableSource} สำเร็จ: ${productSlug}`,
      transaction_id: transactionId,
      value,
      currency: 'THB',
      items: [{ item_id: productSlug, price: value }],
    });
    trackMetaEvent('Purchase', {
      content_ids: [productSlug],
      content_type: 'product',
      value,
      currency: 'THB',
    });
  },

  /** คนเลื่อนอ่านถึง 75% ของหน้า */
  scroll75: () => {
    trackEvent('scroll_75', {
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      event_label: `อ่านถึง 75% หน้า: ${typeof window !== 'undefined' ? window.location.pathname : ''}`,
    });
  },

  /** คนเลื่อนอ่านเกือบจบหน้า (90%) */
  scroll90: () => {
    trackEvent('scroll_90', {
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      event_label: `อ่านถึง 90% หน้า: ${typeof window !== 'undefined' ? window.location.pathname : ''}`,
    });
  },
};
