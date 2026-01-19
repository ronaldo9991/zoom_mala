/**
 * In-memory cache for live rates
 * Note: For production, consider using Redis for distributed caching
 */

interface CachedData {
  data: any;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CachedData>();

/**
 * Get cached data if still valid
 */
export function getCached(key: string): any | null {
  const cached = cache.get(key);
  if (!cached) return null;

  const age = Date.now() - cached.timestamp;
  if (age > cached.ttl * 1000) {
    cache.delete(key);
    return null;
  }

  return cached.data;
}

/**
 * Set cached data with TTL
 */
export function setCached(key: string, data: any, ttlSeconds: number): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlSeconds,
  });
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get cache stats (for debugging)
 */
export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}

