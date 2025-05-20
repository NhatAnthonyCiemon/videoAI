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
                    },
                },
            },
        });
        return video;
    },
};

export default Video;
