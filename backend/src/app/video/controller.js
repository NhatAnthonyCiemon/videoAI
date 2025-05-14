import Video from "./service.js";
const videoController = {
    getVideoById: async (req, res) => {
        const { id } = req.params;
        try {
            const video = await Video.getById(id);
            if (!video) {
                const newVideo = {
                    id: id,
                    user_id: 1,
                    name: "",
                    category: "Tiktok",
                    content: "",
                    image_video: [],
                    step: 0,
                    keyword: "",
                };
                res.json({
                    mes: "success",
                    status: 200,
                    data: newVideo,
                });
            } else {
                const image_video = video.image_video.map((item) => {
                    return {
                        content: item.content,
                        url: item.url,
                        prompt: item.prompt,
                    };
                });
                const newVideo = {
                    id: video.id,
                    user_id: video.user_id,
                    name: video.name,
                    category: video.category,
                    content: video.content,
                    image_video: image_video,
                    step: video.step,
                    keyword: video.keyword,
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
