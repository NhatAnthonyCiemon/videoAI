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
    url_edit: string;
    is_custom_voice: boolean;
    duration: number;
    thumbnail: string;
    quality: string;
    is_bg_music: boolean;
};

type Image_video = {
    file_mp3: File;
    url_mp3: string;
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
    id: number;
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

function AddNewSubtitle(text: string, currentList: Subtitle[] = [], start_time: number = -1, end_time: number = -1, id = -1): Subtitle {
    const lastSubtitle = currentList[currentList.length - 1];
    const startTime = lastSubtitle ? lastSubtitle.end : 0;

    return {
        id,
        text,
        start: start_time < 0 ? startTime : start_time,
        end: end_time < 0 ? startTime + 1 : end_time,
        style: {
            width: 800,
            position: "bottom",
            fontSize: 24,
            fontColor: "#FFFFFF@1.0",
            backgroundColor: "#000000@0.5",
            fontStyle: [],
            alignment: "center",
            shadow: {
                color: "#000000",
                blur: 2,
                offsetX: 1,
                offsetY: 1,
            },
            outline: {
                color: "#000000",
                width: 1,
            },
        },
        status: true,
    };
}

function AddNewMusic(id: number, name: string, data: string, currentList: Music[] = []): Music {
    const lastMusic = currentList[currentList.length - 1];
    const startTime = lastMusic ? lastMusic.end : 0;

    return {
        id,
        name,
        data,
        start: startTime,
        end: startTime + 1,
        volume: 0.5,
        duration: 0,
        status: true,
    };
}

function AddNewSticker(id: number, name: string, data: string, currentList: Sticker[] = []): Sticker {
    const lastSticker = currentList[currentList.length - 1];
    const startTime = lastSticker ? lastSticker.end : 0;

    return {
        id,
        name,
        data,
        start: startTime,
        end: startTime + 1,
        style: {
            width: 100,
            height: 100,
            rotate: 0,
            position: {
                x: 200,
                y: 200,
            },
        },
        status: true,
    };
}

// Export all types for use in other modules
export default Video;
export type { Music, Sticker, Subtitle, Image_video, Voice_info, Music_System, Sticker_System };
export { AddNewSubtitle, AddNewMusic, AddNewSticker };