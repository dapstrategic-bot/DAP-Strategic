/** External campaign entry links only. Never use these for internal navigation. */
export const CAMPAIGN_CHANNELS: Record<string, { source: string; medium: string }> = {
  youtube: { source: 'youtube', medium: 'organic_video' },
  facebook: { source: 'facebook', medium: 'social' },
  // referral keeps LINE traffic classifiable in GA4's default channel group.
  line: { source: 'line', medium: 'referral' },
  email: { source: 'email', medium: 'email' },
};

export const CAMPAIGN_DESTINATIONS: Record<string, string> = {
  dongfunda: '/dongfunda',
  'one-report': '/dongfunda/one-report',
  bdms: '/dongfunda/one-report/bdms',
  hmpro: '/dongfunda/one-report/hmpro',
  cpall: '/dongfunda/one-report/cpall',
  financials: '/dongfunda/financial-statements',
  'bdms-financials': '/dongfunda/financial-statements/bdms',
  course: '/products/tonrob-2570',
};

export function campaignDestination(channel: string, destination: string, content?: string | null) {
  // Only fixed, own-property destinations: no arbitrary URL or inherited keys.
  if (!Object.hasOwn(CAMPAIGN_CHANNELS, channel) || !Object.hasOwn(CAMPAIGN_DESTINATIONS, destination)) return null;
  const { source, medium } = CAMPAIGN_CHANNELS[channel];
  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: medium,
    utm_campaign: destination === 'course' ? 'tonrob_2570' : 'one_report_free',
    utm_content: content && /^[a-z0-9_-]{1,80}$/i.test(content) ? content : destination,
  });
  return `${CAMPAIGN_DESTINATIONS[destination]}?${params}`;
}
