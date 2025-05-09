const express = require("express");
const router = express.Router();
const contentController = require("./controller");

router.post("/", contentController.getContentData);
router.post("/getcontentimage", contentController.getContentDataWithImage);
router.post("/regenerateimage", contentController.getReGenerateImage);
module.exports = router;
