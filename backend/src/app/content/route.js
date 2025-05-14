import express from "express";
const router = express.Router();
// const contentController = require("./controller");
import contentController from "./controller.js";

router.post("/", contentController.getContentData);
router.post("/getcontentimage", contentController.getContentDataWithImage);
router.post("/regenerateimage", contentController.getReGenerateImage);
// module.exports = router;
export default router;
