import { Client } from "@gradio/client"; // Import Client từ @gradio/client

//const User = require("./service");
import User from "./service.js";
import {
    createResponse,
    createErrorResponse,
} from "../../utils/responseAPI.js";
const userController = {
    textToSpeech: async (req, res) => {
        try {
            const { text, voice, rate, pitch, num_lines = 1 } = req.body;

            const client = await Client.connect("Luongsosad/tts");
            const result = await client.predict("/tts_interface", {
                text,
                voice,
                rate,
                pitch,
                num_lines,
            });

            // Lọc bỏ giá trị null và lấy URL file âm thanh
            const audioData = result.data?.filter((item) => item !== null)[0];
            if (!audioData || !audioData.url) {
                throw new Error("Audio URL not found");
            }

            // Gửi URL của file âm thanh đến frontend
            res.json({ audioUrl: audioData.url });
        } catch (err) {
            console.error("Gradio TTS error:", err);
            res.status(500).send("Error processing Gradio TTS");
        }
    },
    // getAllUsers: async (req, res) => {
    //     const users = await User.getAll();
    //     res.json(users);
    // },

    getUser: async (req, res) => {
        if (!req.user) {
            console.log("User not found", req.user);
            res.json(createErrorResponse(401, "Unauthorized"));
        } else {
            console.log("User data retrieved successfully", req.user);
            res.json(
                createResponse(200, "success", {
                    id: req.user.id,
                    email: req.user.email,
                    username: req.user.username,
                    image: req.user.image,
                })
            );
        }
    },
};

export default userController;
