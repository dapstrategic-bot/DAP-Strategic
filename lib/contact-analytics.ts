export type ContactChannel = 'line' | 'phone' | 'facebook' | 'youtube';

const sections = new Set([
  'header', 'header_mobile', 'footer', 'home_hero', 'home_cta', 'services_cta',
  'service_card', 'service_video', 'portfolio_cta', 'portfolio_project_dialog',
  'contact', 'contact_bar', 'product_hero', 'products_cta', 'thank_you',
  'planning_pool_villa', 'planning_factory', 'planning_business_plan',
]);
const services = new Set(['course', 'feasibility', 'business-plan', 'strategy', 'other', 'general']);

function push(payload: Record<string, string>) {
  if (typeof window === 'undefined') return;
  try {
    // Clear event-specific fields so GTM cannot reuse a previous event's values.
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      page_path: window.location.pathname,
      section_id: '', contact_channel: '', service: '', form_id: '',
      ...payload,
    });
  } catch {
    // Measurement must never prevent a link or successful form from working.
  }
}

export function trackContactIntent(channel: ContactChannel, section: string, service?: 'feasibility' | 'business-plan') {
  if (!['line', 'phone', 'facebook', 'youtube'].includes(channel) || !sections.has(section)) return;
  push({ event: 'dap_contact_intent', contact_channel: channel, section_id: section,
    ...(service === 'feasibility' || service === 'business-plan' ? { service } : {}),
  });
}

export function trackLeadSuccess(service: string) {
  push({
    event: 'dap_lead_success', section_id: 'contact', form_id: 'contact_lead',
    service: services.has(service) ? service : 'general',
  });
}
