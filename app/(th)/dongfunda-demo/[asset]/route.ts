import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { demoEnabled } from '@/lib/dongfunda/model';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ asset: string }> },
) {
  const { asset } = await params;
  if (!demoEnabled() || !['bh.png', 'bdms.jpg', 'lh.png', 'bdms-sf04.png'].includes(asset))
    return new Response(null, { status: 404 });
  const bytes = await readFile(
    path.join(process.cwd(), 'demo/dongfunda', asset),
  );
  return new Response(bytes, {
    headers: {
      'Content-Type': asset.endsWith('.jpg') ? 'image/jpeg' : 'image/png',
      'Cache-Control': 'private, max-age=3600',
      'X-Robots-Tag': 'noindex',
    },
  });
}
