import prisma from "../../config/database/db.config.js";
import fetch from "node-fetch";
import { Readable } from "stream";
import { google } from "googleapis";
import oauthConfig from "../../config/oauthConfig.js";
import User from "../auth/service.js";

const youtube = google.youtube({ version: "v3", auth: oauthConfig.youtube });

const Video = {
    getById: async (id) => {
        const video = await prisma.videos.findUnique({
            where: { id },
            include: {
                image_video: {
                    select: {
                        content: true,
                        url: true,
                        prompt: true,
                        ordinal_number: true,
                        start_time: true,
                        end_time: true,
                        url_mp3: true, // Include url_mp3 if it exists
                        anim: true,
                    },
                },
                voice_info: {
                    select: {
                        voice: true,
                        rate: true,
                        pitch: true,
                    },
                },
            },
        });
        return video;
    },

    getVideoData: async (userId, page, limit, search, category, sort, status) => {
        try {
            const skip = (page - 1) * limit;

            // Xây dựng điều kiện where
            const where = {
                user_id: userId,
            };

            // Lọc theo từ khóa tìm kiếm (q)
            if (search && search.trim() !== '') {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } },
                    { keyword: { contains: search, mode: 'insensitive' } },
                ];
            }

            // Lọc theo danh mục
            if (category && category !== 'Tất cả danh mục') {
                // Ánh xạ category từ frontend (TikTok) sang database (Tiktok)
                const categoryMap = {
                    'TikTok': 'Tiktok',
                    'Instagram': 'Instagram',
                    'Youtube': 'Youtube',
                    'Twitter': 'Twitter',
                };
                const mappedCategory = categoryMap[category] || category;
                where.category = {
                    equals: mappedCategory,
                    mode: 'insensitive',
                };
            }

            // Lọc theo trạng thái (dựa trên step)
            if (status) {
                where.step = {
                    [status === 'completed' ? 'gte' : 'lt']: 2,
                };
            }

            // Xây dựng orderBy cho sắp xếp
            const orderBy = sort ? { created_at: sort } : { created_at: 'desc' };

            // Lấy danh sách video
            const videos = await prisma.videos.findMany({
                where,
                select: {
                    id: true,
                    url: true,
                    content: true,
                    name: true,
                    keyword: true,
                    step: true,
                    category: true,
                    created_at: true,
                    url_edit: true, // Added url_edit
                },
                skip,
                take: limit,
                orderBy,
            });

            // Đếm tổng số video
            const totalVideos = await prisma.videos.count({ where });

            // Định dạng dữ liệu video, ánh xạ ngược category từ database (Tiktok) sang frontend (TikTok)
            const categoryMapReverse = {
                'Tiktok': 'TikTok',
                'Instagram': 'Instagram',
                'Youtube': 'Youtube',
                'Twitter': 'Twitter',
            };

            const formattedVideos = videos.map((video) => ({
                id: video.id,
                url: video.url,
                subtitle: video.content,
                name: video.name,
                category: categoryMapReverse[video.category] || video.category,
                keyword: video.keyword,
                step: video.step >= 2 ? 'completed' : 'incomplete',
                created_at: video.created_at,
                url_edit: video.url_edit, // Added url_edit
            }));

            return {
                data: formattedVideos,
                totalPages: Math.ceil(totalVideos / limit),
            };
        } catch (error) {
            console.error(error);
            throw new Error('Lỗi khi lấy dữ liệu video');
        }
    },

    getVideoDataFull: async (page, limit, search, category, sort, status) => {
        try {
            const skip = (page - 1) * limit;

            // Xây dựng điều kiện where, không cần user_id
            const where = {};

            // Lọc theo từ khóa tìm kiếm (q)
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } },
                    { keyword: { contains: search, mode: 'insensitive' } },
                ];
            }

            // Lọc theo danh mục
            if (category && category !== 'Tất cả danh mục') {
                // Ánh xạ category từ frontend (TikTok) sang database (Tiktok)
                const categoryMap = {
                    'TikTok': 'Tiktok',
                    'Instagram': 'Instagram',
                    'Youtube': 'Youtube',
                    'Twitter': 'Twitter',
                };
                const mappedCategory = categoryMap[category] || category;
                where.category = {
                    equals: mappedCategory,
                    mode: 'insensitive',
                };
            }

            // Lọc theo trạng thái (dựa trên step)
            if (status) {
                where.step = {
                    [status === 'completed' ? 'gte' : 'lt']: 2,
                };
            }

            // Xây dựng orderBy cho sắp xếp
            const orderBy = sort ? { created_at: sort } : { created_at: 'desc' };

            // Lấy danh sách video
            const videos = await prisma.videos.findMany({
                where,
                select: {
                    id: true,
                    url: true,
                    content: true,
                    name: true,
                    keyword: true,
                    step: true,
                    category: true,
                    created_at: true,
                    url_edit: true,
                },
                skip,
                take: limit,
                orderBy,
            });

            // Đếm tổng số video
            const totalVideos = await prisma.videos.count({ where });

            // Định dạng dữ liệu video, ánh xạ ngược category từ database (Tiktok) sang frontend (TikTok)
            const categoryMapReverse = {
                'Tiktok': 'TikTok',
                'Instagram': 'Instagram',
                'Youtube': 'Youtube',
                'Twitter': 'Twitter',
            };

            const formattedVideos = videos.map((video) => ({
                id: video.id,
                url: video.url,
                subtitle: video.content,
                name: video.name,
                category: categoryMapReverse[video.category] || video.category,
                keyword: video.keyword,
                step: video.step >= 2 ? 'completed' : 'incomplete',
                created_at: video.created_at,
                url_edit: video.url_edit,
            }));

            return {
                data: formattedVideos,
                totalPages: Math.ceil(totalVideos / limit),
            };
        } catch (error) {
            console.error(error);
            throw new Error('Lỗi khi lấy dữ liệu video');
        }
    },

    getVideoInfo: async (videoId, userId) => {
        try {
            const video = await prisma.videos.findFirst({
                where: {
                    id: videoId,
                    user_id: userId,
                },
                select: {
                    id: true,
                    user_id: true,
                    name: true,
                    category: true,
                    created_at: true,
                    view: true,
                    content: true,
                    url: true,
                    step: true,
                    keyword: true,
                    url_edit: true,
                    is_custom_voice: true,
                    duration: true,
                    thumbnail: true,
                    quality: true,
                    is_bg_music: true,
                    image_video: true,
                    music: true,
                    subtitles: true,
                    ticker: true,
                    video_info: true,
                    voice_info: true,
                },
            });

            if (!video) {
                return null;
            }

            const categoryMapReverse = {
                Tiktok: "TikTok",
                Instagram: "Instagram",
                Youtube: "Youtube",
                Twitter: "Twitter",
            };

            return {
                id: video.id,
                user_id: video.user_id,
                name: video.name,
                category: categoryMapReverse[video.category] || video.category,
                created_at: video.created_at,
                view: video.view,
                subtitle: video.content,
                url: video.url,
                step: video.step >= 2 ? "completed" : "incomplete",
                keyword: video.keyword,
                url_edit: video.url_edit,
                is_custom_voice: video.is_custom_voice,
                duration: video.duration,
                thumbnail: video.thumbnail,
                quality: video.quality,
                is_bg_music: video.is_bg_music,
                image_video: video.image_video,
                music: video.music,
                subtitles: video.subtitles,
                ticker: video.ticker,
                video_info: video.video_info,
                voice_info: video.voice_info,
            };
        } catch (error) {
            console.error(error);
            throw new Error("Lỗi khi lấy thông tin video");
        }
    },

    uploadVideo: async (videoUrl, title, description, userId) => {
        try {
            const user = await prisma.users.findUnique({ where: { id: userId } });
            if (!user || !user.youtubeaccesstoken) {
                throw new Error("Người dùng chưa xác thực với YouTube");
            }

            // Kiểm tra token hết hạn
            if (user.youtubeTokenExpiry && new Date() >= new Date(user.youtubeTokenExpiry)) {
                const newAccessToken = await User.refreshYoutubeToken(userId);
                oauthConfig.youtube.setCredentials({ access_token: newAccessToken });
            } else {
                oauthConfig.youtube.setCredentials({ access_token: user.youtubeaccesstoken });
            }

            // Tải video từ Cloudinary
            const videoResponse = await fetch(videoUrl);
            if (!videoResponse.ok) throw new Error("Không thể tải video từ Cloudinary");

            const videoBuffer = await videoResponse.buffer();
            const videoStream = Readable.from(videoBuffer);

            // Đăng video lên YouTube
            const response = await youtube.videos.insert({
                part: "snippet,status",
                requestBody: {
                    snippet: {
                        title,
                        description,
                        tags: ["video", "cloudinary"],
                        categoryId: "22", // People & Blogs
                    },
                    status: { privacyStatus: "public" },
                },
                media: { body: videoStream },
            });

            return {
                id: response.data.id,
                youtubeUrl: `https://www.youtube.com/watch?v=${response.data.id}`,
            };
        } catch (error) {
            throw new Error(`Lỗi khi đăng video lên YouTube: ${error.message}`);
        }
    },

    uploadVideoToFacebook: async (videoUrl, title, description, userId) => {
        try {
            // Lấy thông tin người dùng
            const user = await prisma.users.findUnique({ where: { id: userId } });
            if (!user || !user.facebookaccesstoken) {
                throw new Error("Người dùng chưa xác thực với Facebook");
            }

            // Kiểm tra token hết hạn
            if (user.facebooktokenexpiry && new Date() >= new Date(user.facebooktokenexpiry)) {
                throw new Error("Token Facebook đã hết hạn. Vui lòng đăng nhập lại.");
            }

            // Kiểm tra quyền
            const tokenCheck = await fetch(`https://graph.facebook.com/v23.0/me/permissions?access_token=${user.facebookaccesstoken}`);
            const permissionsData = await tokenCheck.json();
            console.log("Permissions:", permissionsData);
            if (!permissionsData.data.some(perm => perm.permission === "publish_video" && perm.status === "granted")) {
                throw new Error("Token không có quyền publish_video");
            }
            if (!permissionsData.data.some(perm => perm.permission === "pages_manage_posts" && perm.status === "granted")) {
                throw new Error("Token không có quyền pages_manage_posts");
            }

            // Debug token
            console.log(`https://graph.facebook.com/v23.0/debug_token?input_token=${user.facebookaccesstoken}&access_token=${oauthConfig.facebook.clientId}|${oauthConfig.facebook.clientSecret}`)
            const tokenDebug = await fetch(`https://graph.facebook.com/v23.0/debug_token?input_token=${user.facebookaccesstoken}&access_token=${oauthConfig.facebook.clientId}|${oauthConfig.facebook.clientSecret}`);
            const debugData = await tokenDebug.json();
            console.log("Token debug:", debugData);

            // Lấy page_access_token
            const pageId = oauthConfig.facebook.pageId;
            if (!pageId) {
                throw new Error("PAGE_ID không được cấu hình trong biến môi trường");
            }
            const pageTokenResponse = await fetch(`https://graph.facebook.com/v23.0/${pageId}?fields=access_token&access_token=${user.facebookaccesstoken}`);
            const pageTokenData = await pageTokenResponse.json();
            console.log("Page token response:", { access_token: pageTokenData.access_token?.slice(0, 10) + "..." });
            if (!pageTokenData.access_token) {
                throw new Error("Không thể lấy page_access_token: " + (pageTokenData.error?.message || "Unknown error"));
            }
            const pageAccessToken = pageTokenData.access_token;

            // Kiểm tra videoUrl
            const videoResponse = await fetch(videoUrl);
            if (!videoResponse.ok) {
                throw new Error("Không thể tải video từ Cloudinary: " + videoResponse.statusText);
            }
            const contentType = videoResponse.headers.get("content-type");
            console.log("Video headers:", {
                contentType,
                contentLength: videoResponse.headers.get("content-length"),
            });
            if (!contentType.includes("video/mp4")) {
                throw new Error("Video phải ở định dạng MP4");
            }

            // Đăng video lên trang
            const queryParams = new URLSearchParams({
                title: title,
                description: description,
                file_url: videoUrl,
                access_token: pageAccessToken,
            });
            const response = await fetch(`https://graph.facebook.com/v23.0/${pageId}/videos?${queryParams.toString()}`, {
                method: "POST",
            });

            const responseData = await response.json();
            console.log("Facebook API response:", responseData);
            if (!response.ok || responseData.error) {
                const errorMsg = responseData.error
                    ? `Lỗi Facebook API: ${responseData.error.message} (Code: ${responseData.error.code})`
                    : `Lỗi khi đăng video: ${response.statusText}`;
                throw new Error(errorMsg);
            }

            return {
                id: responseData.id,
                facebookUrl: `https://www.facebook.com/${responseData.id}`,
            };
        } catch (error) {
            console.error("Upload error:", error);
            throw new Error(`Lỗi khi đăng video lên Facebook: ${error.message}`);
        }
    },

    getSuggestions: async (userId, query) => {
        try {
            const where = {
                user_id: userId,
            };

            // Lọc theo truy vấn nếu có
            if (query) {
                where.OR = [
                    { name: { contains: query, mode: 'insensitive' } },
                    { keyword: { contains: query, mode: 'insensitive' } },
                ];
            }

            // Lấy danh sách video để tạo gợi ý
            const videos = await prisma.videos.findMany({
                where,
                select: {
                    name: true,
                    keyword: true,
                },
                take: 50, // Giới hạn số video để xử lý
            });

            // Tạo danh sách gợi ý từ name và keyword
            const suggestions = Array.from(
                new Set(
                    videos
                        .flatMap((video) => [
                            video.name || '',
                            ...(video.keyword ? video.keyword.split(',').map((k) => k.trim()) : []),
                        ])
                        .filter((s) => s && (!query || s.toLowerCase().includes(query.toLowerCase())))
                        .slice(0, 5) // Giới hạn 5 gợi ý
                )
            );

            return suggestions;
        } catch (error) {
            console.error(error);
            throw new Error('Lỗi khi lấy gợi ý');
        }
    },

    getRandomVideos: async (limit, status) => {
        try {
            // Xây dựng điều kiện where
            const where = {};

            // Lọc theo trạng thái (dựa trên step)
            if (status) {
                where.step = {
                    [status === 'completed' ? 'gte' : 'lt']: 2,
                };
            }

            // Lấy ngẫu nhiên video
            const videos = await prisma.videos.findMany({
                where,
                select: {
                    id: true,
                    url: true,
                    content: true,
                    name: true,
                    keyword: true,
                    step: true,
                    category: true,
                    created_at: true,
                    url_edit: true,
                },
                take: limit,
                orderBy: {
                    id: 'asc', // Note: For true randomness, consider using raw SQL with random()
                },
            });

            // Ánh xạ category từ database (Tiktok) sang frontend (TikTok)
            const categoryMapReverse = {
                'Tiktok': 'TikTok',
                'Instagram': 'Instagram',
                'Youtube': 'Youtube',
                'Twitter': 'Twitter',
            };

            const formattedVideos = videos.map((video) => ({
                id: video.id,
                url: video.url,
                subtitle: video.content,
                name: video.name,
                category: categoryMapReverse[video.category] || video.category,
                keyword: video.keyword,
                step: video.step >= 2 ? 'completed' : 'incomplete',
                created_at: video.created_at,
                url_edit: video.url_edit,
            }));

            return {
                data: formattedVideos,
            };
        } catch (error) {
            console.error(error);
            throw new Error('Lỗi khi lấy dữ liệu video ngẫu nhiên');
        }
    },

    renameVideo: async (userId, videoId, newName) => {
        try {
            // Kiểm tra xem video có tồn tại và thuộc về user
            const video = await prisma.videos.findUnique({
                where: { id: videoId },
            });

            if (!video) {
                throw new Error('Video không tồn tại');
            }

            if (video.user_id !== userId) {
                throw new Error('Bạn không có quyền đổi tên video này');
            }

            // Cập nhật tên video
            await prisma.videos.update({
                where: { id: videoId },
                data: { name: newName },
            });
        } catch (error) {
            console.error(error);
            throw new Error(error.message || 'Lỗi khi đổi tên video');
        }
    },

    deleteVideo: async (userId, videoId) => {
        try {
            const video = await prisma.videos.findUnique({
                where: { id: videoId },
            });

            if (!video) {
                throw new Error('Video không tồn tại');
            }

            if (video.user_id !== userId) {
                throw new Error('Bạn không có quyền xóa video này');
            }

            await prisma.$transaction(async (prisma) => {
                await prisma.image_video.deleteMany({
                    where: { video_id: videoId },
                });

                await prisma.music.deleteMany({
                    where: { video_id: videoId },
                });

                await prisma.subtitles.deleteMany({
                    where: { video_id: videoId },
                });

                await prisma.ticker.deleteMany({
                    where: { video_id: videoId },
                });

                await prisma.video_info.deleteMany({
                    where: { video_id: videoId },
                });

                await prisma.voice_info.deleteMany({
                    where: { video_id: videoId },
                });

                await prisma.share_url.deleteMany({
                    where: { id: videoId },
                });

                await prisma.videos.delete({
                    where: { id: videoId },
                });
            });

            return { message: `Video ${videoId} đã được xóa thành công` };
        } catch (error) {
            console.error('Lỗi khi xóa video:', error);
            throw new Error(error.message || 'Lỗi khi xóa video');
        }
    },
};

export default Video;
