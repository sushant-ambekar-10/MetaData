import mongoose from 'mongoose';
import { schemaOptions, common } from './_shared.js';

const qualificationSchema = new mongoose.Schema(
  {
    level: { type: String, required: true, trim: true, maxlength: 160 },
    institution: { type: String, required: true, trim: true, maxlength: 200 },
    score: { type: String, default: '', maxlength: 60 }, // "CGPA 8.82", "88%"
    semesters: {
      type: [
        new mongoose.Schema(
          {
            sem: { type: Number, required: true, min: 1, max: 12 },
            sgpa: { type: Number, required: true, min: 0, max: 10 },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
    year: { type: String, default: '', maxlength: 40 },
    ...common,
  },
  schemaOptions
);

export const Qualification = mongoose.model('Qualification', qualificationSchema);