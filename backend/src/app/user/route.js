import express from "express";
const router = express.Router();
import userController from "./controller.js";
import middleware from "../../middleware/index.js";

router.get("/", middleware.isAuthenticated, userController.getUser);
//router.get("/login", contentController.login);
//router.get("/register", contentController.register);

export default router;
