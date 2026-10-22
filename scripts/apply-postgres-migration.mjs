import { readFile } from "node:fs/promises";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL ?? process.env.NEXT_PUBLIC_DB_URL;

if (!connectionString) {
  throw new Error("Set DATABASE_URL or NEXT_PUBLIC_DB_URL in .env before running migrations.");
}

const pool = new Pool({
  connectionString,
  max: 1,
  connectionTimeoutMillis: 10_000,
  application_name: "preapix-migration",
});

const client = await pool.connect();

try {
  const migration = await readFile(new URL("../postgres/migrations/001_preapix.sql", import.meta.url), "utf8");
  await client.query("begin");
  await client.query(migration);
  await client.query("commit");
  process.stdout.write("PostgreSQL migration applied successfully.\n");
} catch (error) {
  await client.query("rollback");
  throw error;
} finally {
  client.release();
  await pool.end();
}
