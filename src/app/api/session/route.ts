import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isValidSessionToken, SESSION_COOKIE } from "@/lib/session";

export async function GET() {
  const cookieStore = await cookies();
  const authenticated = isValidSessionToken(
    cookieStore.get(SESSION_COOKIE)?.value,
    process.env.SESSION_SECRET,
  );
  return NextResponse.json({ authenticated }, { headers: { "Cache-Control": "no-store" } });
}
