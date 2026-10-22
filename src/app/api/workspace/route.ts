import { NextResponse } from "next/server";
import { getDatabase, isDatabaseConfigured } from "@/lib/db";
import { getSessionUser } from "@/server/services/auth-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_WORKSPACE_BYTES = 2 * 1024 * 1024;

function databaseError() {
  return NextResponse.json({ error: "Could not reach PostgreSQL. Check your Layerbase connection and migration." }, { status: 503, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: Request) {
  if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  try {
    const user = await getSessionUser(request);
    if (!user) return NextResponse.json({ error: "Sign in to open this workspace." }, { status: 401 });
    const { rows } = await getDatabase().query<{ data: unknown }>("select data from preapix_workspaces where user_id = $1", [user.id]);
    return NextResponse.json({ workspace: rows[0]?.data ?? { projects: [], published: {}, activity: [] } }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return databaseError();
  }
}

export async function PUT(request: Request) {
  if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  try {
    const user = await getSessionUser(request);
    if (!user) return NextResponse.json({ error: "Sign in to save this workspace." }, { status: 401 });
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_WORKSPACE_BYTES) return NextResponse.json({ error: "Workspace payload is too large." }, { status: 413 });
    const payload: unknown = JSON.parse(rawBody);
    const workspace = (payload as { workspace?: unknown } | null)?.workspace;
    if (!workspace || typeof workspace !== "object" || !Array.isArray((workspace as { projects?: unknown }).projects)) {
      return NextResponse.json({ error: "Workspace data is invalid." }, { status: 400 });
    }
    await getDatabase().query(
      `insert into preapix_workspaces (user_id, data, updated_at)
       values ($1, $2::jsonb, now())
       on conflict (user_id) do update set data = excluded.data, updated_at = excluded.updated_at`,
      [user.id, JSON.stringify(workspace)],
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Request body must contain valid JSON." }, { status: 400 });
    if (error instanceof Error && error.message.startsWith("Could not reach PostgreSQL")) return databaseError();
    return databaseError();
  }
}
