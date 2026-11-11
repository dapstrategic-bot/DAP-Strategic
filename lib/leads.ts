import 'server-only';

import { randomUUID } from 'node:crypto';
import type { ContactSubmission } from '@/lib/contact-schema';
import { getDatabase } from '@/lib/db';

export async function saveLead(submission: ContactSubmission) {
  const sql = getDatabase();
  const attribution = submission.attribution;

  const rows = await sql`
    INSERT INTO leads (
      id,
      submission_id,
      name,
      email,
      service,
      message,
      source,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      gclid,
      fbclid,
      landing_page,
      referrer
    ) VALUES (
      ${randomUUID()},
      ${submission.submissionId},
      ${submission.name},
      ${submission.email ?? null},
      ${submission.service},
      ${submission.message ?? null},
      'website_contact_form',
      ${attribution?.utmSource ?? null},
      ${attribution?.utmMedium ?? null},
      ${attribution?.utmCampaign ?? null},
      ${attribution?.utmTerm ?? null},
      ${attribution?.utmContent ?? null},
      ${attribution?.gclid ?? null},
      ${attribution?.fbclid ?? null},
      ${attribution?.landingPage ?? null},
      ${attribution?.referrer ?? null}
    )
    ON CONFLICT (submission_id) DO NOTHING
    RETURNING id
  `;

  return { inserted: rows.length === 1 };
}
