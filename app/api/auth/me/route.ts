import { NextResponse } from "next/server";
import { getSessionUser } from "@/server/services/auth-service";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ user: null, configured: false });
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ user: null, configured: true });
  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt }, configured: true });
}
