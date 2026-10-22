export function normalizeApiPath(value: string) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) {
    return "/";
  }

  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return normalized.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
}

export function sanitizeJsonString(value: string | null | undefined, fallback: string) {
  if (!value || !value.trim()) {
    return fallback;
  }

  try {
    JSON.parse(value);
    return value;
  } catch {
    return fallback;
  }
}

export function normalizeResponseHeaders(value: string) {
  let parsed: unknown;
  try { parsed = JSON.parse(value); } catch { throw new Error("Response headers must contain valid JSON."); }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Response headers must be a JSON object.");
  const headers: Record<string, string> = {};
  for (const [name, rawValue] of Object.entries(parsed)) {
    if (!["string", "number", "boolean"].includes(typeof rawValue)) throw new Error(`Header ${name} must have a text or number value.`);
    const headerValue = String(rawValue);
    if (/[\r\n]/.test(headerValue)) throw new Error(`Header ${name} contains an invalid line break.`);
    headers[name] = headerValue;
  }
  try { new Headers(headers); } catch { throw new Error("Response headers contain an invalid header name or value."); }
  return JSON.stringify(headers, null, 2);
}

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value || !value.trim()) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function stringifyJson(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value, null, 2);
}

export function toNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function createPublicKey(seed: string) {
  const digest = seed
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);

  return digest || `project-${Date.now().toString(36)}`;
}

export function buildEndpointUrl(projectKey: string, path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/mock/${projectKey}${normalizeApiPath(path)}`;
}
