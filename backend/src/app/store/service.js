// const prisma = require("../../config/database/db.config");
import prisma from "../../config/database/db.config.js";
const Store = {
    saveData: async (
        id,
        user_id,
        name,
        category,
        step,
        content,
        keyword,
        url = "",
        view = 0
    ) => {
        const video = await prisma.videos.findUnique({
            where: { id: id },
        });
        if (video) {
            return await prisma.videos.update({
                where: { id: id },
                data: {
                    category: category,
                    step: step,
                    content: content,
                    keyword: keyword,
                },
            });
        }
        const data = {
            id: id,
            user_id: user_id,
            name: name,
            category: category,
            created_at: new Date(),
            view: view,
            step: step,
            content: content,
            url: url,
            keyword: keyword,
        };
        const result = await prisma.videos.create({
            data: data,
        });
        return result;
    },
    findUserId: async (user_id) => {
        const result = await prisma.users.findUnique({
            where: { id: user_id },
        });
        return result;
    },
    saveDataWithImage: async (
        id,
        user_id,
        name,
        category,
        step,
        content,
        keyword,
        image_video
    ) => {
        const video = await prisma.videos.findUnique({
            where: { id: id },
        });
        if (video) {
            await prisma.videos.update({
                where: { id: id },
                data: {
                    category: category,
                    step: step,
                    content: content,
                    keyword: keyword,
                },
            });
            //xóa ảnh cũ
            await prisma.image_video.deleteMany({
                where: { video_id: id },
            });
            //thêm ảnh mới
            await prisma.image_video.createMany({
                data: image_video.map((item, index) => ({
                    video_id: id,
                    ordinal_number: index,
                    url: item.url,
                    content: item.content,
                    prompt: item.prompt,
                })),
            });
            return true;
        }
        const data = {
            id: id,
            user_id: user_id,
            name: name,
            category: category,
            created_at: new Date(),
            step: step,
            content: content,
            keyword: keyword,
        };
        await prisma.videos.create({
            data: data,
        });
        await prisma.image_video.createMany({
            data: image_video.map((item, index) => ({
                video_id: id,
                ordinal_number: index,
                url: item.url,
                content: item.content,
                prompt: item.prompt,
            })),
        });
        return true;
    },
};

export default Store;
