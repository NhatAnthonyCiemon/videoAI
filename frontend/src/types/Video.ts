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
};

type Image_video = {
    content: string;
    url: string;
    prompt: string;
};
export default Video;
export type { Image_video };
