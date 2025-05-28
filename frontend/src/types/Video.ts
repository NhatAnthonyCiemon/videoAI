type Video = {
    id: string;
    user_id: string;
    name: string;
    category: string;
    content: string;
    image_video: Image_video[];
    step: number;
    keyword: string;
    voice_info: Voice_info;
    url: string;
    music: Music[];
    sticker: Sticker[];
    subtitle: Subtitle[];
};

type Image_video = {
    content: string;
    url: string;
    prompt: string;
    start_time: number | undefined;
    end_time: number | undefined;
};
type Voice_info = {
    voice: string;
    rate: number;
    pitch: number;
};

// Interfaces for Music, Sticker, and Subtitle
interface Music {
    id: number;
    name: string;
    data: string;
    start: number;
    end: number;
    volume: number;
    duration: number;
    status: boolean;
}

interface Sticker {
    id: number;
    name: string;
    data: string;
    start: number;
    end: number;
    style: {
        width: number;
        height: number;
        rotate: number;
        position: {
            x: number;
            y: number;
        };
    };
    status: boolean;
}

interface Subtitle {
    text: string;
    start: number;
    end: number;
    style: {
        width: number;
        position: string;
        fontSize: number;
        fontColor: string;
        backgroundColor: string;
        fontStyle: string[];
        alignment: string;
        shadow: {
            color: string;
            blur: number;
            offsetX: number;
            offsetY: number;
        };
        outline: {
            color: string;
            width: number;
        };
    };
    status: boolean;
}

// Interfaces for Music, Sticker, and Subtitle
interface Music_System {
    id: number;
    url: string;
    name: string;
}

interface Sticker_System {
    id: number;
    url: string;
    name: string;
}

// Export all types for use in other modules
export default Video;
export type { Music, Sticker, Subtitle, Image_video, Voice_info, Music_System, Sticker_System };