const express = require("express");
const router = express.Router();
const videoController = require("./controller");

router.get("/:id", videoController.getVideoById);

module.exports = router;
