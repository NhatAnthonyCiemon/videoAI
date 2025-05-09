import Video from "@/types/Video";
import HttpMethod from "@/types/httpMethos";
import fetchApi from "@/lib/api/fetch";

const videoClass = {
    generateVideo: async (id: string) => {
        try {
            const response = await fetchApi<Video>(
                `http://localhost:4000/video/${id}`,
                HttpMethod.GET
            );
            if (response.status === 200) {
                const video = response.data;
                return video;
            }
            throw new Error("Failed to fetch video data");
        } catch (error) {
            console.error("Error fetching video:", error);
            throw error;
        }
    },
    updateVideo: <K extends keyof Video>(
        data: Video,
        prop: K,
        value: Video[K]
    ): Video => {
        const newData: Video = structuredClone(data); // Modern, safe for nested
        if (prop in newData) {
            newData[prop] = value;
            return newData;
        } else {
            throw new Error(`Property ${String(prop)} does not exist on Video`);
        }
    },
};

export default videoClass;
