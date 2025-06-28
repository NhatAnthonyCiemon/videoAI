import prisma from "../../config/database/db.config.js";

const animService = {
    getAllAnimations: async () => { 
        try {
            const animations = await prisma.animation.findMany({
                orderBy: {
                    id_anim: 'asc',
                },
            });
            return animations;
        } catch (error) {
            console.error("Error fetching animations:", error);
            throw error;
        }
    },
    getNameAnimation: async (id) => {
        try {
            const animation = await prisma.animation.findUnique({
                where: { id_anim: id },
                select: { name: true },
            });
            return animation ? animation.name : null;
        } catch (error) {
            console.error("Error fetching animation name:", error);
            throw error;
        }
    }
};
export default animService;