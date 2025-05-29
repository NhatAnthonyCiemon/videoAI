// import ffmpeg from "fluent-ffmpeg";
// import ffmpegPath from "ffmpeg-static";
// import fs from "fs";
// import path from "path";
// import { SpeechClient } from "@google-cloud/speech";
// import { fileURLToPath } from "url";

// // Thiết lập đường dẫn ffmpeg tĩnh
// ffmpeg.setFfmpegPath(ffmpegPath);

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Google Speech client (đường dẫn key.json bạn tự chỉnh phù hợp)
// const client = new SpeechClient({
//     keyFilename: path.join(__dirname, "key.json"),
// });

// function convertToWav(inputPath, outputPath) {
//     return new Promise((resolve, reject) => {
//         ffmpeg(inputPath)
//             .outputOptions(["-ac 1", "-ar 16000", "-f wav"])
//             .on("end", () => resolve(outputPath))
//             .on("error", (err) => reject(err))
//             .save(outputPath);
//     });
// }

// async function transcribeWavFile(filePath) {
//     const file = fs.readFileSync(filePath);
//     const audioBytes = file.toString("base64");

//     const audio = { content: audioBytes };
//     const config = {
//         encoding: "LINEAR16",
//         sampleRateHertz: 16000,
//         languageCode: "vi-VN",
//     };

//     const [response] = await client.recognize({ audio, config });
//     return response.results.map((r) => r.alternatives[0].transcript).join("\n");
// }

// /**
//  * Hàm nhận file audio đầu vào, chuyển sang wav, chuyển thành text
//  * @param {string} inputFilePath - Đường dẫn file audio đầu vào (do frontend upload)
//  * @returns {Promise<string>} - Kết quả transcript (chuỗi text)
//  */
// export async function transcribeAudioFile(inputFilePath) {
//     const outputFilePath = inputFilePath + ".wav";
//     try {
//         // Chuyển đổi sang WAV
//         await convertToWav(inputFilePath, outputFilePath);

//         // Chuyển âm thanh WAV sang text
//         const transcript = await transcribeWavFile(outputFilePath);

//         // Xóa file tạm
//         fs.unlinkSync(outputFilePath);

//         return transcript;
//     } catch (error) {
//         // Nếu có lỗi thì vẫn xóa file tạm nếu tồn tại
//         if (fs.existsSync(outputFilePath)) {
//             fs.unlinkSync(outputFilePath);
//         }
//         throw error;
//     }
// }

import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// Thiết lập ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Chuyển file audio sang WAV chuẩn 16kHz mono
 */
function convertToWav(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .outputOptions(["-ac 1", "-ar 16000", "-f wav"])
            .on("end", () => resolve(outputPath))
            .on("error", (err) => reject(err))
            .save(outputPath);
    });
}

/**
 * Upload file WAV lên AssemblyAI qua HTTP
 */
async function uploadToAssemblyAI(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const response = await axios.post(
        "https://api.assemblyai.com/v2/upload",
        fileStream,
        {
            headers: {
                authorization: process.env.ASSEMBLYAI_API_KEY,
                "Transfer-Encoding": "chunked",
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        }
    );

    return response.data.upload_url;
}

/**
 * Gửi yêu cầu transcript từ AssemblyAI
 */
async function requestTranscript(uploadUrl) {
    const response = await axios.post(
        "https://api.assemblyai.com/v2/transcript",
        {
            audio_url: uploadUrl,
            language_code: "vi",
            punctuate: true,
            format_text: true,
            speech_model: "universal",
        },
        {
            headers: {
                authorization: process.env.ASSEMBLYAI_API_KEY,
                "content-type": "application/json",
            },
        }
    );

    return response.data.id;
}

/**
 * Chờ transcript hoàn tất
 */
async function waitForTranscript(transcriptId) {
    const url = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;

    while (true) {
        const response = await axios.get(url, {
            headers: {
                authorization: process.env.ASSEMBLYAI_API_KEY,
            },
        });

        const status = response.data.status;
        if (status === "completed") {
            return response.data.text;
        } else if (status === "error") {
            throw new Error("Transcription failed: " + response.data.error);
        }

        await new Promise((r) => setTimeout(r, 2000)); // Đợi 2s rồi kiểm tra lại
    }
}

/**
 * Hàm chính nhận file audio, chuyển sang text qua AssemblyAI
 */
export async function transcribeAudioFile(inputFilePath) {
    const outputFilePath = inputFilePath + ".wav";

    try {
        // 1. Chuyển sang WAV chuẩn
        await convertToWav(inputFilePath, outputFilePath);

        // 2. Upload lên AssemblyAI
        const uploadUrl = await uploadToAssemblyAI(outputFilePath);
        console.log("Upload thành công:", uploadUrl);

        // 3. Yêu cầu transcript
        const transcriptId = await requestTranscript(uploadUrl);
        console.log("Transcript ID:", transcriptId);

        // 4. Chờ kết quả
        const transcriptText = await waitForTranscript(transcriptId);

        // 5. Xoá file tạm
        fs.unlinkSync(outputFilePath);

        return transcriptText;
    } catch (error) {
        if (fs.existsSync(outputFilePath)) {
            fs.unlinkSync(outputFilePath);
        }
        throw error;
    }
}
