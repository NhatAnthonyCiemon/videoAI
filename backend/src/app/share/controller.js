import Share from "./service.js";
import { createResponse, createErrorResponse } from "../../utils/responseAPI.js";

const shareController = {
    saveShareUrl: async (req, res) => {
        const { videoId, platform, url } = req.body;
        const user = req.user;

        try {
            // Validate required fields
            if (!videoId || !platform || !url) {
                return res.status(400).json(
                    createErrorResponse(400, "Thiếu videoId, platform hoặc url")
                );
            }

            // Validate platform
            const validPlatforms = ["youtube", "facebook", "tiktok"];
            if (!validPlatforms.includes(platform)) {
                return res.status(400).json(
                    createErrorResponse(400, "Platform không hợp lệ")
                );
            }

            // Lưu URL chia sẻ
            await Share.saveShareUrl(videoId, user.id, platform, url);

            res.json(createResponse(200, "success", null));
        } catch (error) {
            console.error("Lỗi khi lưu URL chia sẻ:", error);
            res.status(500).json(
                createErrorResponse(500, error.message || "Lỗi server nội bộ")
            );
        }
    },

    getShareUrl: async (req, res) => {
        const { videoId } = req.params;
        const user = req.user;

        try {
            const share = await Share.getShareUrl(videoId, user.id);
            if (!share) {
                return res.json(createResponse(200, "success", null));
            }
            res.json(createResponse(200, "success", share));
        } catch (error) {
            console.error("Lỗi khi lấy URL chia sẻ:", error);
            res.status(500).json(
                createErrorResponse(500, error.message || "Lỗi server nội bộ")
            );
        }
    },

    getSocialMetrics: async (req, res) => {
        const { videoId } = req.params;
        const user = req.user;

        try {
            const metrics = await Share.getSocialMetrics(videoId, user.id);
            res.json(createResponse(200, "success", metrics));
        } catch (error) {
            console.error("Lỗi khi lấy số liệu mạng xã hội:", error);
            res.status(500).json(
                createErrorResponse(500, error.message || "Lỗi server nội bộ")
            );
        }
    },
};

export default shareController;