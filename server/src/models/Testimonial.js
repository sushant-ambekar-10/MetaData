import mongoose from 'mongoose';
import { schemaOptions, common } from './_shared.js';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    role: { type: String, default: '', trim: true, maxlength: 140 },
    text: { type: String, required: true, trim: true, maxlength: 1200 },
    avatar: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    ...common,
  },
  schemaOptions
);

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);