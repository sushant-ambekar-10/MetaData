import mongoose from 'mongoose';
import { schemaOptions } from './_shared.js';

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    read: { type: Boolean, default: false },
  },
  schemaOptions
);

export const Message = mongoose.model('Message', messageSchema);