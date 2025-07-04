import Video from "./service.js";
import {
    createResponse,
    createErrorResponse,
} from "../../utils/responseAPI.js";

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
                    style_video: "Tự do",
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
                        url_mp3: item.url_mp3 || "", // Thêm trường url_mp3 nếu có
                        url_mp3: item.url_mp3 || "", // Thêm trường url_mp3 nếu có
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
                            url_mp3: item.url_mp3,
                            url_mp3: item.url_mp3,
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
                    style_video: video.style_video || "Tự do",
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

    getVideoInfo: async (req, res) => {
        const { id } = req.params;
        const user = req.user;

        try {
            const video = await Video.getVideoInfo(id, user.id);
            if (!video) {
                return res
                    .status(404)
                    .json(createErrorResponse(404, "Video không tồn tại"));
            }
            res.json(createResponse(200, "success", video));
        } catch (error) {
            console.error(error);
            res.status(500).json(createErrorResponse(500, "Lỗi server nội bộ"));
        }
    },

    uploadVideoToYouTube: async (req, res) => {
        const { videoUrl, cloudinaryPublicId, title, description } = req.body;
        const user = req.user;

        try {
            // Validate required fields
            if (!videoUrl || !cloudinaryPublicId || !title) {
                return res
                    .status(400)
                    .json(
                        createErrorResponse(
                            400,
                            "Thiếu videoUrl, cloudinaryPublicId hoặc title"
                        )
                    );
            }

            // Đăng video lên YouTube
            const youtubeResponse = await Video.uploadVideo(
                videoUrl,
                title,
                description,
                user.id
            );

            // Tạo URL YouTube từ videoId
            const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeResponse.id}`;

            res.json(
                createResponse(200, "success", {
                    youtubeVideo: { id: youtubeResponse.id, youtubeUrl },
                })
            );
        } catch (error) {
            console.error(error);
            res.status(500).json(
                createErrorResponse(
                    500,
                    error.message || "Lỗi khi đăng video lên YouTube"
                )
            );
        }
    },

    uploadVideoToFacebook: async (req, res) => {
        const { videoUrl, cloudinaryPublicId, title, description } = req.body;
        const user = req.user;

        try {
            if (!videoUrl || !cloudinaryPublicId || !title) {
                return res
                    .status(400)
                    .json(
                        createErrorResponse(
                            400,
                            "Thiếu videoUrl, cloudinaryPublicId hoặc title"
                        )
                    );
            }

            const facebookResponse = await Video.uploadVideoToFacebook(
                videoUrl,
                title,
                description,
                user.id
            );

            const facebookUrl = `https://www.facebook.com/${facebookResponse.id}`;

            res.json(
                createResponse(200, "success", {
                    facebookVideo: { id: facebookResponse.id, facebookUrl },
                })
            );
        } catch (error) {
            console.error(error);
            res.status(500).json(
                createErrorResponse(
                    500,
                    error.message || "Lỗi khi đăng video lên Facebook"
                )
            );
        }
    },

    searchVideos: async (req, res) => {
        const query = req.query.q;
        const user = req.user;
        console.log("K");
        try {
            const suggestions = await Video.searchVideos(query, user.id);
            console.log(suggestions);
            res.json({
                mes: "success",
                status: 200,
                data: suggestions,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    getVideoData: async (req, res) => {
        const { page = 1, limit = 5, q, category, sort, status } = req.query;
        const user = req.user;

        try {
            const result = await Video.getVideoData(
                user.id,
                parseInt(page),
                parseInt(limit),
                q,
                category,
                sort,
                status
            );
            res.json({
                mes: "success",
                status: 200,
                data: result.data,
                totalPages: result.totalPages,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server nội bộ" });
        }
    },

    getVideoDataFull: async (req, res) => {
        const { page = 1, q, category, sort, status } = req.query;

        try {
            const result = await Video.getVideoDataFull(
                parseInt(page),
                6, // Đặt limit cố định là 6
                q,
                category,
                sort,
                status
            );
            res.json({
                mes: "success",
                status: 200,
                data: result.data,
                totalPages: result.totalPages,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server nội bộ" });
        }
    },

    getSuggestions: async (req, res) => {
        const { q } = req.query;
        const user = req.user;

        try {
            const suggestions = await Video.getSuggestions(user.id, q);
            res.json({
                mes: "success",
                status: 200,
                data: { suggestions },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi khi lấy gợi ý" });
        }
    },

    getRandomVideos: async (req, res) => {
        try {
            const { status = "completed" } = req.query; // Default to 'completed'
            const limit = 12; // Lấy 12 video ngẫu nhiên
            const result = await Video.getRandomVideos(limit, status);
            res.json({
                id: result.id,
                id: result.id,
                data: result.data,
                status: 200,
                message: "success",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server nội bộ" });
        }
    },

    renameVideo: async (req, res) => {
        const { id } = req.params; // Lấy id từ URL params
        const { name } = req.body; // Lấy tên mới từ body
        const user = req.user; // Lấy thông tin user từ middleware

        try {
            // Kiểm tra xem name có được cung cấp hay không
            if (!name) {
                return res
                    .status(400)
                    .json({ message: "Tên video là bắt buộc" });
            }

            // Gọi service để đổi tên video
            await Video.renameVideo(user.id, id, name);

            res.json({
                mes: "success",
                status: 200,
                message: "Đổi tên video thành công",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: error.message || "Lỗi server nội bộ",
            });
        }
    },

    deleteVideo: async (req, res) => {
        const { id } = req.params;
        const user = req.user;

        try {
            await Video.deleteVideo(user.id, id);

            res.json({
                mes: "success",
                status: 200,
                message: "Xóa video thành công",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: error.message || "Lỗi server nội bộ",
            });
        }
    },
};

export default videoController;
