import mongoose from 'mongoose';
import { schemaOptions } from './_shared.js';

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
  },
  {
    ...schemaOptions,
    toJSON: {
      ...schemaOptions.toJSON,
      transform: (_d, ret) => {
        delete ret._id;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

export const Admin = mongoose.model('Admin', adminSchema);