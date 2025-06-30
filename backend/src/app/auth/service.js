import prisma from "../../config/database/db.config.js";
// const bcrypt = require("bcrypt");
import bcrypt from "bcrypt";
import oauthConfig from "../../config/oauthConfig.js";

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

    findUserById: async (id) => {
        const user = await prisma.users.findUnique({
            where: { id },
        });
        return user;
    },

    updateYoutubeTokens: async (userId, { accessToken, refreshToken, expiryDate }) => {
        try {
            const parsedUserId = parseInt(userId, 10); // Chuyển userId thành integer
            if (isNaN(parsedUserId)) {
                throw new Error("Invalid userId: must be a valid integer");
            }
            console.log("Updating tokens for userId:", parsedUserId);
            console.log("Token data:", { accessToken, refreshToken, expiryDate });

            const existingUser = await prisma.users.findUnique({
                where: { id: parsedUserId },
            });
            if (!existingUser) {
                throw new Error(`User with id ${parsedUserId} not found`);
            }

            const user = await prisma.users.update({
                where: { id: parsedUserId },
                data: {
                    youtubeaccesstoken: accessToken,
                    youtuberefreshtoken: refreshToken,
                    youtubetokenexpiry: expiryDate,
                },
            });
            console.log("Updated user:", user);
            return user;
        } catch (error) {
            console.error("Error updating YouTube tokens:", error);
            throw new Error(`Lỗi khi cập nhật token YouTube: ${error.message}`);
        }
    },

    refreshYoutubeToken: async (userId) => {
        try {
            const user = await prisma.users.findUnique({ where: { id: userId } });
            if (!user || !user.youtubeRefreshToken) {
                throw new Error("Không tìm thấy refresh token");
            }

            oauthConfig.youtube.setCredentials({ refresh_token: user.youtubeRefreshToken });
            const { credentials } = await oauthConfig.youtube.refreshAccessToken();
            await prisma.users.update({
                where: { id: userId },
                data: {
                    youtubeAccessToken: credentials.access_token,
                    youtubeTokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
                },
            });
            return credentials.access_token;
        } catch (error) {
            throw new Error(`Lỗi khi làm mới token YouTube: ${error.message}`);
        }
    },

    updateFacebookTokens: async (userId, { accessToken, expiresIn }) => {
        try {
            const parsedUserId = parseInt(userId, 10);
            if (isNaN(parsedUserId)) {
                throw new Error("Invalid userId: must be a valid integer");
            }
            console.log("Updating Facebook tokens for userId:", parsedUserId);
            console.log("Token data:", { accessToken, expiresIn });

            const existingUser = await prisma.users.findUnique({
                where: { id: parsedUserId },
            });
            if (!existingUser) {
                throw new Error(`User with id ${parsedUserId} not found`);
            }

            const user = await prisma.users.update({
                where: { id: parsedUserId },
                data: {
                    facebookaccesstoken: accessToken,
                    facebooktokenexpiry: expiresIn,
                },
            });
            console.log("Updated user:", user);
            return user;
        } catch (error) {
            console.error("Error updating Facebook tokens:", error);
            throw new Error(`Lỗi khi cập nhật token Facebook: ${error.message}`);
        }
    },

    refreshFacebookToken: async (userId) => {
        try {
            const user = await prisma.users.findUnique({ where: { id: userId } });
            if (!user || !user.facebookaccesstoken) {
                throw new Error("Không tìm thấy token truy cập Facebook");
            }

            // Thử đổi token hiện tại thành token dài hạn mới
            const response = await fetch(
                `https://graph.facebook.com/v23.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${oauthConfig.facebook.clientId}&client_secret=${oauthConfig.facebook.clientSecret}&fb_exchange_token=${user.facebookaccesstoken}`
            );
            const tokenData = await response.json();

            if (!tokenData.access_token) {
                throw new Error("Không thể làm mới token Facebook");
            }

            // Cập nhật token mới vào cơ sở dữ liệu
            await prisma.users.update({
                where: { id: userId },
                data: {
                    facebookaccesstoken: tokenData.access_token,
                    facebooktokenexpiry: tokenData.expires_in
                        ? new Date(Date.now() + tokenData.expires_in * 1000)
                        : null,
                },
            });

            return tokenData.access_token;
        } catch (error) {
            console.error("Lỗi khi làm mới token Facebook:", error);
            throw new Error(`Lỗi khi làm mới token Facebook: ${error.message}`);
        }
    },

    getUserById: async (id) => {
        const user = await prisma.users.findUnique({
            where: { id },
        });
        return user;
    },
    updatePassword: async (id, password) => {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await prisma.users.update({
            where: { id },
            data: { password: hashedPassword },
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
                verificationtoken: Token,
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
    getById: async (id) => {
        const user = await prisma.users.findUnique({
            where: { id },
        });
        return user;
    },
    verifyUser: async (Token) => {
        const user = await prisma.users.findUnique({
            where: { verificationtoken: Token },
        });
        if (!user) {
            return null;
        }
        const updatedUser = await prisma.users.update({
            where: { id: user.id },
            data: {
                is_verify: true,
            },
        });
        return updatedUser;
    },
};

export default User;
