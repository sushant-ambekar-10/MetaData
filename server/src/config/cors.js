import { allowedOrigins, isProd } from './env.js';

const LOCAL = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

// Requests with no Origin (curl, server-to-server, same-origin GET) are allowed here;
// state-changing requests are additionally guarded in middleware/csrf.js.
export function isOriginAllowed(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  return !isProd && LOCAL.test(origin);
}

export const corsOptions = {
  origin(origin, cb) {
    cb(null, isOriginAllowed(origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Requested-With'],
  maxAge: 86400,
};