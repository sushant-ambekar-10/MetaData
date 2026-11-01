import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env, isProd } from '../config/env.js';
import { Admin } from '../models/index.js';
import { COOKIE_NAME } from '../middleware/auth.js';
import { AppError } from '../utils/AppError.js';

// Compared against when the email is unknown, so response time doesn't leak which emails exist.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

const cookieOptions = () => ({
  httpOnly: true,
  secure: isProd || env.COOKIE_SAMESITE === 'none',
  sameSite: env.COOKIE_SAMESITE ?? (isProd ? 'none' : 'lax'),
  path: '/',
});

export async function login(req, res) {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select('+passwordHash');
  const ok = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);
  if (!admin || !ok) throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');

  const token = jwt.sign({ sub: admin.id }, env.JWT_SECRET, { expiresIn: `${env.JWT_EXPIRES_DAYS}d` });
  res.cookie(COOKIE_NAME, token, { ...cookieOptions(), maxAge: env.JWT_EXPIRES_DAYS * 86_400_000 });
  res.json({ success: true, data: { id: admin.id, email: admin.email } });
}

export function logout(_req, res) {
  res.clearCookie(COOKIE_NAME, cookieOptions());
  res.json({ success: true, data: { loggedOut: true } });
}

export function me(req, res) {
  res.set('Cache-Control', 'no-store');
  res.json({ success: true, data: { id: req.admin.id, email: req.admin.email } });
}