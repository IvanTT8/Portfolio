import { createClient } from "@sanity/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { CONTENT_CACHE_TAG } from "@/lib/content";
import { checkPhoto, MAX_PHOTO_BYTES } from "@/lib/photo";
import { isValidSessionToken, SESSION_COOKIE } from "@/lib/session";
import { apiVersion, dataset, projectId } from "@/sanity/env";

/** Allows for the form encoding around the file. */
const MAX_REQUEST_BYTES = MAX_PHOTO_BYTES + 64 * 1024;

const errorResponse = (status: number, error: string) => NextResponse.json({ error }, { status });

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  if (!isValidSessionToken(session, process.env.SESSION_SECRET)) {
    return errorResponse(401, "Sign in to upload a photo.");
  }

  const token = process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !token) {
    return errorResponse(503, "Connect a Sanity project to upload a photo.");
  }

  if (Number(request.headers.get("content-length") ?? 0) > MAX_REQUEST_BYTES) {
    return errorResponse(413, "That photo is over 4 MB. Choose a smaller one.");
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("photo");
  if (!(file instanceof File)) return errorResponse(400, "Choose a photo to upload.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const check = checkPhoto(bytes);
  if (!check.ok) return errorResponse(check.status, check.message);

  try {
    const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
    const asset = await client.assets.upload("image", Buffer.from(bytes), {
      contentType: check.type,
      filename: "profile-photo",
    });
    await client
      .patch("profile")
      .set({ photo: { _type: "image", asset: { _type: "reference", _ref: asset._id } } })
      .commit();
  } catch (error) {
    console.error("Photo upload failed", error);
    return errorResponse(502, "The upload failed. Try again.");
  }

  revalidateTag(CONTENT_CACHE_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
