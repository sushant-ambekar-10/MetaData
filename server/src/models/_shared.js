// Shared schema options: timestamps, `id` virtual, no __v / _id in JSON output.
export const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      delete ret._id;
      return ret;
    },
  },
};

// Fields shared by every admin-managed collection (real Booleans, never strings)
export const common = {
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
};