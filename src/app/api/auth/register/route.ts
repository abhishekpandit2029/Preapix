import { NextResponse } from "next/server";
import { z } from "zod";
import { isDatabaseConfigured } from "@/lib/db";
import { registerUser, sessionCookie } from "@/server/services/auth-service";

const registrationSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(254),
  password: z.string().min(10).max(200),
});

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  try {
    const input = registrationSchema.parse(await request.json());
    const { user, token } = await registerUser(input);
    const response = NextResponse.json({ user });
    const cookie = sessionCookie(token);
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message ?? "Check your account details." }, { status: 400 });
    const message = error instanceof Error ? error.message : "Could not create your account.";
    const status = message === "An account with this email already exists." ? 409 : 503;
    return NextResponse.json({ error: status === 503 ? "Could not reach PostgreSQL. Check your Layerbase connection and migration." : message }, { status });
  }
}
