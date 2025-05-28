"use client";
import { useState, useEffect } from "react";
import SideBar from "../../../../components/ui/SideBar";
import VideoPreview from "../../../../components/ui/VideoPreview";
import FormatVideo from "../../../../components/ui/FormatVideo";
import SubtitleSetting from "../../../../components/ui/SubtitleSetting";
import MusicSetting from "../../../../components/ui/MusicSetting";
import StickerSetting from "../../../../components/ui/StickerSetting";
import Video from "@/types/Video";
import { Music_System, Sticker_System, Music, Sticker, Subtitle, Image_video } from "@/types/Video";

function AddNewSubtitle(text: string, currentList: Subtitle[] = [], start_time: number = -1, end_time: number = -1): Subtitle {
    const lastSubtitle = currentList[currentList.length - 1];
    const startTime = lastSubtitle ? lastSubtitle.end : 0;

    return {
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

export default function EditVideo({
    videoData,
    setVideoData,
    setWhichActive,
    musics_sys,
    setMusics_sys,
    stickers_sys,
    setStickers_sys,
    isPreparing,
    setIsPreparing,
}: {
    videoData: Video;
    setVideoData: (data: Video) => void;
    setWhichActive: (index: number) => void;
    musics_sys: Music_System[] | null;
    setMusics_sys: (data: Music_System[]) => void;
    stickers_sys: Sticker_System[] | null;
    setStickers_sys: (data: Sticker_System[]) => void;
    isPreparing: boolean;
    setIsPreparing: (Active: boolean) => void;
}) {
    const [url, setUrl] = useState(videoData.url ? videoData.url : "https://res.cloudinary.com/dphytbuah/video/upload/v1747805114/temp_output_with_audio_qijbww.mp4");
    const [selectedTool, setSelectedTool] = useState("subtitles");
    const [tab, setTab] = useState<string>("sticker");
    const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
    const [musics, setMusics] = useState<Music[]>([]);
    const [stickers, setStickers] = useState<Sticker[]>([]);
    const [idxText, setIdxText] = useState<number>(subtitles.length > 0 ? subtitles.length - 1 : -1);
    const [idxMusic, setIdxMusic] = useState<number>(musics.length > 0 ? musics.length - 1 : -1);
    const [idxSticker, setIdxSticker] = useState<number>(stickers.length > 0 ? stickers.length - 1 : -1);
    const [exportStatus, setExportStatus] = useState<string>(""); // State để hiển thị trạng thái export
    const [text, setText] = useState("");

    useEffect(() => {
        if (videoData && videoData.image_video) {
            const newSubtitles = videoData.image_video.map((item: Image_video, index: number) => {
                // Sử dụng item.content hoặc item.prompt làm nội dung phụ đề
                return AddNewSubtitle(item.content, subtitles, item.start_time, item.end_time);
            });
            // Gộp tất cả content thành 1 đoạn text
            const combinedText = videoData.image_video.map(item => item.content).join(" ");
            setText(combinedText);
            setSubtitles(newSubtitles);
            setIdxText(newSubtitles.length - 1); // Cập nhật idxText
        }
        console.log(musics)
    }, []); // Bao gồm subtitles trong dependency array

    const handleAddSubtitle = (text: string) => {
        const newSubtitle = AddNewSubtitle(text, subtitles);
        setSubtitles([...subtitles, newSubtitle]);
        setIdxText(subtitles.length);
    };

    const handleUpdateSubtitle = (updatedSubtitle: Subtitle) => {
        const updatedList = [...subtitles];
        updatedList[idxText] = updatedSubtitle;
        setSubtitles(updatedList);
        console.log(updatedSubtitle)
    };

    const handleDeleteSubtitle = (index: number) => {
        const updatedList = subtitles.filter((_, i) => i !== index);
        setSubtitles(updatedList);
        setIdxText(updatedList.length > 0 ? updatedList.length - 1 : -1);
    };

    const handleAddMusic = (id: number, name: string, data: string) => {
        const newMusic = AddNewMusic(id, name, data, musics);
        setMusics([...musics, newMusic]);
        setIdxMusic(musics.length);
    };

    const handleUpdateMusic = (updatedMusic: Music) => {
        const updatedList = [...musics];
        updatedList[idxMusic] = updatedMusic;
        setMusics(updatedList);
    };

    const handleDeleteMusic = (index: number) => {
        const updatedList = musics.filter((_, i) => i !== index);
        setMusics(updatedList);
        setIdxMusic(updatedList.length > 0 ? updatedList.length - 1 : -1);
    };

    const handleAddSticker = (id: number, name: string, data: string) => {
        const newSticker = AddNewSticker(id, name, data, stickers);
        setStickers([...stickers, newSticker]);
        setIdxSticker(stickers.length);
    };

    const handleUpdateSticker = (updatedSticker: Sticker) => {
        const updatedList = [...stickers];
        updatedList[idxSticker] = updatedSticker;
        setStickers(updatedList);
    };

    const handleDeleteSticker = (index: number) => {
        const updatedList = stickers.filter((_, i) => i !== index);
        setStickers(updatedList);
        setIdxSticker(updatedList.length > 0 ? updatedList.length - 1 : -1);
    };

    const handleExport = async () => {
        if (!url) {
            alert("Vui lòng cung cấp URL video chính!");
            return;
        }

        setExportStatus("Đang xử lý...");

        try {
            // Lọc các phần tử có status: true
            const activeSubtitles = subtitles.filter((sub) => sub.status);
            const activeMusics = musics.filter((music) => music.status);
            const activeStickers = stickers.filter((sticker) => sticker.status);

            // Chuẩn bị dữ liệu cho backend
            const script_input = JSON.stringify(
                activeSubtitles.map((sub) => ({
                    text: sub.text,
                    start: sub.start,
                    end: sub.end,
                    style: {
                        position: sub.style.position,
                        fontSize: sub.style.fontSize,
                        fontColor: sub.style.fontColor,
                        backgroundColor: sub.style.backgroundColor,
                        fontStyle: sub.style.fontStyle,
                        alignment: sub.style.alignment,
                        shadow: {
                            color: sub.style.shadow.color,
                            offsetX: sub.style.shadow.offsetX,
                            offsetY: sub.style.shadow.offsetY,
                        },
                        outline: {
                            color: sub.style.outline.color,
                            width: sub.style.outline.width,
                        },
                    },
                }))
            );

            const sticker_files = activeStickers.map((sticker) => sticker.data);
            const sticker_config = JSON.stringify(
                activeStickers.map((sticker) => ({
                    start: sticker.start,
                    end: sticker.end,
                    width: sticker.style.width,
                    height: sticker.style.height,
                    position: sticker.style.position,
                    rotate: sticker.style.rotate,
                }))
            );

            const audio_files = activeMusics.map((music) => music.data);
            const audio_config = JSON.stringify(
                activeMusics.map((music) => ({
                    start: music.start,
                    end: music.end,
                    volume: music.volume,
                }))
            );

            // Gửi yêu cầu tới backend
            const response = await fetch("http://localhost:4000/edit/export", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    video_file: url,
                    script_input,
                    sticker_files,
                    sticker_config,
                    audio_files,
                    audio_config,
                }),
            });

            if (!response.ok) {
                throw new Error("Backend API error");
            }

            const { video_url, status } = await response.json();

            setExportStatus(`Export thành công! Video: ${video_url}`);
            window.open(video_url, "_blank"); // Mở video trong tab mới
        } catch (err) {
            console.error("Export error:", err);
            setExportStatus("Lỗi khi export video. Vui lòng thử lại.");
        }
    };

    return (
        <div className="flex h-full w-full">
            {/* <SideBar selected={selectedTool} onSelect={setSelectedTool} /> */}
            <div className="bg-white w-[400px]">
                {selectedTool === "subtitles" && (
                    <SubtitleSetting
                        subtitles={subtitles}
                        onAdd={handleAddSubtitle}
                        onUpdate={handleUpdateSubtitle}
                        onDelete={handleDeleteSubtitle}
                        idxText={idxText}
                        setIdxText={setIdxText}
                    />
                )}
                {selectedTool === "music" && (
                    <MusicSetting
                        musics={musics}
                        onAdd={handleAddMusic}
                        onUpdate={handleUpdateMusic}
                        onDelete={handleDeleteMusic}
                        idxMusic={idxMusic}
                        setIdxMusic={setIdxMusic}
                        setTab={setTab}
                    />
                )}
                {selectedTool === "sticker" && (
                    <StickerSetting
                        stickers={stickers}
                        onAdd={handleAddSticker}
                        onUpdate={handleUpdateSticker}
                        onDelete={handleDeleteSticker}
                        idxSticker={idxSticker}
                        setIdxSticker={setIdxSticker}
                        setTab={setTab}
                    />
                )}
            </div>
            <div className="flex-1 h-full">
                <div className="pl-4 text-2xl flex gap-4 pt-3">
                    <div>
                        <button
                            onClick={handleExport}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Export Video
                        </button>
                        {exportStatus && (
                            <p className="mt-2 text-xl">{exportStatus}</p>
                        )}
                    </div>
                    <div>
                        <button
                            onClick={handleExport}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Lưu tiến trình
                        </button>
                    </div>
                </div>
                <VideoPreview
                    url={url}
                    subtitles={subtitles}
                    stickers={stickers}
                    musics={musics}
                    text={text}
                />
            </div>
            <div className="min-h-screen">
                <FormatVideo
                    tab={selectedTool}
                    setTab={setSelectedTool}
                    musics_system={musics_sys}
                    onAddMusic={handleAddMusic}
                    stickers_system={stickers_sys}
                    onAddSticker={handleAddSticker}
                    subtitle={subtitles[idxText]}
                    music={musics[idxMusic]}
                    sticker={stickers[idxSticker]}
                    onUpdateSubtitle={handleUpdateSubtitle}
                    onUpdateMusic={handleUpdateMusic}
                    onUpdateSticker={handleUpdateSticker}
                />
            </div>
        </div>
    );
}