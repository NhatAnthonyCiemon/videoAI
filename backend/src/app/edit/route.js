import express from "express";
import multer from "multer";
const router = express.Router();
import editController from "./controller.js";

// Cấu hình multer để xử lý file upload
const upload = multer({ dest: "uploads/" });

router.post("/save", editController.save);
router.post("/save-video", editController.save_url_edit);
router.get("/music", editController.getMusicSystem);
router.get("/sticker", editController.getStickerSystem);
router.post("/export", editController.export);
router.get("/getdata/:video_id", editController.getData);

import middleware from "../../middleware/index.js";

router.use(middleware.isAuthenticated);
// Thêm hai endpoint upload
router.post("/upload-audio", upload.single("audio"), editController.uploadAudio);
router.post("/upload-image", upload.single("image"), editController.uploadImage);

export default router;