import mongoose from 'mongoose';
import { schemaOptions, common } from './_shared.js';

export const SKILL_CATEGORIES = ['Languages', 'Web', 'Backend/DB', 'Mobile', 'DevOps/Cloud'];

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    category: { type: String, enum: SKILL_CATEGORIES, required: true },
    featured: { type: Boolean, default: false },
    level: { type: Number, min: 0, max: 100, default: 0 }, // 0 = not displayed
    ...common,
  },
  schemaOptions
);

export const Skill = mongoose.model('Skill', skillSchema);