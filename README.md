# Preapix

Preapix is a PostgreSQL-backed mock API workspace for frontend teams. Define response shapes, generate sample data, preview scenarios, and share short mock endpoints while your backend is being built.

Application code follows the Next.js `src` layout: routes and UI are in `src/app`, database helpers in `src/lib`, and server services in `src/server`.

## Local setup

1. Install Node.js 20.9 or newer.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` to the pooled PostgreSQL connection string from Layerbase. Keep it server-only and include `sslmode=require`.
3. Run `pnpm db:migrate` to create the app tables in your Layerbase database. The migration is safe to run again.
4. Install dependencies with `pnpm install`.
5. Start the development server with `pnpm dev` and open `http://localhost:3000`.
6. Create an account in the dashboard. New accounts sign in immediately; passwords are hashed before storage.

`NEXT_PUBLIC_DB_URL` is accepted temporarily for existing local setup, but rename it to `DATABASE_URL`. The `NEXT_PUBLIC_` prefix is intended for browser-visible values, while this connection string contains database credentials.

Useful commands: `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm build`.

## Data and security

The app uses a server-only PostgreSQL connection. Accounts, hashed sessions, and workspace JSON are stored in `preapix_users`, `preapix_sessions`, and `preapix_workspaces`. Session tokens are random, stored only as SHA-256 hashes in PostgreSQL, and sent to the browser as HttpOnly, SameSite cookies. Workspace endpoints derive the user identity from the session cookie; clients cannot choose a user ID.

Authentication uses local email and password accounts. Email confirmation, password reset, OAuth, and account recovery are not configured.

Mock endpoint responses are public to anyone with the project's public key and URL. Never put secrets in mock responses. Dashboard test previews are stored in the workspace; external endpoint requests are not logged. Keep `.env` out of source control. `/api/health` checks database readiness.
