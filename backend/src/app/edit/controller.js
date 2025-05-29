import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import Edit from './service.js';
import { fileURLToPath } from 'url';
import { overlayVideo } from '../../utils/ffmeg.js';
import { createResponse, createErrorResponse } from '../../utils/responseAPI.js';
import { uploadVideo } from "../../utils/uploadVideo.js";
import { uploadAudio } from "../../utils/uploadAudio.js";
import prisma from "../../config/database/db.config.js";
import ffmpeg from 'fluent-ffmpeg';
// import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, 'outputs');

// Hàm xóa file với retry
const deleteFileWithRetry = async (filePath, retries = 5, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            await fs.unlink(filePath);
            console.log(`Deleted file: ${filePath}`);
            return;
        } catch (err) {
            if (err.code === 'EBUSY' && i < retries - 1) {
                console.log(`File ${filePath} is busy, retrying in ${delay}ms... (${i + 1}/${retries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error(`Failed to delete file ${filePath}: ${err.message}`);
                throw err;
            }
        }
    }
};

// Hàm xóa thư mục với retry
const deleteDirectoryWithRetry = async (dirPath, retries = 5, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            if (await fs.pathExists(dirPath)) {
                await fs.remove(dirPath);
                console.log(`Deleted directory: ${dirPath}`);
            } else {
                console.log(`Directory ${dirPath} does not exist, skipping deletion`);
            }
            return;
        } catch (err) {
            if (err.code === 'EBUSY' && i < retries - 1) {
                console.log(`Directory ${dirPath} is busy, retrying in ${delay}ms... (${i + 1}/${retries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else if (err.code === 'ENOENT') {
                console.log(`Directory ${dirPath} does not exist, skipping deletion`);
                return;
            } else {
                console.error(`Failed to delete directory ${dirPath}: ${err.message}`);
                throw err;
            }
        }
    }
};

async function convertAudioToMp3(inputPath, outputPath) {
    if (!await fs.pathExists(inputPath)) {
        throw new Error(`Input file does not exist: ${inputPath}`);
    }
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .audioCodec('libmp3lame')
            .audioBitrate('128k')
            .on('end', () => {
                console.log(`Converted audio to ${outputPath}`);
                resolve(outputPath);
            })
            .on('error', (err) => reject(new Error(`FFmpeg conversion error: ${err.message}`)))
            .save(outputPath);
    });
}


const editController = {
    getData: async (req, res) => {
        try {
            const { video_id } = req.params;
            const data = await Edit.getVideoDataEditById(video_id);

            return res.json({
                mes: "success",
                data,
            });
        } catch (err) {
            console.error("GetData error:", err);
            return res.status(500).json({
                mes: "fail",
                message: err.message,
            });
        }
    },
    save_url_edit: async (req, res) => {
        try {
            const {
                video_id,
                url_edit
            } = req.body;

            if (!video_id && !url_edit) {
                throw new Error("Missing video_id");
            }

            await Edit.saveEditUrl(video_id, url_edit);


            res.json(createResponse(200, "Data saved successfully"));
        } catch (err) {
            console.error("Save error:", err);
            res.status(500).json(createErrorResponse(500, `Save failed: ${err.message}`));
        }
    },
    save: async (req, res) => {
        await fs.ensureDir(outputDir);
        try {
            const {
                video_id,
                script_input,
                sticker_files = [],
                sticker_config,
                audio_files = [],
                audio_config,
            } = req.body;

            if (!video_id) {
                throw new Error("Missing video_id");
            }

            // Xóa dữ liệu cũ
            await prisma.subtitles.deleteMany({ where: { video_id } });
            await prisma.music.deleteMany({ where: { video_id } });
            await prisma.ticker.deleteMany({ where: { video_id } });

            const downloadFile = async (url, fileName, type = "temp") => {
                const ext = type === "image" ? "png" : "mp3";
                const filePath = path.join(outputDir, `temp_${Date.now()}_${fileName}.${ext}`);
                const response = await axios.get(url, { responseType: "arraybuffer", timeout: 30000 });
                await fs.writeFile(filePath, response.data);
                return filePath;
            };

            const scripts = typeof script_input === "string" ? JSON.parse(script_input) : script_input || [];
            const stickers = typeof sticker_config === "string" ? JSON.parse(sticker_config) : sticker_config || [];
            const audioConfigs = typeof audio_config === "string" ? JSON.parse(audio_config) : audio_config || [];

            if (stickers.length !== sticker_files.length) {
                throw new Error("Sticker file and config mismatch");
            }
            if (audioConfigs.length !== audio_files.length) {
                throw new Error("Audio file and config mismatch");
            }

            // Tải sticker
            for (let i = 0; i < stickers.length; i++) {
                stickers[i].file_path = await downloadFile(sticker_files[i], `sticker-${i}`, "image");
            }

            // Tải và xử lý audio
            for (let i = 0; i < audioConfigs.length; i++) {
                const tempPath = await downloadFile(audio_files[i], `audio-${i}`, "audio");
                const convertedPath = path.join(outputDir, `converted_audio_${i}_${Date.now()}.mp3`);
                await convertAudioToMp3(tempPath, convertedPath);
                audioConfigs[i].file_path = convertedPath;
                await deleteFileWithRetry(tempPath); // Xóa file tạm
            }

            // Lưu subtitles
            for (const sub of scripts) {
                await prisma.subtitles.create({
                    data: {
                        videos: { connect: { id: video_id } },
                        start_time: new Date(sub.start * 1000),
                        end_time: new Date(sub.end * 1000),
                        content: sub.text,
                        align: sub.style.alignment,
                        position: sub.style.position ?? "bottom",
                        font: sub.style.fontStyle?.join(" ") || "",
                        font_style: sub.style.fontStyle?.join(" ") || "",
                        font_size: sub.style.fontSize?.toString() ?? "24",
                        color: sub.style.fontColor ?? "#FFFFFF@1.0",
                        background_color: sub.style.backgroundColor ?? "#000000@0.5",
                        effect: JSON.stringify({
                            shadow: sub.style.shadow ?? null,
                            outline: sub.style.outline ?? null,
                        }),
                        status: sub.status,
                    },
                });
            }

            // Lưu musics
            for (const music of audioConfigs) {

                await prisma.music.create({
                    data: {
                        videos: { connect: { id: video_id } },
                        start_time: new Date(music.start * 1000),
                        end_time: new Date(music.end * 1000),
                        volume: music.volume,
                        music_system: { connect: { id: music.id } },
                        status: music.status,
                    },
                });
            }

            // Lưu stickers
            for (const sticker of stickers) {
                await prisma.ticker.create({
                    data: {
                        videos: { connect: { id: video_id } },
                        start_time: new Date(sticker.start * 1000),
                        end_time: new Date(sticker.end * 1000),
                        sticker_system: sticker.id ? { connect: { id: sticker.id } } : undefined,
                        width: sticker.width ?? 100,
                        height: sticker.height ?? 100,
                        po_x: sticker.position?.x ?? 0,
                        po_y: sticker.position?.y ?? 0,
                        rotate: sticker.rotate || 0,
                        status: sticker.status,
                    },
                });
            }

            // Xóa thư mục outputDir
            await deleteDirectoryWithRetry(outputDir);

            res.json(createResponse(200, "Data saved successfully"));
        } catch (err) {
            console.error("Save error:", err);
            // Xóa thư mục outputDir ngay cả khi có lỗi
            try {
                await deleteDirectoryWithRetry(outputDir);
            } catch (cleanupErr) {
                console.error('Failed to cleanup outputDir:', cleanupErr);
            }
            res.status(500).json(createErrorResponse(500, `Save failed: ${err.message}`));
        }
    },
    export: async (req, res) => {
        // Tạo thư mục outputs nếu chưa tồn tại
        await fs.ensureDir(outputDir);

        try {
            const {
                video_file,
                script_input,
                sticker_files = [],
                sticker_config,
                audio_files = [],
                audio_config,
            } = req.body;

            // Kiểm tra đầu vào bắt buộc
            if (!video_file) {
                throw new Error('Video file URL is required');
            }

            const downloadFile = async (url, fileName, type = 'video') => {
                const ext = type === 'video' ? 'mp4' : type === 'audio' ? 'm4a' : 'png'; // Sử dụng .m4a cho âm thanh
                const filePath = path.join(outputDir, `temp_${Date.now()}_${fileName}.${ext}`);
                try {
                    console.log(`Downloading ${type} from ${url}`);
                    const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
                    if (!response.data || response.data.length === 0) {
                        throw new Error(`Empty response from ${url}`);
                    }
                    await fs.writeFile(filePath, response.data);
                    console.log(`Saved ${type} to ${filePath}, size: ${response.data.length} bytes`);
                    return filePath;
                } catch (err) {
                    throw new Error(`Failed to download or save ${type} ${fileName}: ${err.message}`);
                }
            };

            // Tải và lưu video file
            const videoFileName = `video-${Date.now()}`;
            const videoPath = await downloadFile(video_file, videoFileName, 'video');

            // Xử lý script_input
            let scripts;
            try {
                scripts = typeof script_input === 'string' ? JSON.parse(script_input) : script_input || [];
            } catch (err) {
                throw new Error('Invalid script_input format: ' + err.message);
            }

            // Xử lý sticker_files và sticker_config
            let stickers;
            try {
                stickers = typeof sticker_config === 'string' ? JSON.parse(sticker_config) : sticker_config || [];
            } catch (err) {
                throw new Error('Invalid sticker_config format: ' + err.message);
            }

            if (stickers.length !== sticker_files.length) {
                throw new Error(`Sticker files (${sticker_files.length}) must match sticker configs (${stickers.length})`);
            }

            const formattedStickerFiles = [];
            for (let i = 0; i < stickers.length; i++) {
                const stickerPath = await downloadFile(sticker_files[i], `sticker-${i}-${Date.now()}`, 'image');
                stickers[i].file_path = stickerPath;
                formattedStickerFiles.push(stickerPath);
            }

            // Xử lý audio_files và audio_config
            let audioConfigs;
            try {
                audioConfigs = typeof audio_config === 'string' ? JSON.parse(audio_config) : audio_config || [];
            } catch (err) {
                throw new Error('Invalid audio_config format: ' + err.message);
            }

            if (audioConfigs.length !== audio_files.length) {
                throw new Error(`Audio files (${audio_files.length}) must match audio configs (${audioConfigs.length})`);
            }

            // Trong hàm export
            const formattedAudioFiles = [];
            for (let i = 0; i < audioConfigs.length; i++) {
                const tempAudioPath = await downloadFile(audio_files[i], `audio-${i}-${Date.now()}`, 'audio');
                const convertedAudioPath = path.join(outputDir, `converted_audio_${i}_${Date.now()}.mp3`);
                await convertAudioToMp3(tempAudioPath, convertedAudioPath);
                audioConfigs[i].file_path = convertedAudioPath;
                formattedAudioFiles.push(convertedAudioPath);
                // Xóa tệp tạm sau khi chuyển đổi
                await deleteFileWithRetry(tempAudioPath);
            }

            // Gọi hàm overlayVideo từ ffmeg.js
            console.log('Starting video processing with overlayVideo...');
            const outputPath = await overlayVideo({
                videoPath,
                scripts,
                stickers,
                audioConfigs,
            });
            console.log(`Video processing completed, output: ${outputPath}`);

            // Đọc file output để trả về base64
            const videoData = await fs.readFile(outputPath);
            const base64Data = videoData.toString('base64');
            const videoUrl = `data:video/mp4;base64,${base64Data}`;

            const urlVideo = await uploadVideo(outputPath);
            console.log("✅ URL video :", urlVideo);


            // Dọn dẹp file tạm với retry
            await deleteFileWithRetry(videoPath);
            for (const file of formattedStickerFiles) {
                await deleteFileWithRetry(file);
            }
            for (const file of formattedAudioFiles) {
                await deleteFileWithRetry(file);
            }
            await deleteFileWithRetry(outputPath);

            // Xóa thư mục outputDir
            await deleteDirectoryWithRetry(outputDir);

            // Trả về response
            res.json(
                createResponse(200, 'success', {
                    video_url: urlVideo,
                    status: 'Completed',
                })
            );
        } catch (err) {
            console.error('Video Processing error:', err);
            try {
                await deleteDirectoryWithRetry(outputDir);
            } catch (cleanupErr) {
                console.error('Failed to cleanup outputDir:', cleanupErr);
            }
            res.status(500).json(
                createErrorResponse(500, `Video Processing error: ${err.message}`)
            );
        }
    },
    getMusicSystem: async (req, res) => {
        try {
            const music = await Edit.getMusic();
            if (!music) {
                return res.status(404).json({
                    mes: "fail",
                    status: 404,
                    data: null,
                });
            }
            res.json({
                mes: "success",
                status: 200,
                data: {
                    musics: music
                }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    getStickerSystem: async (req, res) => {
        try {
            const stickers = await Edit.setSticker();
            if (!stickers) {
                return res.status(404).json({
                    mes: "fail",
                    status: 404,
                    data: null,
                });
            }
            res.json({
                mes: "success",
                status: 200,
                data: {
                    stickers: stickers
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    // Thêm endpoint upload audio
    uploadAudio: async (req, res) => {
        try {
            if (!req.file) {
                throw new Error("No audio file provided");
            }

            // Upload file lên Cloudinary
            const musicUrl = await uploadAudio(req.file.path);
            console.log(musicUrl);

            // Lấy user_id từ server (giả sử bạn gán user vào req.user khi xác thực JWT)
            const userId = req.user?.id;
            console.log(req)
            if (!userId) {
                throw new Error("Unauthorized: User ID not found");
            }

            // Tạo bản ghi trong bảng music_system
            const newMusic = await prisma.music_system.create({
                data: {
                    url: musicUrl,
                    name: req.file.originalname || "Unnamed Audio",
                    user: { connect: { id: userId } }
                }
            });

            console.log(newMusic);

            // Xóa file tạm
            await deleteFileWithRetry(req.file.path);

            // Trả về URL và dữ liệu đã tạo
            res.json(createResponse(200, "Audio uploaded and saved", { url: musicUrl, id: newMusic.id }));
        } catch (error) {
            console.error("Upload audio error:", error);
            if (req.file) {
                await deleteFileWithRetry(req.file.path).catch(err => console.error("Failed to delete temp file:", err));
            }
            res.status(500).json(createErrorResponse(500, `Upload audio failed: ${error.message}`));
        }
    },


    // Thêm endpoint upload image
    uploadImage: async (req, res) => {
        try {
            if (!req.file) {
                throw new Error("No image file provided");
            }

            // Upload file lên Cloudinary
            const musicUrl = await uploadAudio(req.file.path);

            // Xóa file tạm
            await deleteFileWithRetry(req.file.path);

            // Trả về URL
            res.json(createResponse(200, "Image uploaded successfully", { url: musicUrl }));
        } catch (error) {
            console.error("Upload image error:", error);
            if (req.file) {
                await deleteFileWithRetry(req.file.path).catch(err => console.error("Failed to delete temp file:", err));
            }
            res.status(500).json(createErrorResponse(500, `Upload image failed: ${error.message}`));
        }
    },
};

export default editController;