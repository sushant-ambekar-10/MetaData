import { Profile } from '../models/index.js';
import { AppError } from '../utils/AppError.js';

// Strip fields the admin has chosen to hide.
function toPublic(doc) {
  const p = doc.toJSON();
  if (!p.showFacebook && p.links) delete p.links.facebook;
  if (!p.showDob) delete p.dob;
  return p;
}

export async function getProfile(req, res) {
  const doc = await Profile.findOne();
  if (!doc) throw new AppError(404, 'NOT_FOUND', 'Profile not set up yet. Run `npm run seed`.');
  const isAdminView = Boolean(req.admin) && req.validQuery?.all === '1';
  res.set('Cache-Control', isAdminView ? 'no-store' : 'public, max-age=30, stale-while-revalidate=120');
  res.json({ success: true, data: isAdminView ? doc.toJSON() : toPublic(doc) });
}

export async function upsertProfile(req, res) {
  const doc = await Profile.findOneAndUpdate({}, { $set: req.body }, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });
  res.json({ success: true, data: doc });
}