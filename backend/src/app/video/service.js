import prisma from "../../config/database/db.config.js";
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

            await prisma.videos.delete({
                where: { id: videoId },
            });
        } catch (error) {
            console.error(error);
            throw new Error(error.message || 'Lỗi khi xóa video');
        }
    },
};

export default Video;
