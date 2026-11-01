import mongoose from 'mongoose';
import { AppError } from '../utils/AppError.js';

const PUBLIC_CACHE = 'public, max-age=30, stale-while-revalidate=120';

export function createCrud({ Model, hasSlug = false, sort = { order: 1, createdAt: -1 } }) {
  const hasField = (p) => Boolean(Model.schema.path(p));

  const list = async (req, res) => {
    const q = req.validQuery ?? {};
    const isAdminView = Boolean(req.admin) && q.all === '1';
    const filter = {};
    if (!isAdminView) filter.published = true;
    if (q.featured && hasField('featured')) filter.featured = q.featured === 'true';
    if (q.category && hasField('category')) filter.category = q.category;

    const docs = await Model.find(filter).sort(sort);
    res.set('Cache-Control', isAdminView ? 'no-store' : PUBLIC_CACHE);
    res.json({ success: true, count: docs.length, data: docs });
  };

  const getOne = async (req, res) => {
    const { id } = req.params;
    let filter;
    if (mongoose.isValidObjectId(id)) filter = { _id: id };
    else if (hasSlug) filter = { slug: id.toLowerCase() };
    else throw new AppError(404, 'NOT_FOUND', 'Not found');
    if (!req.admin) filter.published = true;

    const doc = await Model.findOne(filter);
    if (!doc) throw new AppError(404, 'NOT_FOUND', 'Not found');
    res.set('Cache-Control', req.admin ? 'no-store' : PUBLIC_CACHE);
    res.json({ success: true, data: doc });
  };

  const create = async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ success: true, data: doc });
  };

  const update = async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!doc) throw new AppError(404, 'NOT_FOUND', 'Not found');
    res.json({ success: true, data: doc });
  };

  const remove = async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) throw new AppError(404, 'NOT_FOUND', 'Not found');
    res.json({ success: true, data: { id: req.params.id, deleted: true } });
  };

  // Body: { ids: [...] } in the desired order; writes order = index.
  const reorder = async (req, res) => {
    const ops = req.body.ids.map((id, i) => ({ updateOne: { filter: { _id: id }, update: { $set: { order: i } } } }));
    await Model.bulkWrite(ops);
    res.json({ success: true, data: { reordered: ops.length } });
  };

  return { list, getOne, create, update, remove, reorder };
}