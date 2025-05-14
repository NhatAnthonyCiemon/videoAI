import express from "express";
const router = express.Router();
import videoController from "./controller.js";

router.get("/:id", videoController.getVideoById);

export default router;
