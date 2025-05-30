// const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenerativeAI } from "@google/generative-ai";
// const { Client } = require("@gradio/client");
import { Client } from "@gradio/client";
import { Runware } from "@runware/sdk-js";
// const dotenv = require("dotenv");
import dotenv from "dotenv";
import { transcribeAudioFile } from "../../utils/handerAudio.js";
dotenv.config();

import { createFullVideo } from "../../utils/createVideo.js";
import { processTextToSpeech } from "../../utils/createVoice.js";
import { getDurations } from "../../utils/duration.js";
import { mergeMp3Files } from "../../utils/mergeVoice.js";
import { uploadVideo } from "../../utils/uploadVideo.js";

import fs from "fs";

const key = process.env.GOOGLE_API_KEY;
const token_runware =
    process.env.RUNWARE_API_KEY || "jBAUzI5npXcITqnHAXlzihkPIrDBb6Wd";
const pixaiToken =
    "eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJsZ2EiOjE3NDY4MDQ5OTUsImlhdCI6MTc0NjgwNDk5NSwiZXhwIjoxNzQ3NDA5Nzk1LCJpc3MiOiJwaXhhaSIsInN1YiI6IjE4Nzc2MDM1ODMxNDIzNDk1NzMiLCJqdGkiOiIxODc3NjAzNTg0ODMyNjU0MTA2In0.ADncS_MethJOXVgwhk6uCXu9AzNEn_5xUZg1aB7LhfKa7gyaUj99_mMVDlYjPEtOSuot-NNH2h-kZkOL0GlV39h7AZr3XFgNHQe7ByU3FJEk_nDwQtbJ2fjSMQ9PZMEB1F-QJb94nY-O1yqULw6iSUS1oHP8GbL4NTKCo8MwjASgx_gs";
const genAI = new GoogleGenerativeAI(key);

async function enrichScriptWithImagePrompts(topic) {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    const prompt = `
Mục tiêu:
Tôi đang phát triển một ứng dụng tạo video bằng cách ghép các ảnh tĩnh lại với nhau. Mỗi ảnh sẽ được tạo dựa trên một câu ngắn mô tả nội dung và một image prompt đầy đủ chi tiết. Vì tôi tạo từng ảnh một cách riêng biệt và không lưu lịch sử, mỗi prompt phải hoàn chỉnh, độc lập và có tính đồng nhất xuyên suốt các ảnh.

Yêu cầu cụ thể:
Phân tách ${topic} thành các đoạn nhỏ, mỗi đoạn dài 2 đến 3 câu, có ý nghĩa rõ ràng và có thể dễ dàng mô tả bằng một bức ảnh.

Với mỗi đoạn nội dung đó, tạo một imagePrompt phù hợp, bao gồm:

Cảnh vật chính.

Cảm xúc hoặc hành động nếu có.

Màu sắc, phong cách, ánh sáng, phông nền (background), bố cục tổng thể.

Nhấn mạnh vào sự đồng nhất xuyên suốt các ảnh: cùng nhân vật, cùng phong cách tạo hình (ví dụ: hoạt hình 3D, tranh vẽ cổ điển, màu vintage, nền mờ nhẹ...).

(Bắt buộc) Tạo trước mô tả chi tiết cho các nhân vật, sự vật xuất hiện xuyên suốt ảnh như người, cây cối, động vật, đồ vật... đảm bảo mọi chi tiết như áo quần(màu sắc quần áo, kiểu dáng quần áo), ngoại hình(cao, thấp, gầy, mập), màu tóc, màu mắt, độ tuổi, giới tính, cảm xúc khuôn mặt... đều được mô tả rõ ràng.

(Bắt buộc) Khi nhắc đến các nhân vật, luôn mô tả kỹ trong ngoặc: giới tính, độ tuổi, màu da, vóc dáng, kiểu tóc, màu mắt, trang phục (kiểu dáng, màu sắc), cảm xúc khuôn mặt...

(Bắt buộc) Các chú thích mô tả kỹ trong ngoặc phải giống nhau cho tất cả các ảnh có cùng nhân vật/sự vật. Ví dụ: nếu có một nhân vật nữ tóc vàng, mắt xanh, mặc áo đỏ trong ảnh đầu tiên, thì trong ảnh thứ hai cũng phải miêu tả giống như vậy (nếu không có sự thay đổi nào về ngoại hình). Điều này giúp tạo ra sự đồng nhất và dễ nhận diện cho nhân vật/sự vật xuyên suốt các ảnh.

Mỗi ảnh đều phải lặp lại mô tả này để đảm bảo các ảnh có thể tạo độc lập mà vẫn đồng nhất hình ảnh.

Kết quả trả về:
Trả về kết quả là một JSON array, bắt buộc phải bắt đầu bằng [ và kết thúc bằng ]. Mỗi phần tử trong mảng có cấu trúc như sau:
{
  "text": "đây là nội dung nguyên gốc từ topic tôi cung cấp, tuyệt đối KHÔNG được thay đổi",
  "imagePrompt": "prompt bằng tiếng anh tạo ảnh thật chi tiết. Mỗi nhân vật, đồ vật phải miêu tả kỹ lưỡng từng đặc điểm về ngoại hình, trang phục, vóc dáng,... Lặp lại các mô tả này ở mọi ảnh nếu nhân vật/sự vật vẫn còn xuất hiện. Phải đồng nhất về bối cảnh, ánh sáng, phong cách (ví dụ: tranh vẽ cổ điển, hoạt hình 3D, ánh sáng mềm, màu nâu vintage, nền mờ nhẹ...)"
}
`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawText = response.text();
        // Trích xuất JSON từ response
        let match = rawText.match(/```json\s*([\s\S]*?)\s*```/);
        let jsonText = "";
        if (!match) {
            // Nếu không tìm thấy định dạng markdown, thử tìm mảng JSON trực tiếp
            match = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
            if (match) {
                jsonText = match[0];
            } else {
                throw new Error("Không tìm thấy JSON hợp lệ trong phản hồi");
            }
        } else {
            jsonText = match[1].trim();
        }

        // Chuẩn hóa JSON
        try {
            // Thử phân tích trực tiếp
            return JSON.parse(jsonText);
        } catch (initialError) {
            return enrichScriptWithImagePrompts(topic);
        }
    } catch (error) {
        console.error("Lỗi:", error.message);
        return [];
    }
}

async function generateScript(topic) {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    const prompt = `
Hãy tạo ra nội dung bài viết phải đạt 200 chữ:  một phân tích(nghị luận) hoặc truyện thật hấp dẫn(bạn hãy đọc và đánh giá chủ đề cho nó ví dụ như chủ đề về nỗi sợ AI thì là 1 bài phân tích có luận điểm, luận cứ rõ ràng, nếu người dùng mong muốn truyện thì hãy viết truyện, nếu người dùng đã viết kịch bản thì bạn hãy hoàn thiện nó giúp người dùng). Ngôn ngữ câu trả lời dựa theo ngôn ngữ của Chủ đề(ví dụ chủ đề được viết theo tiếng anh thì bạn trả về tiếng anh, tiếng viết thì bạn trả về tiếng việt). Chú ý rằng bạn nên viết sao cho nội dung được gom nhóm theo kiểu 2 ~ 3 câu sao cho dễ miêu tả thành 1 bức tranh(tôi làm ứng dụng tạo ảnh từ nội dung) 
Lưu ý rằng bạn chỉ cần viết nội dung mà không cần thêm bất kì từ ngữ gì khác(kiểu như "Sau đây là nội dung,..")
Chủ đề: "${topic}"
`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawText = response.text();
        return rawText;
    } catch (error) {
        console.error("Lỗi:", error.message);
    }
}
async function generateImage(
    prompt,
    modelId,
    token,
    i,
    content,
    negativePrompt = "worst quality, low quality, easynegative, blurry, deformed, deformed hands, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, disfigured, extra limbs, missing limbs, floating limbs, disconnected limbs, malformed limbs, ugly, disgusting, bad anatomy, bad proportions, gross proportions, text, error, missing fingers, missing arms, missing legs, extra digit, fewer digits, cropped, jpeg artifacts, signature, watermark"
) {
    try {
        // 1. Gửi yêu cầu tạo tác vụ tạo ảnh sử dụng GraphQL với variables
        const query = `
  mutation createGenerationTask($parameters: JSONObject!) {
    createGenerationTask(parameters: $parameters) {
      id
      status
      moderationAction {
        promptsModerationAction
      }
    }
  }
`;

        const variables = {
            parameters: {
                prompts: prompt,
                negativePrompts: negativePrompt,
                width: 512,
                height: 768,
                modelId: modelId,
                cfgScale: 6,
                samplingSteps: 25,
                samplingMethod: "DPM++ 2M Karras",
                seed: "",
                clipSkip: 2,
                controlNets: [],
                extra: {},
                priority: 1000,
                lightning: false,
            },
        };

        const createResponse = await fetch("https://api.pixai.art/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });

        const createData = await createResponse.json();
        console.log(createData);
        const taskId = createData.data?.createGenerationTask?.id;
        if (!taskId) throw new Error("Không tạo được task");

        // 2. Kiểm tra trạng thái liên tục đến khi ảnh được tạo xong
        let mediaUrl = null;
        for (let i = 0; i < 100; i++) {
            await new Promise((res) => setTimeout(res, 6000));
            const statusRes = await fetch(
                `https://api.pixai.art/v1/task/${taskId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const statusData = await statusRes.json();
            if (statusData.status === "completed" && statusData.outputs) {
                mediaUrl = statusData.outputs.mediaUrls[0];
                break;
            }
        }

        if (!mediaUrl)
            throw new Error("❌ Không thể lấy được ảnh sau 100 lần kiểm tra.");

        return {
            url: mediaUrl,
            index: i,
            prompt: prompt,
            content: content,
        };
    } catch (error) {
        return {
            url: "",
            index: i,
            prompt: prompt,
            content: content,
        };
    }
}

async function generateImageVer3(
    prompt,
    i,
    content,
    negativePrompt = "(deformed, distorted, disfigured), poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, (mutated hands and fingers), disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation, misspellings, typos"
) {
    try {
        // 1. Khởi tạo SDK
        const runware = new Runware({ apiKey: token_runware });
        const prompt_2 = prompt + " With anime style";
        negativePrompt +=
            ", fused fingers, bad hands, malformed limbs, poorly drawn hands, lowres, too many fingers";
        // 2. Gửi yêu cầu tạo ảnh
        const images = await runware.requestImages({
            positivePrompt: prompt_2,
            negativePrompt: negativePrompt,
            model: "runware:100@1",
            height: 768,
            width: 1024,
            steps: 4,
            CFGScale: 6,
            numberResults: 1,
        });

        // 3. Trích xuất URL ảnh
        if (!images || !images.length) {
            throw new Error("❌ Không nhận được ảnh.");
        }

        const imageUrl = images[0].imageURL;

        return {
            url: imageUrl,
            index: i,
            prompt: prompt,
            content: content,
        };
    } catch (error) {
        console.error("Lỗi tạo ảnh:", error);
        return {
            url: "",
            index: i,
            prompt: prompt,
            content: content,
        };
    }
}

async function generateImageVer2(prompt, i, content) {
    try {
        // Kết nối tới Gradio client
        const client = await Client.connect("Nymbo/Serverless-ImgGen-Hub");
        prompt += " With anime style";
        // Gọi API tạo ảnh (các tham số khác bạn có thể tuỳ chỉnh hoặc truyền thêm nếu muốn)
        const result = await client.predict("/query", {
            prompt,
            model: "FLUX.1 [Schnell]",
            custom_lora: "",
            is_negative:
                "(deformed, distorted, disfigured), poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, (mutated hands and fingers), disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation, misspellings, typos",
            steps: 4,
            cfg_scale: 7,
            sampler: "DPM++ 2M Karras",
            seed: -1,
            strength: 0.75,
            width: 1080,
            height: 1920,
        });

        const images = result.data[0];
        const imageUrl = images.url;
        return {
            url: imageUrl, // hoặc base64Image nếu muốn trả về base64
            index: i,
            prompt,
            content,
        };
    } catch (error) {
        console.error("Gradio image error:", error);
        return {
            url: "",
            index: i,
            prompt,
            content,
        };
    }
}

async function generateImagesFromSegments(segments, modelId, token) {
    const tasks = [];
    for (let i = 0; i < segments.length; i++) {
        tasks.push(
            // generateImage(
            //     segments[i].imagePrompt,
            //     modelId,
            //     token,
            //     i,
            //     segments[i].text
            // )
            generateImageVer3(segments[i].imagePrompt, i, segments[i].text)
        );
    }
    const res = await Promise.all(tasks);
    console.log("ĐÃ XONG HÌNH ẢNH");
    const images = [];
    for (let i = 0; i < res.length; i++) {
        if (res[i]) {
            images.push(res[i]);
        }
    }
    images.sort((a, b) => a.index - b.index);
    const result = images.map(({ index, ...rest }) => rest);
    return result;
}

const contentController = {
    getContentData: async (req, res) => {
        const { topic } = req.body;
        try {
            const contentData = await generateScript(topic);
            res.json({
                mes: "success",
                status: 200,
                data: contentData,
            });
        } catch (error) {
            console.error("Error fetching content data:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    handleVideoController: async (req, res) => {
        try {
            // Lấy danh sách URL ảnh và scripts từ body
            // const images = req.body.images || []; // Mảng URL ảnh
            // const scripts = req.body.scripts || [
            //     "xin chào tôi là Minh",
            //     "á đù vip quá bro",
            // ]; // Mảng scripts tương ứng
            // const voice =
            //     req.body.voice || "vi-VN-HoaiMyNeural (vi-VN, Female)"; // Giọng nói mặc định
            // const rate = req.body.rate || 0; // Tốc độ đọc mặc định
            // const pitch = req.body.pitch || 0; // Cao độ mặc định
            // const num_lines = req.body.num_lines || 1; // Số dòng mặc định
            const { image_video, voice_info } = req.body;
            const images = image_video.map((item) => item.url);
            const scripts = image_video.map((item) => item.content);
            const voice =
                voice_info.voice || "vi-VN-HoaiMyNeural (vi-VN, Female)";
            const rate = voice_info.rate || 0; // Tốc độ đọc mặc định
            const pitch = voice_info.pitch || 0; // Cao độ mặc định
            const num_lines = 1; // Số dòng mặc định

            // Xử lý từng đoạn script để tạo file âm thanh song song
            const audioUrls = await Promise.all(
                scripts.map((script) =>
                    processTextToSpeech({
                        text: script,
                        voice, // Thay bằng giọng nói bạn muốn sử dụng
                        rate, // Tốc độ đọc
                        pitch, // Cao độ
                        num_lines, // Số dòng
                    })
                )
            );

            console.log("🔊 Danh sách URL âm thanh:", audioUrls);

            const durations = await getDurations(audioUrls);
            console.log("⏱️ Thời gian các file âm thanh:", durations);
            const startTimeEachImage = [];
            for (let i = 0; i < durations.length; i++) {
                if (i === 0) {
                    startTimeEachImage.push(0);
                } else {
                    startTimeEachImage.push(
                        startTimeEachImage[i - 1] + durations[i - 1]
                    );
                }
            }
            const durationAll = durations.reduce((acc, cur) => acc + cur, 0);
            console.log("🔊 Bắt đầu merge:");
            const mergedAudio = await mergeMp3Files(audioUrls);
            console.log("🔊 Merge xong:", mergedAudio);

            // // Tiếp tục xử lý logic tạo video với audioUrls và images
            const finalVideo = await createFullVideo(
                images,
                durations,
                mergedAudio
            );

            const urlVideo = await uploadVideo(finalVideo);
            console.log("✅ URL video :", urlVideo);
            res.status(200).json({
                mes: "success",
                status: 200,
                data: {
                    url: urlVideo,
                    durations: startTimeEachImage,
                    durationAll: durationAll,
                },
            });
            // Xóa file video sau khi upload
            if (fs.existsSync(finalVideo)) {
                fs.unlinkSync(finalVideo);
                console.log(`✅ Đã xóa file video : ${finalVideo}`);
            }

            // Gửi URL video về client
        } catch (err) {
            console.error("❌ Server error:", err);
            res.status(500).json({
                mes: "fail",
                status: 500,
                data: null,
            });
        }
    },

    getContentDataWithImage: async (req, res) => {
        const { content } = req.body;
        try {
            const imagePrompts = await enrichScriptWithImagePrompts(content);
            const result = await generateImagesFromSegments(
                imagePrompts,
                "1648918127446573124",
                pixaiToken
            );
            res.json({
                mes: "success",
                status: 200,
                data: result,
            });
        } catch (error) {
            console.error("Error fetching content data:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    getReGenerateImage: async (req, res) => {
        const { prompt, index, content } = req.body;
        try {
            // const result = await generateImage(
            //     prompt,
            //     "1648918127446573124",
            //     pixaiToken,
            //     index,
            //     content
            // );
            const result = await generateImageVer3(prompt, index, content);
            res.json({
                mes: "success",
                status: 200,
                data: result,
            });
        } catch (error) {
            console.error("Error fetching content data:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    uploadAudioHandler: async (req, res) => {
        try {
            const inputFilePath = req.file.path;
            const transcript = await transcribeAudioFile(inputFilePath);
            res.json({
                mes: "success",
                status: 200,
                data: transcript,
            });

            // Xóa file tạm sau khi xử lý xong
            fs.unlinkSync(inputFilePath);
        } catch (error) {
            console.error("Error processing audio file:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

// module.exports = contentController;
export default contentController;
