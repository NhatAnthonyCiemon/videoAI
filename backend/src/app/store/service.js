const prisma = require("../../config/database/db.config");

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
};

module.exports = Store;
