import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { lhPreviewEnabled } from '@/lib/dongfunda/lh-preview';

export const dynamic = 'force-dynamic';
export async function GET() {
  if (!lhPreviewEnabled()) return new Response(null, { status: 404 });
  const image = await readFile(path.join(process.cwd(), 'review-assets/lh/cover-c01.png'));
  return new Response(new Uint8Array(image), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' },
  });
}
