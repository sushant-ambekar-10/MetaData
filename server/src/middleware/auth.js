import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Admin } from '../models/index.js';
import { AppError } from '../utils/AppError.js';

export const COOKIE_NAME = 'token';

async function resolveAdmin(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  try {
    const { sub } = jwt.verify(token, env.JWT_SECRET);
    return await Admin.findById(sub); // also rejects tokens of deleted admins
  } catch {
    return null;
  }
}

// Attaches req.admin if a valid session exists; never blocks.
export async function optionalAuth(req, _res, next) {
  req.admin = await resolveAdmin(req);
  next();
}

export async function requireAuth(req, _res, next) {
  req.admin = await resolveAdmin(req);
  if (!req.admin) throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
  next();
}