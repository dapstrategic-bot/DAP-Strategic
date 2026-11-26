// Public identity URLs stay on the approved domain, including in local previews.
export const SITE_URL = 'https://www.dap.co.th';
export const COMPANY_ID = `${SITE_URL}/#organization`;
export const BRAND_ID = `${SITE_URL}/dongfunda#brand`;
export const DONGFUNDA_TITLE = 'DongFunda | สรุป One Report งบการเงิน และวิเคราะห์หุ้น';
export const DONGFUNDA_DESCRIPTION =
  'DongFunda by DAP รวมสรุป One Report และ Dashboard งบการเงินรายบริษัท พร้อมบทความ วิดีโอ และคอร์สออนไลน์ เพื่อเข้าใจธุรกิจ อ่านงบการเงิน และประเมินมูลค่าหุ้น';
export const DONGFUNDA_CHANNELS = [
  { name: 'Facebook DongFunda', url: 'https://www.facebook.com/DongFunda' },
  { name: 'YouTube @DongFunda', url: 'https://www.youtube.com/@DongFunda' },
  { name: 'TikTok @dongfunda', url: 'https://www.tiktok.com/@dongfunda' },
] as const;
export const INSTRUCTOR_PROFILE = 'https://www.facebook.com/profile.php?id=61570121552717';
export const DONGFUNDA_LINE_URL = 'https://line.me/R/ti/p/@dongfunda';
// Owner-approved public contact for the English DAP preview.
export const DAP_WHATSAPP_URL = 'https://wa.me/66849332331';
export const DAP_CONTACT_EMAIL = 'dapstrategic@gmail.com';

// Escape HTML-sensitive characters when embedding any CMS-backed JSON-LD.
export const serializeJsonLd = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c');

export function isDongFundaChannel(value: string) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    const pathname = url.pathname.replace(/\/$/, '').toLowerCase();
    return (host === 'facebook.com' && pathname === '/dongfunda') ||
      ((host === 'youtube.com' || host === 'tiktok.com') && pathname === '/@dongfunda');
  } catch {
    return false;
  }
}
