const mongoose = require('mongoose');

const stickerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null for default stickers available to all
    },
    name: {
      type: String,
      default: 'Custom Sticker',
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      default: '', // Empty for default stickers (external URLs)
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

stickerSchema.index({ user: 1, createdAt: -1 });
stickerSchema.index({ isDefault: 1 });

module.exports = mongoose.model('Sticker', stickerSchema);
