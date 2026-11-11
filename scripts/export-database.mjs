import { writeFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

const outputPath = process.argv[2];
const databaseUrl =
  process.env.DATABASE_URL_UNPOOLED?.trim() || process.env.DATABASE_URL?.trim();

if (!outputPath) {
  throw new Error('An output path is required');
}

if (!databaseUrl) {
  throw new Error('DATABASE_URL_UNPOOLED or DATABASE_URL is required');
}

const sql = neon(databaseUrl);
const leads = await sql`
  SELECT
    id,
    submission_id,
    name,
    email,
    service,
    message,
    status,
    source,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    gclid,
    fbclid,
    landing_page,
    referrer,
    created_at,
    updated_at
  FROM leads
  ORDER BY created_at ASC
`;

const backup = {
  format: 'dap-strategic-database-backup',
  version: 1,
  exportedAt: new Date().toISOString(),
  tables: { leads },
};

await writeFile(outputPath, JSON.stringify(backup, null, 2), {
  encoding: 'utf8',
  flag: 'wx',
});

console.log(`Exported ${leads.length} lead record(s).`);
