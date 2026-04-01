import { redis } from "../config/redis";

/**
 * Invalidate cache by key or key pattern
 * @param pattern string - exact key or pattern with *
 */
export const invalidateCache = async (pattern: string) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log("⚡ Cache invalidated for keys:", keys);
    }
  } catch (err) {
    console.error("Error invalidating cache:", err);
  }
};
