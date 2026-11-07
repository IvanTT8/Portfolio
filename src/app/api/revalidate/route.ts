import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { CONTENT_CACHE_TAG } from "@/lib/content";

/** Called by the Sanity publish webhook, so published changes reach the live site. */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook isn't configured." }, { status: 503 });

  const { isValidSignature } = await parseBody(request, secret);
  if (!isValidSignature) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  revalidateTag(CONTENT_CACHE_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true });
}
