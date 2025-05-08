const express = require("express");
const router = express.Router();
const trendController = require("./controller");

router.post("/", trendController.getTrendData);
module.exports = router;
