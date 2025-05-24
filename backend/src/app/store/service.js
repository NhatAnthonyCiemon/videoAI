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
        voice_info,
        url = "",
        view = 0
    ) => {
        try {
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
                        keyword: keyword || "",
                    },
                });
                await prisma.voice_info.update({
                    where: { video_id: id },
                    data: {
                        voice: voice_info.voice,
                        rate: voice_info.rate,
                        pitch: voice_info.pitch,
                    },
                });
                return true;
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
            await prisma.videos.create({
                data: data,
            });

            await prisma.voice_info.create({
                data: {
                    video_id: id,
                    voice: voice_info.voice,
                    rate: voice_info.rate,
                    pitch: voice_info.pitch,
                },
            });
            return true;
        } catch (error) {
            console.error("Error saving data:", error);
            return false;
        }
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
        image_video,
        voice_info
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
            await prisma.voice_info.update({
                where: { video_id: id },
                data: {
                    voice: voice_info.voice,
                    rate: voice_info.rate,
                    pitch: voice_info.pitch,
                },
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
        await prisma.voice_info.create({
            data: {
                video_id: id,
                voice: voice_info.voice,
                rate: voice_info.rate,
                pitch: voice_info.pitch,
            },
        });
        return true;
    },
    saveDataWithVideo: async (
        id,
        user_id,
        name,
        category,
        step,
        content,
        keyword,
        image_video,
        voice_info,
        url
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
                    url: url,
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
                    start_time: item.start_time,
                    end_time: item.end_time,
                })),
            });
            await prisma.voice_info.update({
                where: { video_id: id },
                data: {
                    voice: voice_info.voice,
                    rate: voice_info.rate,
                    pitch: voice_info.pitch,
                },
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
            url: url,
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
                start_time: item.start_time,
                end_time: item.end_time,
            })),
        });
        await prisma.voice_info.create({
            data: {
                video_id: id,
                voice: voice_info.voice,
                rate: voice_info.rate,
                pitch: voice_info.pitch,
            },
        });
        return true;
    },
};

export default Store;
