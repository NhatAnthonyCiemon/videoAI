import { url } from "inspector";
import Video from "./service.js";
const videoController = {
    getVideoById: async (req, res) => {
        const { id } = req.params;
        const user = req.user;
        try {
            const video = await Video.getById(id);
            if (!video) {
                const newVideo = {
                    id: id,
                    user_id: user.id,
                    name: "",
                    category: "Tiktok",
                    content: "",
                    image_video: [],
                    step: 0,
                    keyword: "",
                    voice_info: {
                        voice: "vi-VN-HoaiMyNeural (vi-VN, Female)",
                        rate: 0,
                        pitch: 0,
                    },
                    url: "",
                };
                res.json({
                    mes: "success",
                    status: 200,
                    data: newVideo,
                });
            } else {
                if (video.user_id !== user.id) {
                    return res.status(403).json({
                        mes: "fail",
                        status: 403,
                        data: null,
                    });
                }
                const image_video = video.image_video.map((item) => {
                    return {
                        content: item.content,
                        url: item.url,
                        prompt: item.prompt,
                    };
                });
                // Lấy thông tin voice_info từ video
                const voice_info = {
                    voice: video.voice_info.voice,
                    rate: video.voice_info.rate,
                    pitch: video.voice_info.pitch,
                };
                const newVideo = {
                    id: video.id,
                    user_id: video.user_id,
                    name: video.name,
                    category: video.category,
                    content: video.content,
                    image_video: image_video,
                    step: video.step,
                    keyword: video.keyword,
                    voice_info: voice_info,
                    url: video.url,
                };
                res.json({
                    mes: "success",
                    status: 200,
                    data: newVideo,
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
};

export default videoController;
