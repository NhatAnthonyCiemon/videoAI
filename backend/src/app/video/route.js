import express from "express";
const router = express.Router();
import videoController from "./controller.js";
import middleware from "../../middleware/index.js";

router.get('/getRandomVideos', middleware.isAuthenticated, videoController.getRandomVideos);
router.get('/getVideoData', middleware.isAuthenticated, videoController.getVideoData);
router.post('/renameVideo/:id', middleware.isAuthenticated, videoController.renameVideo);
router.get('/suggestions', middleware.isAuthenticated, videoController.getSuggestions);
router.get("/:id", middleware.isAuthenticated, videoController.getVideoById);

export default router;
