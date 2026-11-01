import { Router } from 'express';
import {
  Project, Skill, Certification, Achievement, Experience, Qualification, Testimonial, Stat,
} from '../models/index.js';
import * as v from '../validators/content.js';
import { loginSchema } from '../validators/auth.js';
import { contactSchema } from '../validators/contact.js';
import { validate } from '../middleware/validate.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { authLimiter, contactLimiter } from '../middleware/rateLimit.js';
import { crudRouter } from './crud.routes.js';
import * as auth from '../controllers/auth.controller.js';
import { submitContact } from '../controllers/contact.controller.js';
import { getProfile, upsertProfile } from '../controllers/profile.controller.js';
import { listMessages, markRead, deleteMessage } from '../controllers/message.controller.js';
import { github } from '../controllers/github.controller.js';

const router = Router();

// ---- auth ----
router.post('/auth/login', authLimiter, validate({ body: loginSchema }), auth.login);
router.post('/auth/logout', auth.logout);
router.get('/auth/me', requireAuth, auth.me);

// ---- contact (public, rate-limited) ----
router.post('/contact', contactLimiter, validate({ body: contactSchema }), submitContact);

// ---- profile (singleton) ----
router.get('/profile', optionalAuth, validate({ query: v.profileQuerySchema }), getProfile);
router.put('/profile', requireAuth, validate({ body: v.profileSchema }), upsertProfile);

// ---- messages (admin only) ----
router.get('/messages', requireAuth, listMessages);
router.put('/messages/:id/read', requireAuth, markRead);
router.delete('/messages/:id', requireAuth, deleteMessage);

// ---- github (cached 1h) ----
router.get('/github', github);

// ---- content collections ----
router.use('/projects', crudRouter({ Model: Project, schema: v.projectSchema, hasSlug: true, sort: { order: 1, startDate: -1 } }));
router.use('/skills', crudRouter({ Model: Skill, schema: v.skillSchema, sort: { order: 1, createdAt: 1 } }));
router.use('/certifications', crudRouter({ Model: Certification, schema: v.certificationSchema, sort: { order: 1, createdAt: 1 } }));
router.use('/achievements', crudRouter({ Model: Achievement, schema: v.achievementSchema, sort: { order: 1, createdAt: 1 } }));
router.use('/experience', crudRouter({ Model: Experience, schema: v.experienceSchema, sort: { order: 1, start: -1 } }));
router.use('/qualifications', crudRouter({ Model: Qualification, schema: v.qualificationSchema, sort: { order: 1, createdAt: 1 } }));
router.use('/testimonials', crudRouter({ Model: Testimonial, schema: v.testimonialSchema, sort: { order: 1, createdAt: -1 } }));
router.use('/stats', crudRouter({ Model: Stat, schema: v.statSchema, sort: { order: 1, createdAt: 1 } }));

export default router;