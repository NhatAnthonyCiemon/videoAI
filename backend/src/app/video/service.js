const prisma = require("../../config/database/db.config");
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
                    },
                },
            },
        });
        return video;
    },
};

module.exports = Video;
