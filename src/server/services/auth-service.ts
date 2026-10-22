import "server-only";
import { createHash, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { getDatabase } from "@/lib/db";

const scrypt = promisify(nodeScrypt);
const SESSION_COOKIE = "preapix_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const PASSWORD_HASH_BYTES = 64;

type User = { id: string; email: string; name: string; createdAt: string };
type PasswordRow = { id: string; email: string; name: string; password_hash: string; created_at: Date };

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getCookie(request: Request, name: string) {
  const entry = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  if (!entry) return null;
  try { return decodeURIComponent(entry.slice(name.length + 1)); } catch { return null; }
}

function toPublicUser(row: { id: string; email: string; name: string; created_at: Date | string }): User {
  return { id: row.id, email: row.email, name: row.name, createdAt: new Date(row.created_at).toISOString() };
}

async function makePasswordHash(password: string) {
  const salt = randomBytes(16);
  const derivedKey = await scrypt(password, salt, PASSWORD_HASH_BYTES) as Buffer;
  return `scrypt$${salt.toString("hex")}$${derivedKey.toString("hex")}`;
}

async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, saltHex, keyHex] = storedHash.split("$");
  if (algorithm !== "scrypt" || !saltHex || !keyHex || !/^[\da-f]+$/i.test(saltHex) || !/^[\da-f]+$/i.test(keyHex)) return false;
  const expected = Buffer.from(keyHex, "hex");
  if (expected.length !== PASSWORD_HASH_BYTES) return false;
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length) as Buffer;
  return timingSafeEqual(actual, expected);
}

async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashSessionToken(token);
  await getDatabase().query(
    "insert into preapix_sessions (user_id, token_hash, expires_at) values ($1, $2, now() + ($3 * interval '1 second'))",
    [userId, tokenHash, SESSION_TTL_SECONDS],
  );
  return token;
}

export async function registerUser(input: { email: string; name: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const passwordHash = await makePasswordHash(input.password);
  try {
    const { rows } = await getDatabase().query<Pick<PasswordRow, "id" | "email" | "name" | "created_at">>(
      "insert into preapix_users (email, name, password_hash) values ($1, $2, $3) returning id, email, name, created_at",
      [email, name, passwordHash],
    );
    return { user: toPublicUser(rows[0]), token: await createSession(rows[0].id) };
  } catch (error) {
    if ((error as { code?: string }).code === "23505") throw new Error("An account with this email already exists.");
    throw error;
  }
}

export async function loginUser(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const { rows } = await getDatabase().query<PasswordRow>(
    "select id, email, name, password_hash, created_at from preapix_users where email = $1 limit 1",
    [email],
  );
  const row = rows[0];
  if (!row || !(await verifyPassword(input.password, row.password_hash))) throw new Error("Invalid email or password.");
  return { user: toPublicUser(row), token: await createSession(row.id) };
}

export async function getSessionUser(request: Request) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token || token.length > 128) return null;
  const { rows } = await getDatabase().query<Pick<PasswordRow, "id" | "email" | "name" | "created_at">>(
    `select users.id, users.email, users.name, users.created_at
     from preapix_sessions as sessions
     join preapix_users as users on users.id = sessions.user_id
     where sessions.token_hash = $1 and sessions.expires_at > now()
     limit 1`,
    [hashSessionToken(token)],
  );
  return rows[0] ? toPublicUser(rows[0]) : null;
}

export async function deleteSession(request: Request) {
  const token = getCookie(request, SESSION_COOKIE);
  if (token && token.length <= 128) await getDatabase().query("delete from preapix_sessions where token_hash = $1", [hashSessionToken(token)]);
}

export function sessionCookie(token: string, maxAge = SESSION_TTL_SECONDS) {
  return { name: SESSION_COOKIE, value: token, options: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge } };
}
