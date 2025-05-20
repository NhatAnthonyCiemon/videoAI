import { Client } from "@gradio/client"; // Import Client từ @gradio/client

// Hàm kết nối và xử lý TTS
export const processTextToSpeech = async ({
    text,
    voice,
    rate,
    pitch,
    num_lines = 1,
}) => {
    try {
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

        return audioData.url; // Trả về URL của file âm thanh
    } catch (err) {
        console.error("Gradio TTS error:", err);
        throw new Error("Error processing Gradio TTS");
    }
};
