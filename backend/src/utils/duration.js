import ffmpeg from "fluent-ffmpeg";
import ffprobeStatic from "ffprobe-static";

ffmpeg.setFfprobePath(ffprobeStatic.path);

export const getDurations = async (mp3Urls) => {
    try {
        const durations = await Promise.all(
            mp3Urls.map((url) => {
                return new Promise((resolve, reject) => {
                    ffmpeg.ffprobe(url, (err, metadata) => {
                        if (err) {
                            reject(err);
                        } else {
                            const duration = metadata.format.duration; // Thời lượng file MP3
                            resolve(duration);
                        }
                    });
                });
            })
        );
        return durations; // Trả về mảng thời gian
    } catch (error) {
        console.error("Error getting durations:", error);
        throw new Error("Failed to get durations for MP3 files");
    }
};
