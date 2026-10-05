import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", workspaceStorage: "supabase", timestamp: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } });
}
