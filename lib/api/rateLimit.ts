type RateLimitEntry = {
  timestamps: number[];
};

type RateLimitResult = {
  limited: boolean;
  remaining: number;
  retryAfter: number;
};

/**
 * In-memory sliding window rate limiter.
 * Appropriate for single-instance deployments (Vercel serverless).
 */
function createRateLimiter(windowMs: number, maxRequests: number) {
  const store = new Map<string, RateLimitEntry>();

  // Cleanup expired entries every 60 seconds
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
      if (entry.timestamps.length === 0) store.delete(key);
    }
  }, 60_000).unref();

  return function check(key: string): RateLimitResult {
    const now = Date.now();
    const entry = store.get(key) ?? { timestamps: [] };

    // Remove timestamps outside the window
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

    if (entry.timestamps.length >= maxRequests) {
      const oldest = entry.timestamps[0];
      const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
      return { limited: true, remaining: 0, retryAfter };
    }

    entry.timestamps.push(now);
    store.set(key, entry);

    return {
      limited: false,
      remaining: maxRequests - entry.timestamps.length,
      retryAfter: 0,
    };
  };
}

/** 60 requests per minute — for search endpoint */
export const searchLimiter = createRateLimiter(60_000, 60);

/** 120 requests per minute — for places endpoints */
export const placesLimiter = createRateLimiter(60_000, 120);
