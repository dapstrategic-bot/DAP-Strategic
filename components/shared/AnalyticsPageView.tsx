'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { captureMarketingAttribution } from '@/lib/attribution';

function RoutePageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstPageView = useRef(true);
  const queryString = searchParams.toString();

  useEffect(() => {
    captureMarketingAttribution();

    if (isFirstPageView.current) {
      isFirstPageView.current = false;
      return;
    }

    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_location: window.location.href,
        page_path: pagePath,
        page_title: document.title,
      });
    }

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
