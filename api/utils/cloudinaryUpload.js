// utils/cloudinaryUploader.js
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

/**
 * Uploads a buffer to Cloudinary.
 * @param {Buffer} buffer - The file buffer to upload.
 * @param {Object} options - Additional Cloudinary options (e.g., resource_type).
 * @returns {Promise<Object>} Cloudinary upload result.
 */
export const uploadBufferToCloudinary = (buffer, options = { resource_type: 'raw' }) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    uploadStream.end(buffer);
  });
};
