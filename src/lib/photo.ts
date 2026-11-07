/**
 * Vercel rejects function request bodies over 4.5 MB, so the limit sits below that
 * to give a clear message instead of a platform error.
 */
export const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

export type PhotoType = "image/jpeg" | "image/png" | "image/webp";

/** Identifies the format from the file's bytes, since a declared type can't be trusted. */
export function detectPhotoType(bytes: Uint8Array): PhotoType | null {
  const startsWith = (...signature: number[]) => signature.every((byte, i) => bytes[i] === byte);
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));

  if (startsWith(0xff, 0xd8, 0xff)) return "image/jpeg";
  if (startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  return null;
}

export type PhotoCheck =
  | { ok: true; type: PhotoType }
  | { ok: false; status: 400 | 413 | 415; message: string };

export function checkPhoto(bytes: Uint8Array): PhotoCheck {
  if (bytes.length === 0) return { ok: false, status: 400, message: "Choose a photo to upload." };
  if (bytes.length > MAX_PHOTO_BYTES) {
    return { ok: false, status: 413, message: "That photo is over 4 MB. Choose a smaller one." };
  }
  const type = detectPhotoType(bytes);
  if (!type) return { ok: false, status: 415, message: "Upload a JPEG, PNG or WebP image." };
  return { ok: true, type };
}
