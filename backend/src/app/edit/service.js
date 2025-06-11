import prisma from "../../config/database/db.config.js";

const Edit = {
    saveEditUrl: async (videoId, urlEdit) => {
        try {
            const updatedVideo = await prisma.videos.update({
                where: { id: videoId },
                data: { url_edit: urlEdit },
            });
            return updatedVideo;
        } catch (error) {
            console.error("Lỗi khi lưu url_edit:", error);
            throw error;
        }
    },

    getMusic: async () => {
        const musics = await prisma.music_system.findMany({
            where: {
                id_user: null
            }
        });
        return musics;
    },

    getMusicUser: async (id) => {
        const musics = await prisma.music_system.findMany({
            where: {
                id_user: id,
            },
        });
        return musics;
    },


    setSticker: async () => {
        const stickers = await prisma.sticker_system.findMany({
            where: {
                id_user: null
            }
        });
        return stickers;
    },

    getVideoDataEditById: async (video_id) => {
        const [subtitles, stickers, musics] = await Promise.all([
            prisma.subtitles.findMany({
                where: { video_id },
                // orderBy: { start_time: 'asc' },
            }),
            prisma.ticker.findMany({
                where: { video_id },
                include: { sticker_system: true },
                // orderBy: { start_time: 'asc' },
            }),
            prisma.music.findMany({
                where: { video_id },
                include: { music_system: true },
                // orderBy: { start_time: 'asc' },
            }),
        ]);

        return {
            subtitles: subtitles.map(sub => ({
                text: sub.content,
                start: sub.start_time.getTime() / 1000,
                end: sub.end_time.getTime() / 1000,
                style: {
                    width: 800,
                    position: sub.position ?? "bottom",
                    fontSize: parseInt(sub.font_size ?? "24"),
                    fontColor: sub.color ?? "#FFFFFF@1.0",
                    backgroundColor: sub.background_color ?? "#000000@0.5",
                    fontStyle: (sub.font_style ?? "").split(" ").filter(Boolean),
                    alignment: sub.align ?? "center",
                    shadow: (() => {
                        try {
                            const eff = JSON.parse(sub.effect ?? "{}");
                            return eff.shadow ?? { color: "#000000", blur: 2, offsetX: 1, offsetY: 1 };
                        } catch {
                            return { color: "#000000", blur: 2, offsetX: 1, offsetY: 1 };
                        }
                    })(),
                    outline: (() => {
                        try {
                            const eff = JSON.parse(sub.effect ?? "{}");
                            return eff.outline ?? { color: "#000000", width: 1 };
                        } catch {
                            return { color: "#000000", width: 1 };
                        }
                    })(),
                },
                status: sub.status,
            })),

            stickers: stickers.map(s => ({
                id: s.sticker_system?.id ?? 0,
                name: s.sticker_system?.name ?? "", // thêm name ở đây
                data: s.sticker_system?.url ?? "",
                start: s.start_time.getTime() / 1000,
                end: s.end_time.getTime() / 1000,
                style: {
                    width: s.width ?? 100,
                    height: s.height ?? 100,
                    rotate: 0,
                    position: {
                        x: s.po_x ?? 0,
                        y: s.po_y ?? 0,
                    },
                },
                status: s.status,
            })),


            musics: musics.map(m => ({
                id: m.music_system?.id ?? 0,
                name: m.music_system?.name ?? "", // thêm name ở đây
                data: m.music_system?.url ?? m.url ?? "",
                start: m.start_time.getTime() / 1000,
                end: m.end_time.getTime() / 1000,
                volume: m.volume ?? 0.5,
                duration: 0,
                status: m.status,
            })),

        };
    },

};

export default Edit;
