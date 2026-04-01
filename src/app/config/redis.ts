/**
 * Redis client setup using ioredis
 * - Connects to Redis using the URL from environment variables
 * - Handles connection, retries, and graceful shutdown
 * - Provides a singleton Redis instance for reuse across the app
 */

import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  throw new Error("[ERROR] Redis URL is not defined in env");
}

const globalForRedis = global as unknown as {
  redis?: Redis;
};

export const redis: Redis =
  globalForRedis.redis ??
  new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    connectTimeout: 10000,
    enableReadyCheck: true,
    retryStrategy: (times) => {
      if (times > 5) {
        console.error("[ERROR] Redis retry limit reached");
        return null;
      }
      return Math.min(times * 200, 2000);
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

// Event listeners
redis.on("connect", () => console.log("[INFO] Redis connected"));
redis.on("ready", () => console.log("[INFO] Redis ready"));
redis.on("error", (err) => console.error("[ERROR] Redis error:", err.message));
redis.on("reconnecting", () => console.warn("[WARN] Redis reconnecting..."));
redis.on("close", () => console.warn("[WARN] Redis connection closed"));

// Graceful shutdown for Redis
const shutdown = async (signal: string) => {
  console.log(`[INFO] Received ${signal}, shutting down Redis...`);
  try {
    await redis.quit();
    console.log("[INFO] Redis disconnected gracefully");
  } catch (err) {
    console.error("[ERROR] Error during Redis shutdown:", err);
  } finally {
    process.exit(0);
  }
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
