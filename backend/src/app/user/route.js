import express from "express";
import userController from "./controller.js";

import middleware from "../../middleware/index.js";

const router = express.Router();

router.post(
    "/api_voice",
    middleware.isAuthenticated,
    userController.textToSpeech
);

router.get("/", middleware.isAuthenticated, userController.getUser);

export default router;
