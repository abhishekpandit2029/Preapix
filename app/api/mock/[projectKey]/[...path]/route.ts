import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { resolveMockRequest, type MockProjectSnapshot } from "@/server/services/mock-engine";

export const runtime = "nodejs";

function buildRouteUrl(path: string[] | undefined, requestUrl: string) {
  const url = new URL(path?.length ? `/${path.join("/")}` : "/", "http://localhost");
  url.search = new URL(requestUrl).search;
  return url.toString();
}

function mockResponse(resolved: { body: string; statusCode: number; headers: Record<string, string> }) {
  const headers = new Headers(resolved.headers);
  headers.set("access-control-allow-origin", "*");
  headers.set("access-control-allow-methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  headers.set("access-control-allow-headers", "*");
  const body = [204, 205, 304].includes(resolved.statusCode) ? null : resolved.body;
  return new NextResponse(body, { status: resolved.statusCode, headers });
}

async function resolveFromSupabase(input: { projectKey: string; method: string; url: string; headers: Headers; body: unknown }) {
  const { url: supabaseUrl, key } = getSupabaseConfig();
  const supabase = createSupabaseClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.rpc("preapix_get_mock_project", { p_public_key: input.projectKey });
  if (error) return { statusCode: 503, headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify({ success: false, message: "Mock API storage is unavailable. Apply the Supabase migration and retry." }) };
  return resolveMockRequest({ ...input, snapshot: (data as MockProjectSnapshot | null) ?? null });
}

export async function GET(request: Request, { params }: { params: Promise<{ projectKey: string; path: string[] }> }) {
  const { projectKey, path } = await params;
  const resolved = await resolveFromSupabase({
    projectKey,
    method: "GET",
    url: buildRouteUrl(path, request.url),
    headers: request.headers,
    body: null,
  });

  return mockResponse(resolved);
}

export async function POST(request: Request, { params }: { params: Promise<{ projectKey: string; path: string[] }> }) {
  const { projectKey, path } = await params;
  const rawBody = await request.text();
  let parsedBody: unknown = rawBody;

  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    parsedBody = rawBody;
  }

  const resolved = await resolveFromSupabase({
    projectKey,
    method: "POST",
    url: buildRouteUrl(path, request.url),
    headers: request.headers,
    body: parsedBody,
  });

  return mockResponse(resolved);
}

export async function PUT(request: Request, { params }: { params: Promise<{ projectKey: string; path: string[] }> }) {
  const { projectKey, path } = await params;
  const rawBody = await request.text();
  let parsedBody: unknown = rawBody;

  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    parsedBody = rawBody;
  }

  const resolved = await resolveFromSupabase({
    projectKey,
    method: "PUT",
    url: buildRouteUrl(path, request.url),
    headers: request.headers,
    body: parsedBody,
  });

  return mockResponse(resolved);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ projectKey: string; path: string[] }> }) {
  const { projectKey, path } = await params;
  const rawBody = await request.text();
  let parsedBody: unknown = rawBody;

  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    parsedBody = rawBody;
  }

  const resolved = await resolveFromSupabase({
    projectKey,
    method: "PATCH",
    url: buildRouteUrl(path, request.url),
    headers: request.headers,
    body: parsedBody,
  });

  return mockResponse(resolved);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ projectKey: string; path: string[] }> }) {
  const { projectKey, path } = await params;
  const resolved = await resolveFromSupabase({
    projectKey,
    method: "DELETE",
    url: buildRouteUrl(path, request.url),
    headers: request.headers,
    body: null,
  });

  return mockResponse(resolved);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS", "access-control-allow-headers": "*", "access-control-max-age": "86400" } });
}
