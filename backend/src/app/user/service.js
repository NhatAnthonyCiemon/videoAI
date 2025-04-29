const prisma = require("../../config/database/db.config");
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
