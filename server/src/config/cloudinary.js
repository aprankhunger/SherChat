const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sherchat-stickers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    format: 'webp', // Convert all to webp for smaller size
    transformation: [
      { background: 'transparent' }, // Keep transparency
      { effect: 'background_removal' }, // Auto remove background
      { width: 256, height: 256, crop: 'limit' }, // Resize to max 256x256
      { effect: 'trim' }, // Trim empty space around sticker
      { quality: 'auto:low' }, // Aggressive compression
      { fetch_format: 'auto' }, // Serve best format for browser
    ],
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max
  },
});

module.exports = { cloudinary, upload };
