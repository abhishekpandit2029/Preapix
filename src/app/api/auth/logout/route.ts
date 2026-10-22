import { NextResponse } from "next/server";
import { deleteSession, sessionCookie } from "@/server/services/auth-service";

export async function POST(request: Request) {
  try {
    await deleteSession(request);
    const response = NextResponse.json({ success: true });
    const cookie = sessionCookie("", 0);
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    return response;
  } catch {
    return NextResponse.json({ error: "Could not reach PostgreSQL to close the session." }, { status: 503 });
  }
}
