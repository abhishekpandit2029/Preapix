import { NextResponse } from "next/server";
import { z } from "zod";
import { isDatabaseConfigured } from "@/lib/db";
import { loginUser, sessionCookie } from "@/server/services/auth-service";

const loginSchema = z.object({ email: z.email().max(254), password: z.string().min(1).max(200) });

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  try {
    const input = loginSchema.parse(await request.json());
    const { user, token } = await loginUser(input);
    const response = NextResponse.json({ user });
    const cookie = sessionCookie(token);
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
    const message = error instanceof Error ? error.message : "Could not sign in.";
    const status = message === "Invalid email or password." ? 401 : 503;
    return NextResponse.json({ error: status === 503 ? "Could not reach PostgreSQL. Check your Layerbase connection and migration." : message }, { status });
  }
}
