const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;

type Entry = { failures: number; resetAt: number };

/**
 * Counts failed sign-ins in memory. Serverless instances don't share this, so it
 * slows guessing but isn't a hard limit. A long password is the real protection.
 */
export function createLoginLimiter() {
  const entries = new Map<string, Entry>();

  function current(key: string, now: number): Entry | undefined {
    const entry = entries.get(key);
    if (entry && entry.resetAt <= now) {
      entries.delete(key);
      return undefined;
    }
    return entry;
  }

  return {
    isBlocked(key: string, now: number = Date.now()): boolean {
      return (current(key, now)?.failures ?? 0) >= MAX_FAILURES;
    },
    recordFailure(key: string, now: number = Date.now()): void {
      const entry = current(key, now) ?? { failures: 0, resetAt: now + WINDOW_MS };
      entry.failures += 1;
      entries.set(key, entry);
    },
    reset(key: string): void {
      entries.delete(key);
    },
  };
}

export const loginLimiter = createLoginLimiter();
