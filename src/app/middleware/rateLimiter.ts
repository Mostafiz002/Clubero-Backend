import { RateLimiterRedis } from "rate-limiter-flexible";
import { redis } from "../config/redis";
import { Request, Response, NextFunction } from "express";

// limiter for POST & PATCH
const writeLimiter = new RateLimiterRedis({
  storeClient: redis,
  points: 20,
  duration: 60,
  keyPrefix: "rl_write",
});

// Default limiter for others
const readLimiter = new RateLimiterRedis({
  storeClient: redis,
  points: 100,
  duration: 60,
  keyPrefix: "rl_read",
});

export const globalRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const key = req.ip || "unknown";
  try {
    let result;

    if (req.method === "POST" || req.method === "PATCH") {
      result = await writeLimiter.consume(key);
    } else {
      result = await readLimiter.consume(key);
    }

    next();
  } catch (rejRes: any) {
    console.warn(
      `[RATE LIMIT BLOCKED] ${key} | Retry after: ${Math.round(
        rejRes.msBeforeNext / 1000,
      )}s`,
    );

    res.status(429).json({
      message: "Too many requests. Please try again later.",
    });
  }
};
