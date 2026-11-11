# DAP private database

The website stores contact requests directly in private PostgreSQL. The browser
never receives the database connection string, and the API does not send contact
details to analytics providers.

## Provisioning

1. Provision a private PostgreSQL database close to the Vercel Function region.
2. Run `db/migrations/0001_create_leads.sql` with the provider SQL editor.
3. Add the pooled connection string to Vercel as the server-only `DATABASE_URL`.
4. Redeploy and submit a test contact request before removing `MAKE_WEBHOOK_URL`.

## Local encrypted backups

On Windows, configure the backup once with:

```powershell
.\scripts\configure-database-backup.ps1
```

Paste the unpooled connection string into the secure prompt. It is protected by
Windows DPAPI for the current Windows user. Create a backup with:

```powershell
.\scripts\backup-database.ps1
```

The resulting `.dapbackup` file is encrypted for the current Windows user. Only
decrypt a copy when analysis is required, and remove the plaintext JSON after use.
