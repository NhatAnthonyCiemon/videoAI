const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const key = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(key);
const trendController = {
    getTrendData: async (req, res) => {
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
    // getTrendData: async (req, res) => {
};

module.exports = trendController;
