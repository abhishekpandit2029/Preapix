# Preapix

Preapix is a Supabase-backed mock API workspace for frontend teams. Define response shapes, generate random data with the same structure, preview scenarios, and share short mock endpoints with your frontend.

## Local setup

1. Install Node.js 20.9 or newer.
2. Copy `.env.example` to `.env` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
3. In Supabase Dashboard → SQL Editor, run [`supabase/migrations/20261005000100_workspace_storage.sql`](supabase/migrations/20261005000100_workspace_storage.sql).
4. Install dependencies with `pnpm install`.
5. In Supabase Dashboard → Authentication → URL Configuration, add `http://localhost:3000/auth/callback` to the allowed redirect URLs.
6. Start the development server with `pnpm dev` and open `http://localhost:3000`.
7. Create an account, then confirm your email if email confirmation is enabled in Supabase.

Useful commands: `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm build`.

## Data and security

Supabase Auth handles accounts and sessions. Project definitions, scenarios, request previews, and documentation snapshots are stored in the user's `preapix_workspaces` Supabase row and protected by row-level security. The public mock endpoint resolves the project key through the `preapix_get_mock_project` RPC, so generated URLs stay short: `/api/mock/{projectKey}/{apiPath}`.

Run the SQL migration before using the dashboard or mock endpoints. Endpoint response definitions are public to anyone who has the project's public key and URL; never put secrets in mock responses. Dashboard previews are recorded in the workspace; external endpoint requests are not currently logged. Keep `.env` out of source control. `/api/health` reports app readiness.
