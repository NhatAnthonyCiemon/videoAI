import express from "express";
const router = express.Router();
import videoController from "./controller.js";
import middleware from "../../middleware/index.js";

router.get("/:id", middleware.isAuthenticated, videoController.getVideoById);

export default router;
