import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  throw new Error("❌ Redis URL is not defined in env");
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
        console.error("❌ Redis retry limit reached");
        return null;
      }
      return Math.min(times * 200, 2000);
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("ready", () => console.log("🚀 Redis ready"));
redis.on("error", (err) => console.error("❌ Redis error:", err.message));
redis.on("reconnecting", () => console.warn("⚠️ Redis reconnecting..."));
redis.on("close", () => console.warn("🔴 Redis connection closed"));

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`📴 Received ${signal}, shutting down Redis...`);
  try {
    await redis.quit();
    console.log("🔴 Redis disconnected gracefully");
  } catch (err) {
    console.error("❌ Error during Redis shutdown:", err);
  } finally {
    process.exit(0);
  }
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
