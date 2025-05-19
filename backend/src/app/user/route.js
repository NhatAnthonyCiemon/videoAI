import express from "express";
import userController from "./controller.js";
import handleVideoController from "./controller/renVideoController.js";

const router = express.Router();

router.post("/api_voice", userController.textToSpeech);
router.post("/api_video", handleVideoController);
//router.get('/', userController.getAllUsers)
//router.get("/login", userController.login);
//router.get("/register", userController.register);

export default router;
