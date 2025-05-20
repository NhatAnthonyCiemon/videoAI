type Video = {
    id: string;
    user_id: string;
    name: string;
    category: string;
    content: string;
    image_video: {
        content: string;
        url: string;
        prompt: string;
    }[];
    step: number;
    keyword: string;
    voice_info: Voice_info;
    url: string;
};

type Image_video = {
    content: string;
    url: string;
    prompt: string;
};
type Voice_info = {
    voice: string;
    rate: number;
    pitch: number;
};
export default Video;
export type { Image_video, Voice_info };
