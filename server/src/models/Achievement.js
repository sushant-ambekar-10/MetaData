import mongoose from 'mongoose';
import { schemaOptions, common } from './_shared.js';

const achievementSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 300 },
    featured: { type: Boolean, default: false },
    ...common,
  },
  schemaOptions
);

export const Achievement = mongoose.model('Achievement', achievementSchema);