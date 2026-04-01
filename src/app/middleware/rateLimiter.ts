import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redis } from '../config/redis'; 
import { Request, Response, NextFunction } from 'express';

const limiter = new RateLimiterRedis({
  storeClient: redis,
  points: 20,
  duration: 60,
  keyPrefix: 'global_rl', 
});

export const globalRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  // Apply only for POST and PATCH methods
  if (req.method === 'POST' || req.method === 'PATCH') {
    const key = req.ip || 'unknown';

    console.log(`[RATE LIMIT] Incoming ${req.method} request from: ${key}`);

    try {
      const result = await limiter.consume(key);

      console.log(
        `[RATE LIMIT] Allowed - ${key} | Remaining: ${result.remainingPoints}`
      );

      next();
    } catch (rejRes: any) {
      console.warn(
        `[RATE LIMIT] Blocked - ${key} | Retry after: ${Math.round(
          rejRes.msBeforeNext / 1000
        )}s`
      );

      res.status(429).json({
        message: 'Too many requests. Please try again later.',
      });
    }
  } else {
    next();
  }
};