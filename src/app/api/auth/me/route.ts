import { NextResponse } from "next/server";
import { getSessionUser } from "@/server/services/auth-service";
import { isDatabaseConfigured } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isDatabaseConfigured()) return NextResponse.json({ user: null, configured: false });
  try {
    const user = await getSessionUser(request);
    if (!user) return NextResponse.json({ user: null, configured: true });
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt }, configured: true });
  } catch {
    return NextResponse.json(
      { user: null, configured: true, error: "Could not reach PostgreSQL. Check your Layerbase connection and migration." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
