export type MarketingAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  landingPage?: string;
  referrer?: string;
};

const STORAGE_KEY = 'dap_marketing_attribution_v1';

function readStoredAttribution(): MarketingAttribution | undefined {
  try {
    const value = window.sessionStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as MarketingAttribution) : undefined;
  } catch {
    return undefined;
  }
}

export function captureMarketingAttribution() {
  if (typeof window === 'undefined' || readStoredAttribution()) return;

  const params = new URLSearchParams(window.location.search);
  const attribution: MarketingAttribution = {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmTerm: params.get('utm_term') || undefined,
    utmContent: params.get('utm_content') || undefined,
    gclid: params.get('gclid') || undefined,
    fbclid: params.get('fbclid') || undefined,
    landingPage: window.location.href,
    referrer: document.referrer || undefined,
  };

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Tracking attribution is optional and must never block the contact form.
  }
}

export function getMarketingAttribution() {
  if (typeof window === 'undefined') return undefined;
  captureMarketingAttribution();
  return readStoredAttribution();
}
