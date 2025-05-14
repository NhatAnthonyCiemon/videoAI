// const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    getInstagramTrendsViaGoogle,
    getXTrendsViaGoogle,
    getTiktokTrendsViaGoogle,
    getYoutubeTrendsViaGoogle,
} from "./search.js";
import dotenv from "dotenv";
import {
    createResponse,
    createErrorResponse,
} from "../../utils/responseAPI.js";
dotenv.config();

const key = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(key);
const trendController = {
    getTrendDataAI: async (req, res) => {
        try {
            const { keyword, platform } = req.body;
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
            });
            const prompt = `Based on the keyword "${keyword}", generate a JSON array of trending topics on the platform "${platform}" in the following format: [{"trend": "..."}, {"trend": "..."}]. Only return the JSON array.`;
            const response = await model.generateContent(prompt);
            const result = response.response;
            let rawText = result.text();
            rawText = rawText
                .replace(/```json/g, "") // Loại bỏ ```json
                .replace(/```/g, "") // Loại bỏ ```
                .replace(/Trend data:\s*/g, ""); // Loại bỏ "Trend data: "
            console.log("Raw text:", rawText); // Log the raw text for debugging
            const arrayTrends = JSON.parse(rawText).map((item) => {
                return item.trend;
            });
            res.json({
                mes: "success",
                status: 200,
                data: arrayTrends,
            });
        } catch (error) {
            console.error("Error fetching trend data:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    getTrendDataGoogle: async (req, res) => {
        const { keyword, platform } = req.body;
        console.log("keyword", keyword);
        console.log("platform", platform);
        if (!keyword || !platform) {
            return res
                .status(400)
                .json(createErrorResponse(400, "Fall keyword and platform"));
        }
        try {
            if (platform === "Instagram") {
                const trends = await getInstagramTrendsViaGoogle(keyword);
                return res.json(createResponse(200, "Success", trends));
            }
            if (platform === "Twitter") {
                const trends = await getXTrendsViaGoogle(keyword);
                return res.json(createResponse(200, "Success", trends));
            }
            if (platform === "Tiktok") {
                const trends = await getTiktokTrendsViaGoogle(keyword);
                return res.json(createResponse(200, "Success", trends));
            }
            if (platform === "Youtube") {
                const trends = await getYoutubeTrendsViaGoogle(keyword);
                return res.json(createResponse(200, "Success", trends));
            }
        } catch (error) {
            console.error("Error fetching trend data:", error);
            return res
                .status(500)
                .json(createErrorResponse(500, "Internal Server Error"));
        }
    },
};

export default trendController;
