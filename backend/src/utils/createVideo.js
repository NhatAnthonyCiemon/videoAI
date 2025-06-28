import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import sizeOf from "image-size";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config(); // Nạp biến môi trường từ file .env

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const isRender = process.env.ENV === "render"; // Kiểm tra xem có phải chạy trên Render không

//Danh sách animation
const animations = [
  {
    name: "Fade",
    description: "Hiệu ứng mờ dần vào đầu và ra cuối video",
    outputOptions: (duration, fps) => [
      "-vf",
      `fade=t=in:st=0:d=1,fade=t=out:st=${duration - 1}:d=1`,
      "-t", `${duration}`,
      "-pix_fmt", "yuv420p",
      "-crf", "24",
      "-r", `${fps}`,
    ],
  },
  {
    name: "Rotate",
    description: "Hiệu ứng quay tròn 1 vòng trong khoảng thời gian duration",
    outputOptions: (duration, fps) => [
      "-vf",
      `rotate='2*PI*t/${duration}'`,
      "-t", `${duration}`,
      "-pix_fmt", "yuv420p",
      "-crf 24",
      "-r", `${fps}`,
    ],
  },
  { 
    name:"FateRotate",
    description: "Kết hợp hiệu ứng quay và fade in/out",
    outputOptions: (duration, fps) => [
      "-vf",
      `rotate='2*PI*t/${duration}',fade=t=in:st=0:d=1,fade=t=out:st=${duration - 1}:d=1`,
      "-t", `${duration}`,
      "-pix_fmt", "yuv420p",
      "-crf", "24",
      "-r", `${fps}`,
    ],
  },

  {
    name: "ZoomPan",
    description: "Hiệu ứng phóng to dần với zoompan",
    outputOptions: (duration, fps, sValue = "1280x720") => {
      const dFrames = Math.ceil(duration * fps);
      return [
        "-vf",
        `zoompan=z='min(zoom+0.0005,1.5)':d=${dFrames}:s=${sValue}:fps=${fps}`,
        "-t", `${duration}`,
        "-pix_fmt", "yuv420p",
        "-crf", "24",
        "-r", `${fps}`,
      ];
    },
  },

  // Bạn có thể thêm nhiều animation khác ở đây
];


// Bỏ text trong video
async function createVideoSegments(images,id_anims, durations) {
  
  const promises = images.map((image, index) => {
    const duration = durations[index];
    console.log('thoi luong video',duration)
    const id_anim = id_anims[index]
    const outputOption = animations[id_anim].outputOptions(duration,30)
    console.log("output:", outputOption)
    const output = `clip_${index}.mp4`;
    const { width, height } = { width: 1024, height: 768 };
    const sValue = `${width}x${height}`;
    let fps = 60;
    if (isRender) {
      fps = 30;
    }
    const dFrames = Math.ceil(duration * fps);

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(image)
        .loop(duration)
        .videoCodec("libx264")
        .outputOptions(
          outputOption)
        .noAudio()
        .save(output)
        .on("end", () => resolve(output))
        .on("error", (err) => {
          console.error("❌ Lỗi khi tạo clip:", err);
          reject(err);
        });
    });
  });

  return Promise.all(promises);
}

async function concatVideoSegments(videoPaths) {
  const listFile = "video_list.txt";
  const content = videoPaths
    .map((file) => `file '${path.resolve(file)}'`)
    .join("\n");
  fs.writeFileSync(listFile, content);

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(listFile)
      .inputOptions(["-f", "concat", "-safe", "0"])
      .videoCodec("libx264")
      .output("temp_video.mp4")
      .on("end", () => resolve("temp_video.mp4"))
      .on("error", (err) => {
        console.error("❌ Lỗi khi nối video:", err);
        reject(err);
      })
      .run();
  });
}

async function mergeWithAudio(
  videoPath,
  audioPath,
  outputPath = "final_output.mp4"
) {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .outputOptions([
        "-c:v libx264",
        "-preset veryfast",
        "-crf 28",
        "-c:a aac",
        "-b:a 128k",
        "-shortest",
      ])
      .save(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", (err) => {
        console.error("❌ Lỗi khi ghép video với âm thanh:", err);
        reject(err);
      });
  });
}

async function createFullVideo(
  images,
  id_anims,
  durations = 7,
  audioPath,
  outputPath = "final_output.mp4"
) {
  try {
    if (isRender) {
      console.log("🔹 Đang tạo video từng clip một... (Render)");
      // const clips = [];
      // for (let i = 0; i < images.length; i++) {
      //     const clip = await createVideoSegments(
      //         [images[i]],
      //         [durations[i]]
      //     );
      //     clips.push(clip[0]);
      //     console.log(`Clip ${i} đã hoàn thành`);
      // }

      // console.log("🔹 Đang nối các clip lại... (Render)");
      // const mergedVideo = await concatVideoSegments(clips);

      // console.log("🔹 Đang ghép với âm thanh... (Render)");
      // const finalOutput = await mergeWithAudio(
      //     mergedVideo,
      //     audioPath,
      //     outputPath
      // );

      // console.log("✅ Video đã hoàn thành:", finalOutput);
      // clips.forEach((file) => fs.unlinkSync(file));
      // fs.unlinkSync(mergedVideo);
      // fs.unlinkSync("video_list.txt");

      // return finalOutput;
    } else {
      // Chạy song song ở local
      console.log("🔹 Đang tạo từng clip từ ảnh... (Local)");
      const clips = await createVideoSegments(images,id_anims, durations);
      console.log("🔹 Đang nối các clip lại...");
      const mergedVideo = await concatVideoSegments(clips);

      console.log("🔹 Đang ghép với âm thanh...");
      const finalOutput = await mergeWithAudio(
        mergedVideo,
        audioPath,
        outputPath
      );

      clips.forEach((file) => fs.unlinkSync(file));
      fs.unlinkSync(mergedVideo);
      fs.unlinkSync("video_list.txt");

      // Xóa file âm thanh sau khi merge
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
        console.log(`✅ Đã xóa file âm thanh: ${audioPath}`);
      }

      return finalOutput;
    }
  } catch (err) {
    console.error("❌ Lỗi tạo video:", err);
    throw err;
  }
}

export {
  createFullVideo,
  createVideoSegments,
  concatVideoSegments,
  mergeWithAudio,
};
