import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Cấu hình Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Hàm upload audio
export const uploadAudio = async (audioPath) => {
  try {
    const result = await cloudinary.v2.uploader.upload(audioPath, {
      resource_type: 'video', // Cloudinary dùng 'video' cho cả audio
      format: 'mp3', // Đảm bảo định dạng đầu ra
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload audio error:', error);
    throw new Error(`Failed to upload audio: ${error.message}`);
  }
};