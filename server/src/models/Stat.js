import mongoose from 'mongoose';
import { schemaOptions, common } from './_shared.js';

export const STAT_PLATFORMS = ['leetcode', 'hackerrank', 'gfg', 'hackathon', 'academics', 'other'];

// Manually editable numbers for the stats strip and coding-profile cards (never scraped).
const statSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 80 },
    value: { type: Number, required: true, min: 0 },
    suffix: { type: String, default: '', maxlength: 8 },
    decimals: { type: Number, default: 0, min: 0, max: 3 },
    platform: { type: String, enum: STAT_PLATFORMS, default: 'other' },
    url: { type: String, default: '' },
    ...common,
  },
  schemaOptions
);

export const Stat = mongoose.model('Stat', statSchema);