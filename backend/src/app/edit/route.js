import express from "express";
const router = express.Router();
import editController from "./controller.js";

router.get("/music", editController.getMusicSystem);
router.get("/sticker", editController.getStickerSystem);
router.post("/export", editController.export);

export default router;
