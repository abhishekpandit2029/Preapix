import "server-only";
import { Pool } from "pg";

const globalForDatabase = globalThis as typeof globalThis & { preapixPool?: Pool };

function getDatabaseUrl() {
  const env = process.env as Record<string, string | undefined>;
  const connectionString = env.DATABASE_URL ?? env.NEXT_PUBLIC_DB_URL;
  if (!connectionString) throw new Error("Set DATABASE_URL to your Layerbase PostgreSQL connection string.");
  return connectionString;
}

export function isDatabaseConfigured() {
  const env = process.env as Record<string, string | undefined>;
  return Boolean(env.DATABASE_URL ?? env.NEXT_PUBLIC_DB_URL);
}

export function getDatabase() {
  if (!globalForDatabase.preapixPool) {
    globalForDatabase.preapixPool = new Pool({
      connectionString: getDatabaseUrl(),
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
      application_name: "preapix",
    });
  }
  return globalForDatabase.preapixPool;
}
