import mongoose from 'mongoose';
import { schemaOptions, common } from './_shared.js';
import { slugify } from '../utils/slugify.js';

export const PROJECT_CATEGORIES = ['Web', 'Android', 'ML/AI', 'Other'];

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, unique: true, index: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 600 },
    longDescription: { type: String, default: '', maxlength: 5000 },
    problem: { type: String, default: '', maxlength: 2000 },
    solution: { type: String, default: '', maxlength: 2000 },
    duration: { type: String, default: '', trim: true, maxlength: 60 }, // display string, e.g. "Jan 2025 - Present"
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null }, // null = ongoing
    category: { type: String, enum: PROJECT_CATEGORIES, default: 'Other' },
    skills: { type: [String], default: [] },
    github: { type: String, default: '' },
    liveUrl: { type: String, default: '' }, // empty = no live link (UI hides the Live button)
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    ...common,
  },
  schemaOptions
);

projectSchema.pre('validate', async function () {
  if (!this.slug && this.name) this.slug = slugify(this.name);
});

export const Project = mongoose.model('Project', projectSchema);