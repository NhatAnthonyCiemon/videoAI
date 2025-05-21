const express = require("express");
const router = express.Router();
const editController = require("./controller");

router.post("/export", editController.export);

module.exports = router;
