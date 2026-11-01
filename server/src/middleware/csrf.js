import { isOriginAllowed } from '../config/cors.js';
import { AppError } from '../utils/AppError.js';

const SAFE = new Set(['GET', 'HEAD', 'OPTIONS']);

// Cookie auth + sameSite=none needs CSRF defence. Two layers:
// 1) Browser Origin header (if present) must be in the allowlist.
// 2) A custom header is required; cross-site forms cannot set it, and
//    cross-site fetch with it triggers a preflight that our CORS policy rejects.
export function csrfGuard(req, _res, next) {
  if (SAFE.has(req.method)) return next();
  if (!isOriginAllowed(req.headers.origin)) throw new AppError(403, 'FORBIDDEN_ORIGIN', 'Origin not allowed');
  if (req.headers['x-requested-with'] !== 'portfolio') {
    throw new AppError(403, 'CSRF_BLOCKED', 'Missing X-Requested-With header');
  }
  next();
}