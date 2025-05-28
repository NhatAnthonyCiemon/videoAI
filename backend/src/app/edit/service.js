import prisma from "../../config/database/db.config.js";
const Edit = {
    getMusic: async () => {
        const musics = await prisma.music_system.findMany();
        return musics;
    },
    setSticker: async () => {
        const stickers = await prisma.sticker_system.findMany();
        return stickers;
    },
};

export default Edit;
