import { Message } from '../models/index.js';
import { AppError } from '../utils/AppError.js';

export async function listMessages(_req, res) {
  const docs = await Message.find().sort({ createdAt: -1 }).limit(200);
  res.set('Cache-Control', 'no-store');
  res.json({ success: true, count: docs.length, data: docs });
}

export async function markRead(req, res) {
  const doc = await Message.findByIdAndUpdate(req.params.id, { $set: { read: true } }, { new: true });
  if (!doc) throw new AppError(404, 'NOT_FOUND', 'Not found');
  res.json({ success: true, data: doc });
}

export async function deleteMessage(req, res) {
  const doc = await Message.findByIdAndDelete(req.params.id);
  if (!doc) throw new AppError(404, 'NOT_FOUND', 'Not found');
  res.json({ success: true, data: { id: req.params.id, deleted: true } });
}