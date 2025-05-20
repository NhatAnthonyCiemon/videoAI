import { url } from "inspector";
import { createFullVideo } from "../../../utils/createVideo.js";
import { processTextToSpeech } from "../../../utils/createVoice.js";
import { getDurations } from "../../../utils/duration.js";
import { mergeMp3Files } from "../../../utils/mergeVoice.js";
import { uploadVideo } from "../../../utils/uploadVideo.js";
import ffmpeg from "fluent-ffmpeg";
import axios from "axios";
import path from "path";
import fs from "fs";

const handleVideoController = async (req, res) => {
  try {
    // Lấy danh sách URL ảnh và scripts từ body
    const images = req.body.images || []; // Mảng URL ảnh
    const scripts = req.body.scripts || ["xin chào tôi là Minh","á đù vip quá bro"]; // Mảng scripts tương ứng
    const voice = req.body.voice || "vi-VN-HoaiMyNeural (vi-VN, Female)"; // Giọng nói mặc định
    const rate = req.body.rate || 0; // Tốc độ đọc mặc định
    const pitch = req.body.pitch || 0; // Cao độ mặc định
    const num_lines = req.body.num_lines || 1; // Số dòng mặc định

    console.log("📦 Số ảnh:", images);
    console.log("📝 Scripts:", scripts);
    console.log("📝 Scripts:", voice);
    console.log("📝 Scripts:", rate);
    console.log("📝 Scripts:", pitch);

    // Xử lý từng đoạn script để tạo file âm thanh
    const audioUrls = [];
    for (let i = 0; i < scripts.length; i++) {
      const audioUrl = await processTextToSpeech({
        text: scripts[i],
        voice, // Thay bằng giọng nói bạn muốn sử dụng
        rate, // Tốc độ đọc
        pitch, // Cao độ
        num_lines // Số dòng
      });
      audioUrls.push(audioUrl);
    }

    console.log("🔊 Danh sách URL âm thanh:", audioUrls);

    const durations = await getDurations(audioUrls);
    console.log("⏱️ Thời gian các file âm thanh:", durations);

    console.log("🔊 Bắt đầu merge:");
    const mergedAudio = await mergeMp3Files(audioUrls);
    console.log("🔊 Merge xong:",mergedAudio);
    

  
    // // Tiếp tục xử lý logic tạo video với audioUrls và images
    const finalVideo = await createFullVideo(images, durations, mergedAudio);
    
    const urlVideo = await uploadVideo(finalVideo);
    console.log("✅ URL video :", urlVideo);
    res.status(200).json({ url: urlVideo });
    // Xóa file video sau khi upload
    if (fs.existsSync(finalVideo)) {
      fs.unlinkSync(finalVideo);
      console.log(`✅ Đã xóa file video : ${finalVideo}`);
    }

    // Gửi URL video về client
   
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Lỗi server: " + err.message });
  }
};

export default handleVideoController;
