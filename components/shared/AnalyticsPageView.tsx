'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { installPageResumeTracking } from '@/lib/page-resume-analytics';

function RoutePageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstPageView = useRef(true);
  const queryString = searchParams.toString();

  useEffect(() => installPageResumeTracking(), []);

  useEffect(() => {
    if (isFirstPageView.current) {
      isFirstPageView.current = false;
      return;
    }

    // GA4's verified enhanced measurement owns loads AND browser-history
    // changes. Sending another page_view here would double-count SPA views
    // whenever window.gtag becomes available. Meta still needs its route event.

    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [pathname, queryString]);

  return null;
}

export default function AnalyticsPageView() {
  return (
    <Suspense fallback={null}>
      <RoutePageView />
    </Suspense>
  );
}
