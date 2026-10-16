// Public identity URLs stay on the approved domain, including in local previews.
export const SITE_URL = 'https://www.dap.co.th';
export const COMPANY_ID = `${SITE_URL}/#organization`;
export const BRAND_ID = `${SITE_URL}/dongfunda#brand`;
export const DONGFUNDA_TITLE = 'DongFunda | วิเคราะห์ธุรกิจ อ่านงบการเงิน และประเมินมูลค่า';
export const DONGFUNDA_DESCRIPTION =
  'DongFunda แบรนด์สื่อและการเรียนรู้ภายใต้ DAP Strategic รวมบทความ วิดีโอ และข้อมูลคอร์สออนไลน์ด้านการวิเคราะห์ธุรกิจ อ่านงบการเงิน และประเมินมูลค่า';
export const DONGFUNDA_CHANNELS = [
  { name: 'Facebook DongFunda', url: 'https://www.facebook.com/DongFunda' },
  { name: 'YouTube @DongFunda', url: 'https://www.youtube.com/@DongFunda' },
  { name: 'TikTok @dongfunda', url: 'https://www.tiktok.com/@dongfunda' },
] as const;
export const INSTRUCTOR_PROFILE = 'https://www.facebook.com/profile.php?id=61570121552717';
export const DONGFUNDA_LINE_URL = 'https://line.me/R/ti/p/@dongfunda';

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
