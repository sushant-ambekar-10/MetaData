import mongoose from 'mongoose';
import { schemaOptions } from './_shared.js';

// Singleton document (one profile per site).
const profileSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    tagline: { type: String, default: '', maxlength: 160 },
    githubBio: { type: String, default: '', maxlength: 200 },
    bio: { type: String, default: '', maxlength: 1500 },
    roles: { type: [String], default: [] }, // hero word-morph list
    emails: { type: [String], default: [] },
    links: {
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
    },
    showFacebook: { type: Boolean, default: false },
    showDob: { type: Boolean, default: false },
    dob: { type: String, default: '' }, // YYYY-MM-DD
    resumeUrl: { type: String, default: '/resume.pdf' },
  },
  schemaOptions
);

export const Profile = mongoose.model('Profile', profileSchema);