const mongoose = require('mongoose');

const stickerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
      required: true,
    },
  },
  { timestamps: true }
);

stickerSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Sticker', stickerSchema);
