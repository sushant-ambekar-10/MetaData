import 'dotenv/config';
import { z } from 'zod';

const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().positive().default(5000),
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    JWT_EXPIRES_DAYS: z.coerce.number().int().min(1).max(90).default(7),
    COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']).optional(),

    CLIENT_ORIGINS: z.string().default('http://localhost:5173'),

    ADMIN_EMAIL: z.string().email().optional(),
    ADMIN_PASSWORD: z.string().min(12, 'ADMIN_PASSWORD must be at least 12 characters').optional(),

    MAIL_PROVIDER: z.enum(['console', 'smtp', 'resend']).default('console'),
    MAIL_FROM: z.string().default('Portfolio <no-reply@example.com>'),
    CONTACT_TO: z.string().email().default('sushantsambekar@gmail.com'),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().int().default(587),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),

    GITHUB_USERNAME: z.string().default('sushant-ambekar-10'),
    GITHUB_TOKEN: z.string().optional(),

    UPLOAD_PROVIDER: z.enum(['local', 'cloudinary']).default('local'),
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    const need = (cond, path, message) => cond || ctx.addIssue({ code: 'custom', path: [path], message });
    if (v.MAIL_PROVIDER === 'smtp') {
      need(v.SMTP_HOST, 'SMTP_HOST', 'Required when MAIL_PROVIDER=smtp');
      need(v.SMTP_USER, 'SMTP_USER', 'Required when MAIL_PROVIDER=smtp');
      need(v.SMTP_PASS, 'SMTP_PASS', 'Required when MAIL_PROVIDER=smtp');
    }
    if (v.MAIL_PROVIDER === 'resend') need(v.RESEND_API_KEY, 'RESEND_API_KEY', 'Required when MAIL_PROVIDER=resend');
    if (v.UPLOAD_PROVIDER === 'cloudinary') {
      need(v.CLOUDINARY_CLOUD_NAME, 'CLOUDINARY_CLOUD_NAME', 'Required for cloudinary');
      need(v.CLOUDINARY_API_KEY, 'CLOUDINARY_API_KEY', 'Required for cloudinary');
      need(v.CLOUDINARY_API_SECRET, 'CLOUDINARY_API_SECRET', 'Required for cloudinary');
    }
  });

// Treat empty strings in .env (e.g. "SMTP_HOST=") as "not set"
const raw = Object.fromEntries(Object.entries(process.env).filter(([, v]) => v !== ''));
const parsed = schema.safeParse(raw);

if (!parsed.success) {
  console.error('Invalid environment configuration:');
  for (const issue of parsed.error.issues) console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
export const allowedOrigins = env.CLIENT_ORIGINS.split(',')
  .map((s) => s.trim().replace(/\/$/, ''))
  .filter(Boolean);