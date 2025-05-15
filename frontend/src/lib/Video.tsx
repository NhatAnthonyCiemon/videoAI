import Video from "@/types/Video";
import fetchApi from "./api/fetchServer";
import HttpMethod from "@/types/httpMethos";
const videoClass = {
    generateVideo: async (id: string, token: string) => {
        try {
            const response = await fetchApi<Video>(
                `http://localhost:4000/video/${id}`,
                HttpMethod.GET,
                token
            );
            if (response.status === 200) {
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            throw new Error("Unauthorized");
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
