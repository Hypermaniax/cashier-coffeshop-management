interface Attempt {
  count: number;
  firstAt: number;
  blockedUntil?: number;
}

const store = new Map<string, Attempt>();
const WINDOW_MS = 5 * 60 * 1000; // 5 menit
const MAX_ATTEMPTS = 5;
const BLOCK_MS = 15 * 60 * 1000; // blokir 15 menit

export function checkRateLimit(key: string): {
  allowed: boolean;
  retryAfterSec?: number;
} {
  const now = Date.now();
  const rec = store.get(key);

  if (!rec) {
    store.set(key, { count: 1, firstAt: now });
    return { allowed: true };
  }

  if (rec.blockedUntil && rec.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((rec.blockedUntil - now) / 1000),
    };
  }

  if (now - rec.firstAt > WINDOW_MS) {
    store.set(key, { count: 1, firstAt: now });
    return { allowed: true };
  }

  rec.count += 1;
  if (rec.count > MAX_ATTEMPTS) {
    rec.blockedUntil = now + BLOCK_MS;
    return {
      allowed: false,
      retryAfterSec: Math.ceil(BLOCK_MS / 1000),
    };
  }

  store.set(key, rec);
  return { allowed: true };
}

export function resetRateLimit(key: string) {
  store.delete(key);
}
