import animService from './service.js';

const animController= {
    loadAllAnim: async(req, res) => {
       const animations = await animService.getAllAnimations();
         if (animations.length > 0) {
                res.json({
                 mes: "success",
                 status: 200,
                 data: animations,
                });
          } else {
                res.status(404).json({
                 mes: "No animations found",
                 status: 404,
                });
          }

    },
}
export default animController;