const path = require('path');
const fs = require('fs/promises');
const cloudinary = require('cloudinary').v2;

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadProvider = process.env.UPLOAD_PROVIDER || 'local';

const uploadImage = async (file) => {
  if (!file) {
    return null;
  }

  if (uploadProvider === 'cloudinary') {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'coffee-shop',
      resource_type: 'image',
    });
    await fs.unlink(file.path);
    return result.secure_url;
  }

  const relativePath = `/uploads/${path.basename(file.path)}`;
  return relativePath;
};

module.exports = {
  uploadImage,
};

