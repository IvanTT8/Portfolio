import { NextResponse, type NextRequest } from "next/server";
import { loginLimiter } from "@/lib/rate-limit";
import {
  createSessionToken,
  isCorrectPassword,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/session";

export async function POST(request: NextRequest) {
  const clientKey = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (loginLimiter.isBlocked(clientKey)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 },
    );
  }

  const body: unknown = await request.json().catch(() => null);
  const attempt =
    typeof body === "object" && body !== null && "password" in body ? body.password : undefined;

  if (typeof attempt !== "string" || !isCorrectPassword(attempt, process.env.ADMIN_PASSWORD)) {
    loginLimiter.recordFailure(clientKey);
    return NextResponse.json({ error: "That password isn't correct." }, { status: 401 });
  }

  const token = createSessionToken(process.env.SESSION_SECRET);
  if (!token) {
    return NextResponse.json(
      { error: "SESSION_SECRET must be set to at least 32 characters." },
      { status: 503 },
    );
  }

  loginLimiter.reset(clientKey);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
