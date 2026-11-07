function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

/** Shown until a different photo is uploaded. */
export const DEFAULT_PHOTO_URL = "/photos/navy-suit.jpg";

/** The other three cards in the hero's photo stack. The front card is the main photo. */
export const HERO_PHOTOS = ["/photos/black-roll-neck.jpg", "/photos/white-collar.jpg", "/photos/tweed-jacket.jpg"];

/** The one setting that decides the site's public address. */
export const siteUrl = resolveSiteUrl().replace(/\/$/, "");
