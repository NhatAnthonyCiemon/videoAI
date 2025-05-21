// const express = require("express");
import express from "express";
const router = express.Router();
import trendController from "./controller.js";

router.post("/AI", trendController.getTrendDataAI);
router.post("/google", trendController.getTrendDataGoogle);

export default router;
