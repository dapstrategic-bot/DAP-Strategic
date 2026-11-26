// Keep this in sync with the verified GA4 stream's 30-minute inactivity timeout.
export const GA_SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const MEASUREMENT_ID = 'G-F7YFJ2S9YL';

function sendResumePageView() {
  const params = {
    send_to: MEASUREMENT_ID,
    page_location: window.location.href,
    page_title: document.title,
    page_language: /^\/en(?:\/|$)/.test(window.location.pathname) ? 'en' : 'th',
    page_view_reason: 'resume_after_inactivity',
  };

  // GTM does not have to expose window.gtag. Queue the standard gtag command
  // without adding another config command or loading another Google tag.
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', params);
  } else {
    window.dataLayer = window.dataLayer || [];
    function enqueue(..._args: unknown[]) {
      window.dataLayer!.push(arguments);
    }
    enqueue('event', 'page_view', params);
  }
}

/**
 * A return to a long-hidden page is a renewed content view. GA4 can otherwise
 * start a new session with only user_engagement, leaving Landing page unset.
 * Initial loads and route changes remain owned by GTM/enhanced measurement.
 * No polling, keep-alive events, session overrides, or activity in hidden tabs.
 */
export function installPageResumeTracking({
  inactivityMs = GA_SESSION_TIMEOUT_MS,
  onResume = sendResumePageView,
}: { inactivityMs?: number; onResume?: () => void } = {}) {
  let hiddenAt: number | null = document.visibilityState === 'hidden' ? Date.now() : null;
  let hiddenUrl = window.location.href;
  let pending: ReturnType<typeof setTimeout> | undefined;

  const cancelPending = () => {
    if (pending !== undefined) clearTimeout(pending);
    pending = undefined;
  };

  const visibilityChanged = () => {
    cancelPending();
    if (document.visibilityState === 'hidden') {
      // Repeated hidden notifications must not reset the inactivity clock.
      if (hiddenAt === null) {
        hiddenAt = Date.now();
        hiddenUrl = window.location.href;
      }
      return;
    }
    if (document.visibilityState !== 'visible' || hiddenAt === null) return;

    const shouldResume = Date.now() - hiddenAt >= inactivityMs;
    const previousUrl = hiddenUrl;
    hiddenAt = null; // Consume once; focus/visibility repeats cannot resend it.
    if (!shouldResume) return;

    // Allow history/navigation in the same task to settle. A changed URL already
    // gets an automatic page_view and must not also receive this fallback.
    pending = setTimeout(() => {
      pending = undefined;
      if (document.visibilityState === 'visible' && window.location.href === previousUrl) {
        onResume();
      }
    }, 0);
  };

  document.addEventListener('visibilitychange', visibilityChanged);
  window.addEventListener('popstate', cancelPending);
  return () => {
    cancelPending();
    document.removeEventListener('visibilitychange', visibilityChanged);
    window.removeEventListener('popstate', cancelPending);
  };
}
