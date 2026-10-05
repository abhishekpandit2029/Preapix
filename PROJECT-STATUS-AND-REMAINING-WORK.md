# Preapix — Project Status

## Current architecture

- Supabase Auth manages sign-up, sign-in, confirmation, and sessions.
- User projects, API definitions, scenarios, dashboard request previews, and documentation snapshots are stored in one `public.preapix_workspaces` JSONB row per authenticated user. Row-level security restricts dashboard access to that user.
- Public mock URLs use the short form `/api/mock/{projectKey}/{apiPath}`. The mock route resolves the project configuration from Supabase with the `preapix_get_mock_project` RPC.
- Mock responses preserve the configured JSON structure and expand object arrays to at least 20 generated records.
- Workspace import/export and dashboard previews are available. External calls to public mock endpoints are not currently added to request history.

## Supabase setup

Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, then run `supabase/migrations/20261005000100_workspace_storage.sql` in the Supabase SQL Editor. The dashboard and public mock endpoint require this migration.

## Remaining work before production

- Add automated tests for row-level security, workspace save/load, mock URL resolution, scenarios, and generated response shape.
- Decide whether request logs from external clients should be collected and define retention limits.
- Add production deployment configuration, monitoring, and database backups.
- Add distributed auth rate limiting, password recovery, and abuse alerts.
- Existing data from the former browser-only workspace is not migrated automatically.

## Local checks

Run `pnpm dev` for local development, `pnpm lint` for linting, and `pnpm exec tsc --noEmit` for TypeScript validation. See `README.md` for setup details.
