import express from "express";
const router = express.Router();
// const storeController = require("./controller");
import storeController from "./controller.js";

router.post("/fullcontent", storeController.saveFullContentData);
router.post("/image", storeController.saveImage);
router.post("/video", storeController.saveVideo);
export default router;
