import express from "express";
const router = express.Router();
import videoController from "./controller.js";
import middleware from "../../middleware/index.js";

router.get('/getRandomVideos', middleware.isAuthenticated, videoController.getRandomVideos);
router.get('/getVideoData', middleware.isAuthenticated, videoController.getVideoData);
router.get('/getVideoDataFull', middleware.isAuthenticated, videoController.getVideoDataFull);
router.post('/renameVideo/:id', middleware.isAuthenticated, videoController.renameVideo);
router.get('/suggestions', middleware.isAuthenticated, videoController.getSuggestions);
router.delete('/deleteVideo/:id', middleware.isAuthenticated, videoController.deleteVideo);
router.post('/uploadYoutube', middleware.isAuthenticated, videoController.uploadVideoToYouTube);
router.post('/uploadFacebook', middleware.isAuthenticated, videoController.uploadVideoToFacebook);
router.get('/getVideoInfo/:id', middleware.isAuthenticated, videoController.getVideoInfo);
router.get("/:id", middleware.isAuthenticated, videoController.getVideoById);

export default router;
