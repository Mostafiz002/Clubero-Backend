import { redis } from "../config/redis";

type FetchFunction<T> = () => Promise<T>;

/**
 * Reusable function to handle Redis caching
 * @param key string - unique cache key
 * @param fetchFn function - async function to fetch data if not in cache
 * @param ttl number - time to live in seconds (default 60s)
 */
export const cacheWrapper = async <T>(
  key: string,
  fetchFn: FetchFunction<T>,
  ttl = 60,
): Promise<T> => {
  try {
    const cached = await redis.get(key);
    if (cached) {
      console.log(`⚡ Cache hit: ${key}`);
      return JSON.parse(cached) as T;
    }
  } catch (err) {
    console.error(`Redis read error for key ${key}:`, err);
  }

  const data = await fetchFn();

  try {
    await redis.set(key, JSON.stringify(data), "EX", ttl);
    console.log(`💾 Cache set: ${key}`);
  } catch (err) {
    console.error(`Redis write error for key ${key}:`, err);
  }

  return data;
};
