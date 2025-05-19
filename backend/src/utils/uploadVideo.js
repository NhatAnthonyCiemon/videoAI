import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Cấu hình Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Hàm upload video
export const uploadVideo = async (videoPath) => {
  try {
    const result = await cloudinary.v2.uploader.upload(videoPath, {
      resource_type: 'video', // Phải chỉ rõ là video
    });
    return result.secure_url; 
  } catch (error) {
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};
