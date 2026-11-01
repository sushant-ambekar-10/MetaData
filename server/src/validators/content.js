import { z } from 'zod';

// ---------- primitives ----------
const str = (max = 200) => z.string().trim().max(max);
const required = (max = 200) => z.string().trim().min(1, 'Required').max(max);
// http(s) only. Blocks javascript:, data: etc.
const httpUrl = z
  .string()
  .trim()
  .max(500)
  .regex(/^https?:\/\/[^\s]+$/i, 'Must be an http(s) URL')
  .or(z.literal(''));
const imageUrl = z
  .string()
  .trim()
  .max(500)
  .regex(/^(https?:\/\/[^\s]+|\/uploads\/[^\s]+)$/i, 'Must be an http(s) URL or /uploads path');
const dateReq = z.coerce.date();
const dateOpt = z.preprocess((v) => (v === '' || v == null ? null : v), z.coerce.date().nullable());
const slug = z
  .string()
  .trim()
  .toLowerCase()
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Lowercase letters, numbers and hyphens only');
const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

// ---------- shared ----------
const common = { published: z.boolean().optional(), order: z.number().int().min(0).optional() };

// ---------- resources ----------
export const projectSchema = z.object({
  name: required(120),
  slug: slug.optional(),
  description: required(600),
  longDescription: str(5000).optional(),
  problem: str(2000).optional(),
  solution: str(2000).optional(),
  duration: str(60).optional(),
  startDate: dateOpt.optional(),
  endDate: dateOpt.optional(),
  category: z.enum(['Web', 'Android', 'ML/AI', 'Other']).optional(),
  skills: z.array(required(50)).max(30).optional(),
  github: httpUrl.optional(),
  liveUrl: httpUrl.optional(),
  images: z.array(imageUrl).max(20).optional(),
  featured: z.boolean().optional(),
  ...common,
});

export const skillSchema = z.object({
  name: required(80),
  category: z.enum(['Languages', 'Web', 'Backend/DB', 'Mobile', 'DevOps/Cloud']),
  featured: z.boolean().optional(),
  level: z.number().min(0).max(100).optional(),
  ...common,
});

export const certificationSchema = z.object({
  title: required(160),
  issuer: str(120).optional(),
  url: httpUrl.optional(),
  date: str(40).optional(),
  featured: z.boolean().optional(),
  ...common,
});

export const achievementSchema = z.object({
  text: required(300),
  featured: z.boolean().optional(),
  ...common,
});

export const experienceSchema = z.object({
  role: required(120),
  org: required(160),
  type: z.enum(['internship', 'work', 'leadership']).optional(),
  start: dateReq,
  end: dateOpt.optional(),
  current: z.boolean().optional(),
  description: str(2000).optional(),
  highlights: z.array(required(400)).max(20).optional(),
  featured: z.boolean().optional(),
  ...common,
});

export const qualificationSchema = z.object({
  level: required(160),
  institution: required(200),
  score: str(60).optional(),
  semesters: z
    .array(z.object({ sem: z.number().int().min(1).max(12), sgpa: z.number().min(0).max(10) }))
    .max(12)
    .optional(),
  year: str(40).optional(),
  ...common,
});

export const testimonialSchema = z.object({
  name: required(100),
  role: str(140).optional(),
  text: required(1200),
  avatar: imageUrl.or(z.literal('')).optional(),
  featured: z.boolean().optional(),
  ...common,
});

export const statSchema = z.object({
  label: required(80),
  value: z.number().min(0),
  suffix: str(8).optional(),
  decimals: z.number().int().min(0).max(3).optional(),
  platform: z.enum(['leetcode', 'hackerrank', 'gfg', 'hackathon', 'academics', 'other']).optional(),
  url: httpUrl.optional(),
  ...common,
});

export const profileSchema = z.object({
  fullName: required(120),
  tagline: str(160).optional(),
  githubBio: str(200).optional(),
  bio: str(1500).optional(),
  roles: z.array(required(60)).max(10).optional(),
  emails: z.array(z.string().trim().email().max(160)).max(5).optional(),
  links: z
    .object({
      linkedin: httpUrl.optional(),
      github: httpUrl.optional(),
      instagram: httpUrl.optional(),
      facebook: httpUrl.optional(),
    })
    .optional(),
  showFacebook: z.boolean().optional(),
  showDob: z.boolean().optional(),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal('')).optional(),
  resumeUrl: z.string().trim().max(300).regex(/^(https?:\/\/|\/)[^\s]*$/).optional(),
});

// ---------- helpers ----------
export const reorderSchema = z.object({ ids: z.array(objectId).min(1).max(200) });

export const listQuerySchema = z.object({
  all: z.enum(['1']).optional(), // admin only (ignored without a valid session)
  featured: z.enum(['true', 'false']).optional(),
  category: z.string().trim().max(40).optional(),
});

export const profileQuerySchema = z.object({ all: z.enum(['1']).optional() });