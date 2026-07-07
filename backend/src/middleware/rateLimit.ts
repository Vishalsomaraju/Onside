import rateLimit from 'express-rate-limit';

/**
 * Global rate limiter to prevent abuse and DDoS.
 * Configured generously for normal usage but tight enough to drop spammers.
 */
export const globalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per `window` (here, per minute)
  message: {
    success: false,
    reason: 'rate_limit_exceeded',
    message: 'Too many requests from this IP, please try again after a minute.'
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});
