import { NextResponse } from 'next/server';
import { contactSubmissionSchema } from '@/lib/contact-schema';
import { saveLead } from '@/lib/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_REQUEST_BYTES = 20_000;

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  const allowedOrigins = new Set<string>();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.VERCEL_URL;

  if (siteUrl) {
    try {
      allowedOrigins.add(new URL(siteUrl).origin);
    } catch {
      console.error('NEXT_PUBLIC_SITE_URL is invalid');
    }
  }
  if (vercelUrl) allowedOrigins.add(`https://${vercelUrl}`);
  if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.add('http://localhost:3000');
  }

  return allowedOrigins.has(origin);
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: 'Request is too large' }, { status: 413 });
  }

  try {
    const body = await request.json();
    const parsed = contactSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid contact form data' }, { status: 400 });
    }

    // Silently accept bot-filled honeypot submissions without storing them.
    if (parsed.data.website) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    await saveLead(parsed.data);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
    console.error(
      'Contact API Error:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    return NextResponse.json(
      { error: 'Failed to save contact request' },
      { status: 500 },
    );
  }
}
