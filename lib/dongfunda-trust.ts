import {sanityClient} from './sanity';
import {normalizeTrustValues} from './dongfunda-trust-values';

const client = sanityClient.withConfig({useCdn: false, perspective: 'published'});
const query = '*[_id == "productsPage"][0].youtubeTrust{subscribers,videos,referenceDate}';

export async function getDongFundaTrustValues() {
  try {
    const values = await client.fetch(query, {}, {next: {revalidate: 30}});
    return normalizeTrustValues(values);
  } catch {
    return normalizeTrustValues(null);
  }
}
