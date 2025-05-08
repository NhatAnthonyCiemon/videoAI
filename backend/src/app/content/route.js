const express = require("express");
const router = express.Router();
const contentController = require("./controller");

router.post("/", contentController.getContentData);
router.post("/getContentImage", contentController.getContentDataWithImage);
module.exports = router;
