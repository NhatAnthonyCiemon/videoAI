// const prisma = require("../../config/database/db.config");
import prisma from "../../config/database/db.config.js";
// const bcrypt = require("bcrypt");
import bcrypt from "bcrypt";
const User = {
    findUserBySocialId: async (socialId) => {
        const user = await prisma.users.findUnique({
            where: { social_id: socialId },
        });
        return user;
    },
    findUserByEmail: async (email) => {
        const user = await prisma.users.findUnique({
            where: { email },
        });
        return user;
    },
    createUserGoogle: async (fullName, socialId, email, image) => {
        const user = await prisma.users.create({
            data: {
                username: fullName,
                social_id: socialId,
                type: "google",
                is_verify: true,
                image: image || "/img/avatar_placeholder.png",
                is_verify: true,
                email,
            },
        });
        return user;
    },
    createUserGithub: async (fullName, socialId, email, image) => {
        const user = await prisma.users.create({
            data: {
                username: fullName,
                social_id: socialId,
                type: "github",
                is_verify: true,
                image: image || "/img/avatar_placeholder.png",
                is_verify: true,
                email,
            },
        });
        return user;
    },
    createUserLocal: async (email, username, password, Token) => {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await prisma.users.create({
            data: {
                email,
                username,
                password: hashedPassword,
                verificationToken: Token,
                type: "local",
                image: "/img/avatar_placeholder.png",
                is_verify: false,
            },
        });
        return user;
    },
    findUserByEmailAndPassWord: async (email, password) => {
        const user = await prisma.users.findFirst({
            where: { email },
        });

        if (!user) {
            return null;
        }
        const isMatch = bcrypt.compareSync(password, user.password);
        if (isMatch) {
            return user;
        }

        return null;
    },
};

export default User;
