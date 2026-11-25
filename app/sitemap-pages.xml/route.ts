import {getCompleteSitemap} from '@/lib/sitemap-data';
import {serializeSitemap} from '@/lib/sitemap-xml';

export const dynamic='force-static';
export const revalidate=300;

export async function GET() {
  return new Response(serializeSitemap(await getCompleteSitemap()), {
    headers:{'Content-Type':'application/xml; charset=utf-8'},
  });
}
