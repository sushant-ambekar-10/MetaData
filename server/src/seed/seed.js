import bcrypt from 'bcrypt';
import { env } from '../config/env.js';
import { connectDB, disconnectDB } from '../config/db.js';
import {
  Project, Skill, Certification, Achievement, Experience, Qualification, Profile, Testimonial, Stat, Admin,
} from '../models/index.js';
import * as data from './data.js';

const force = process.argv.includes('--force');

if (env.NODE_ENV === 'production' && !force) {
  console.error('Refusing to seed in production without --force (this REPLACES all content).');
  process.exit(1);
}
if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD (min 12 chars) in .env before seeding.');
  process.exit(1);
}

const withOrder = (arr) => arr.map((item, i) => ({ ...item, order: i }));

await connectDB();

// Replace content (contact messages are kept)
const collections = [
  [Project, data.projects], [Skill, data.skills], [Certification, data.certifications],
  [Achievement, data.achievements], [Experience, data.experience], [Qualification, data.qualifications],
  [Testimonial, data.testimonials], [Stat, data.stats],
];
for (const [Model, items] of collections) {
  await Model.deleteMany({});
  if (items.length) await Model.insertMany(withOrder(items));
  console.log(`${Model.modelName}: ${items.length}`);
}

await Profile.deleteMany({});
await Profile.create(data.profile);
console.log('Profile: 1');

// Single admin user
const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
await Admin.deleteMany({ email: { $ne: env.ADMIN_EMAIL.toLowerCase() } });
await Admin.findOneAndUpdate(
  { email: env.ADMIN_EMAIL.toLowerCase() },
  { $set: { passwordHash } },
  { upsert: true, setDefaultsOnInsert: true }
);
console.log(`Admin: ${env.ADMIN_EMAIL}`);

await disconnectDB();
console.log('Seed complete.');