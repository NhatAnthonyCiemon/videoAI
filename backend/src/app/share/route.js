import express from "express";
const router = express.Router();
import shareController from "./controller.js";
import middleware from "../../middleware/index.js";

router.post("/save", middleware.isAuthenticated, shareController.saveShareUrl);
router.get("/get/:videoId", middleware.isAuthenticated, shareController.getShareUrl);
router.get("/metrics/:videoId", middleware.isAuthenticated, shareController.getSocialMetrics);

export default router;