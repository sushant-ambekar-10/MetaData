// Generates the client's offline snapshot from the same seed data (used in Phase 3).
// Usage: npm run export:fallback   (writes ../client/src/data/fallback.json)
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as data from './data.js';

const out = resolve(dirname(fileURLToPath(import.meta.url)), '../../../client/src/data/fallback.json');

const tag = (prefix, arr) =>
  arr.map((item, i) => ({
    id: item.slug ?? `${prefix}-${i}`,
    published: true,
    featured: false,
    images: [],
    ...item,
    order: i,
  }));

const profile = JSON.parse(JSON.stringify(data.profile));
delete profile.links.facebook; // hidden by default
delete profile.dob;

const snapshot = {
  profile,
  stats: tag('stat', data.stats),
  qualifications: tag('qual', data.qualifications),
  achievements: tag('ach', data.achievements),
  certifications: tag('cert', data.certifications),
  skills: tag('skill', data.skills),
  experience: tag('exp', data.experience),
  projects: tag('proj', data.projects),
  testimonials: [],
};

await mkdir(dirname(out), { recursive: true });
await writeFile(out, JSON.stringify(snapshot, null, 2));
console.log(`Wrote ${out}`);