import express from "express";
const router = express.Router();
// const contentController = require("./controller");
import contentController from "./controller.js";
import middleware from "../../middleware/index.js";

router.use(middleware.isAuthenticated);
router.post("/", contentController.getContentData);
router.post("/getcontentimage", contentController.getContentDataWithImage);
router.post("/regenerateimage", contentController.getReGenerateImage);
router.post("/createvideo", contentController.handleVideoController);
// module.exports = router;
export default router;
