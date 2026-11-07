import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "portfolio_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
const MIN_SECRET_LENGTH = 32;

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  // Hashing first gives equal lengths, so comparing doesn't reveal the length.
  const hash = (value: string) => createHmac("sha256", "compare").update(value).digest();
  return timingSafeEqual(hash(a), hash(b));
}

function usableSecret(secret: string | undefined): secret is string {
  return typeof secret === "string" && secret.length >= MIN_SECRET_LENGTH;
}

export function createSessionToken(
  secret: string | undefined,
  now: number = Date.now(),
): string | null {
  if (!usableSecret(secret)) return null;
  const expiresAt = String(now + SESSION_MAX_AGE_SECONDS * 1000);
  return `${expiresAt}.${sign(expiresAt, secret)}`;
}

export function isValidSessionToken(
  token: string | undefined,
  secret: string | undefined,
  now: number = Date.now(),
): boolean {
  if (!token || !usableSecret(secret)) return false;
  const [expiresAt, signature, ...rest] = token.split(".");
  if (!expiresAt || !signature || rest.length > 0) return false;
  if (!safeEqual(signature, sign(expiresAt, secret))) return false;
  const expiry = Number(expiresAt);
  return Number.isFinite(expiry) && expiry > now;
}

/** An unset password always fails, so sign-in stays off until one is configured. */
export function isCorrectPassword(attempt: string, password: string | undefined): boolean {
  if (!password) return false;
  return safeEqual(attempt, password);
}
