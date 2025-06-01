import Video from "./service.js";
const videoController = {
    getVideoById: async (req, res) => {
        const { id } = req.params;
        const user = req.user;
        try {
            const video = await Video.getById(id);
            console.log("Video ren ra ban đầu :", video);

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
                    url_edit: "",
                    is_custom_voice: false,
                    duration: 0,
                    thumbnail: "",
                    quality: "",
                    is_bg_music: false,
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
                const image_video_raw = video.image_video.map((item) => {
                    return {
                        content: item.content,
                        url: item.url,
                        prompt: item.prompt,
                        ordinal_number: item.ordinal_number,
                        start_time: item.start_time,
                        end_time: item.end_time,
                        url_mp3 : item.url_mp3 || "", // Thêm trường url_mp3 nếu có
                    };
                });
                const image_video = image_video_raw
                    .sort((a, b) => a.ordinal_number - b.ordinal_number)
                    .map((item) => {
                        return {
                            content: item.content,
                            url: item.url,
                            prompt: item.prompt,
                            start_time: item.start_time,
                            end_time: item.end_time,
                            url_mp3 : item.url_mp3,
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
                    url_edit: video.url_edit,
                    is_custom_voice: video.is_custom_voice,
                    duration: video.duration,
                    thumbnail: video.thumbnail,
                    quality: video.quality,
                    is_bg_music: video.is_bg_music,
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
