import mongoose from 'mongoose';
import { schemaOptions, common } from './_shared.js';

const certificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    issuer: { type: String, default: '', trim: true, maxlength: 120 },
    url: { type: String, default: '' },
    date: { type: String, default: '', maxlength: 40 }, // free text, e.g. "2024" or "Aug 2024"
    featured: { type: Boolean, default: false },
    ...common,
  },
  schemaOptions
);

export const Certification = mongoose.model('Certification', certificationSchema);