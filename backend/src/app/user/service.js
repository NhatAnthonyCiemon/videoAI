import prisma from "../../config/database/db.config.js";
const User = {
    getAll: async () => {
        const users = await prisma.user.findMany();
        return users;
    },
    getById: async (id) => {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        return user;
    },
};

module.exports = User;
