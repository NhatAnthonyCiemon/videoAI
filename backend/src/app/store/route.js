const express = require("express");
const router = express.Router();
const storeController = require("./controller");

router.post("/fullcontent", storeController.saveFullContentData);
router.post("/image", storeController.saveImage);
module.exports = router;
