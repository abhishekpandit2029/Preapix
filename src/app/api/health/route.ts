import { NextResponse } from "next/server";
import { getDatabase, isDatabaseConfigured } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDatabaseConfigured()) return NextResponse.json({ status: "unavailable", database: "not-configured" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  try {
    await getDatabase().query("select 1");
    return NextResponse.json({ status: "ok", workspaceStorage: "postgresql", timestamp: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ status: "unavailable", database: "unreachable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
