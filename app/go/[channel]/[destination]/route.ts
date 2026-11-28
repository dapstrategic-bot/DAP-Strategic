import { NextResponse } from 'next/server';
import { campaignDestination } from '@/lib/campaign-links';
import { SITE_URL } from '@/lib/site-identity';

export async function GET(request: Request, { params }: {
  params: Promise<{ channel: string; destination: string }>;
}) {
  const { channel, destination } = await params;
  const target = campaignDestination(channel, destination, new URL(request.url).searchParams.get('content'));
  if (!target) return new NextResponse('Campaign link not found', {
    status: 404, headers: { 'X-Robots-Tag': 'noindex', 'Cache-Control': 'no-store' },
  });
  const response = NextResponse.redirect(new URL(target, SITE_URL), 307);
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('X-Robots-Tag', 'noindex, follow');
  return response;
}
