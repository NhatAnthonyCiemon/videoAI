import { Client } from "@gradio/client";
import Edit from "./service.js";
import {
    createResponse,
    createErrorResponse,
} from "../../utils/responseAPI.js";

const editController = {
    export: async (req, res) => {
        try {
            const {
                video_file,
                script_input,
                sticker_files,
                sticker_config,
                audio_files,
                audio_config,
            } = req.body;

            // Kiểm tra các đầu vào bắt buộc
            if (!video_file) {
                throw new Error("Video file is required");
            }

            // Kết nối tới Gradio API
            const client = await Client.connect("http://127.0.0.1:7860/");

            // Gọi API /predict_1 với các tham số
            const result = await client.predict("/predict_1", {
                video_file,
                script_input: script_input || '[{"text": "", "start": 0, "end": 0, "style": {"position": "bottom", "fontSize": 20, "fontColor": "white", "backgroundColor": "black@0.5", "fontStyle": ["bold"], "alignment": "center", "shadow": {"color": "black", "offsetX": 2, "offsetY": 2}, "outline": {"color": "red", "width": 2}}}]',
                sticker_files: sticker_files || [],
                sticker_config: sticker_config || '[{"start": 0, "end": 0, "width": 100, "height": 100, "position": {"x": 0, "y": 0}, "rotate": 0}]',
                audio_files: audio_files || [],
                audio_config: audio_config || '[{"start": 0, "end": 0, "volume": 0.5}]',
            });

            // Lọc bỏ giá trị null và lấy URL video đầu ra
            const videoData = result.data?.filter((item) => item !== null)[0];
            if (!videoData || !videoData.url) {
                throw new Error("Video output URL not found");
            }

            // Gửi URL của video kết quả và trạng thái (nếu có) đến frontend
            res.json(
                createResponse(200, "success", {
                    video_url: videoData.url,
                    status: result.data?.[1] || "Completed",
                })
            );
        } catch (err) {
            console.error("Gradio Video Processing error:", err);
            res.status(500).json(
                createErrorResponse(500, "Gradio Video Processing error")
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
};

export default editController;