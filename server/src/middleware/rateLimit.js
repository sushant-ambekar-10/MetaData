import rateLimit from 'express-rate-limit';

const make = (windowMs, limit, message) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (_req, res) =>
      res.status(429).json({ success: false, error: { code: 'RATE_LIMITED', message } }),
  });

export const apiLimiter = make(15 * 60 * 1000, 300, 'Too many requests, please try again later.');
export const authLimiter = make(15 * 60 * 1000, 8, 'Too many login attempts. Try again in 15 minutes.');
export const contactLimiter = make(60 * 60 * 1000, 5, 'Too many messages sent. Please try again later.');