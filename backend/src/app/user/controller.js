
import { Client } from "@gradio/client"; // Import Client từ @gradio/client

//const User = require("./service");
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
  
};
export default userController;
