import express from "express";
import userController from "./controller.js";
import handleVideoController from "./controller/renVideoController.js";

const router = express.Router();

router.post("/api_voice", userController.textToSpeech);
router.post("/api_video", handleVideoController);
//router.get('/', userController.getAllUsers)
//router.get("/login", userController.login);
//router.get("/register", userController.register);

import userController from "./controller.js";
import middleware from "../../middleware/index.js";

router.get("/", middleware.isAuthenticated, userController.getUser);
//router.get("/login", contentController.login);
//router.get("/register", contentController.register);

export default router;
