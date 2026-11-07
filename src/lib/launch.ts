import type { Experience } from "./types";

const REQUIRED_YEARS = 10;

/**
 * The site claims "10+ years", so Launch requires an Experience entry that
 * started at least that long ago.
 */
export function supportsYearsClaim(
  experience: Pick<Experience, "start">[],
  now: Date = new Date(),
): boolean {
  const cutoff = new Date(now);
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - REQUIRED_YEARS);
  return experience.some((entry) => new Date(`${entry.start.slice(0, 10)}T00:00:00Z`) <= cutoff);
}
