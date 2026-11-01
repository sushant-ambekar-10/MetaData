import mongoose from 'mongoose';
import { schemaOptions, common } from './_shared.js';

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true, maxlength: 120 },
    org: { type: String, required: true, trim: true, maxlength: 160 },
    type: { type: String, enum: ['internship', 'work', 'leadership'], default: 'work' },
    start: { type: Date, required: true },
    end: { type: Date, default: null },
    current: { type: Boolean, default: false },
    description: { type: String, default: '', maxlength: 2000 },
    highlights: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    ...common,
  },
  schemaOptions
);

export const Experience = mongoose.model('Experience', experienceSchema);