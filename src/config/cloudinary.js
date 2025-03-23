import { v2 as cloudinary } from 'cloudinary';

import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary
const setupCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

// Upload file to Cloudinary
const uploadToCloudinary = async (filePath, folder) => {
  try {
    setupCloudinary();
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
    });
    return result;
  } catch (error) {
    console.error(`Error uploading to Cloudinary: ${error.message}`);
    throw error;
  }
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    setupCloudinary();
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(`Error deleting from Cloudinary: ${error.message}`);
    throw error;
  }
};

export { uploadToCloudinary, deleteFromCloudinary }; 