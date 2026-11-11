import 'server-only';

import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let database: NeonQueryFunction<false, false> | null = null;

export function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured');
  }

  database ??= neon<false, false>(databaseUrl);
  return database;
}
