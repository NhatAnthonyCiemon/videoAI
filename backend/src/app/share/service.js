import prisma from "../../config/database/db.config.js";
import { google } from "googleapis";
import fetch from "node-fetch";
import oauthConfig from "../../config/oauthConfig.js";

// Kiểm tra YOUTUBE_API_KEY
if (!process.env.YOUTUBE_API_KEY) {
    console.error("Lỗi: YOUTUBE_API_KEY không được định nghĩa trong .env");
    throw new Error("YOUTUBE_API_KEY is required");
}

const youtube = google.youtube({ version: "v3", auth: process.env.YOUTUBE_API_KEY });

const Share = {
    saveShareUrl: async (videoId, userId, platform, url) => {
        try {
            const video = await prisma.videos.findUnique({
                where: { id: videoId },
            });

            if (!video) {
                throw new Error("Video không tồn tại");
            }

            if (video.user_id !== userId) {
                throw new Error("Bạn không có quyền lưu URL chia sẻ cho video này");
            }

            const existingShare = await prisma.share_url.findUnique({
                where: { id: videoId },
            });

            const shareData = {
                id: videoId,
                user_id: userId,
                [`url_${platform}`]: url,
            };

            if (existingShare) {
                await prisma.share_url.update({
                    where: { id: videoId },
                    data: {
                        [`url_${platform}`]: url,
                    },
                });
            } else {
                await prisma.share_url.create({
                    data: shareData,
                });
            }
        } catch (error) {
            console.error("Lỗi khi lưu URL chia sẻ:", error);
            throw new Error(error.message || "Lỗi khi lưu URL chia sẻ");
        }
    },

    getShareUrl: async (videoId, userId) => {
        try {
            const share = await prisma.share_url.findUnique({
                where: { id: videoId },
                select: {
                    url_youtube: true,
                    url_facebook: true,
                    url_tiktok: true,
                },
            });

            if (!share) {
                return null;
            }

            return share;
        } catch (error) {
            console.error("Lỗi khi lấy URL chia sẻ:", error);
            throw new Error(error.message || "Lỗi khi lấy URL chia sẻ");
        }
    },

    getSocialMetrics: async (videoId, userId) => {
        try {
            const share = await prisma.share_url.findUnique({
                where: { id: videoId },
            });

            if (!share || share.user_id !== userId) {
                return {
                    youtube: null,
                    facebook: null,
                    tiktok: null,
                };
            }

            let youtubeMetrics = null;
            let facebookMetrics = null;

            // Lấy số liệu YouTube
            if (share.url_youtube) {
                console.log("Lấy số liệu YouTube cho URL:", share.url_youtube);
                const videoIdMatch = share.url_youtube.match(/v=([^&]+)/);
                if (videoIdMatch) {
                    const youtubeVideoId = videoIdMatch[1];
                    console.log("YouTube Video ID:", youtubeVideoId);
                    const youtubeResponse = await youtube.videos.list({
                        part: "statistics",
                        id: youtubeVideoId,
                    });
                    console.log("Phản hồi YouTube API:", youtubeResponse.data);
                    const videoData = youtubeResponse.data.items?.[0]?.statistics;
                    if (videoData) {
                        youtubeMetrics = {
                            views: parseInt(videoData.viewCount || "0"),
                            likes: parseInt(videoData.likeCount || "0"),
                        };
                    }
                } else {
                    console.warn("Không thể trích xuất YouTube Video ID từ URL:", share.url_youtube);
                }
            }

            // Lấy số liệu Facebook
            if (share.url_facebook) {
                console.log("Lấy số liệu Facebook cho URL:", share.url_facebook);
                const user = await prisma.users.findUnique({ where: { id: userId } });
                if (user && user.facebookaccesstoken) {
                    const facebookVideoId = share.url_facebook.split("/").pop();  
                    console.log(`https://graph.facebook.com/v23.0/${facebookVideoId}?fields=likes.summary(true),video_insights&access_token=${user.facebookaccesstoken}`)                  
                    const facebookResponse = await fetch(
                        `https://graph.facebook.com/v23.0/${facebookVideoId}?fields=likes.summary(true),video_insights&access_token=${user.facebookaccesstoken}`
                    );
                    const facebookData = await facebookResponse.json();
                    console.log(facebookData)
                    if (!facebookData.error) {
                        const viewsMetric = facebookData.video_insights?.data.find(
                            (insight) => insight.name === "total_video_views"
                        );
                        facebookMetrics = {
                            views: viewsMetric ? parseInt(viewsMetric.values[0].value) : 0,
                            likes: facebookData.likes?.summary?.total_count || 0,
                        };
                    } else {
                        console.warn("Lỗi Facebook API:", facebookData.error);
                    }
                } else {
                    console.warn("Không tìm thấy Facebook access token cho user:", userId);
                }
            }

            return {
                youtube: youtubeMetrics,
                facebook: facebookMetrics,
                tiktok: null, // Chưa hỗ trợ TikTok
            };
        } catch (error) {
            console.error("Lỗi khi lấy số liệu mạng xã hội:", error);
            throw new Error(error.message || "Lỗi khi lấy số liệu mạng xã hội");
        }
    },
};

export default Share;