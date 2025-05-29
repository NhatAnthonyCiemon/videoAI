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
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import VideoExportPopup from "@/components/ui/VideoExportPopup";
import Notification from "@/components/ui/Notification";
import { AddNewSubtitle, AddNewMusic, AddNewSticker } from "@/types/Video";

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

    subtitles,
    setSubtitles,
    musics,
    setMusics,
    stickers,
    setStickers,
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

    subtitles: Subtitle[] | [];
    setSubtitles: (data: Subtitle[]) => void;
    musics: Music[] | [];
    setMusics: (data: Music[]) => void;
    stickers: Sticker[] | [];
    setStickers: (data: Sticker[]) => void;
}) {
    const [url, setUrl] = useState(videoData.url ? videoData.url : "https://res.cloudinary.com/dphytbuah/video/upload/v1747805114/temp_output_with_audio_qijbww.mp4");
    const [selectedTool, setSelectedTool] = useState("subtitles");
    const [tab, setTab] = useState<string>("sticker");

    const [idxText, setIdxText] = useState<number>(subtitles.length > 0 ? subtitles.length - 1 : -1);
    const [idxMusic, setIdxMusic] = useState<number>(musics.length > 0 ? musics.length - 1 : -1);
    const [idxSticker, setIdxSticker] = useState<number>(stickers.length > 0 ? stickers.length - 1 : -1);
    const [text, setText] = useState("");
    const [isLoad, setIsLoad] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showNot, setShowNot] = useState(false);
    const [mes, setMes] = useState("");
    const [video_url, setVideoUrl] = useState("");

    const onClose = () => {
        setShowNot(false); // Ẩn Notification khi đóng
    };

    useEffect(() => {
        if (subtitles.length > 0) {
            console.log("có data");
            console.log(subtitles);
            return;
        }
        if (videoData && videoData.image_video) {
            // console.log(videoData)
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
        // console.log(musics)
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

    const handleOpenVideoExport = () => {
        setVideoUrl(videoData.url_edit);
        setShowPopup(true);
    };

    const handleSave = async () => {
        if (!videoData.id) {
            alert("Thiếu video ID");
            return;
        }
        setIsLoad(true);

        try {
            const script_input = subtitles.map((sub) => ({
                text: sub.text,
                start: sub.start,
                end: sub.end,
                style: {
                    width: sub.style.width,
                    position: sub.style.position,
                    fontSize: sub.style.fontSize,
                    fontColor: sub.style.fontColor,
                    backgroundColor: sub.style.backgroundColor,
                    fontStyle: sub.style.fontStyle,
                    alignment: sub.style.alignment,
                    shadow: {
                        color: sub.style.shadow?.color ?? "#000000",
                        offsetX: sub.style.shadow?.offsetX ?? 0,
                        offsetY: sub.style.shadow?.offsetY ?? 0,
                    },
                    outline: {
                        color: sub.style.outline?.color ?? "#000000",
                        width: sub.style.outline?.width ?? 1,
                    },
                },
                status: sub.status,
            }));

            const sticker_files = stickers.map((s) => s.data);
            const sticker_config = stickers.map((sticker) => ({
                id: sticker.id,
                start: sticker.start,
                end: sticker.end,
                width: sticker.style.width,
                height: sticker.style.height,
                position: sticker.style.position,
                rotate: sticker.style.rotate,
                status: sticker.status,
            }));

            const audio_files = musics.map((m) => m.data);
            const audio_config = musics.map((m) => ({
                id: m.id,
                start: m.start,
                end: m.end,
                volume: m.volume,
                status: m.status,
            }));

            const payload = {
                video_id: videoData.id,
                script_input,
                sticker_files,
                sticker_config,
                audio_files,
                audio_config,
            };

            const response = await fetch("http://localhost:4000/edit/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Lỗi từ server");
            }

            const result = await response.json();
            console.log("Save result:", result);
            setIsLoad(false);
            setShowNot(true);
            setMes("Lưu dữ liệu edit thành công!")
        } catch (err) {
            console.error("Save error:", err);
            setShowNot(true);
            setMes("Có lỗi xảy ra! Hãy thử lại!")
        }
    };


    const handleExport = async () => {
        if (!url) {
            alert("Vui lòng cung cấp URL video chính!");
            return;
        }

        setIsLoad(true);

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
                        width: sub.style.width,
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
            const res = await response.json();
            console.log(res)


            const video_url = res.data.video_url;

            //window.open(video_url, "_blank"); // Mở video trong tab mới

            setVideoUrl(video_url);
            videoData.url_edit = video_url;
            setVideoData(videoData);
            setIsLoad(false);
            setShowPopup(true);
        } catch (err) {
            console.error("Export error:", err);
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
                    </div>
                    <div>
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Lưu tiến trình
                        </button>
                    </div>
                    {videoData.url_edit && <div>
                        <button
                            onClick={handleOpenVideoExport}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                        >
                            Video đã export
                        </button>
                    </div>}
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
            <LoadingOverlay isPreparing={isLoad} message="Đang xử lý..."/>
            {showPopup && <VideoExportPopup videoUrl={video_url} videoid={videoData.id} onClose={() => setShowPopup(false)} />}
            {showNot && (
                <>
                    <Notification
                        message={mes}
                        type="success"
                        onClose={() => {
                            onClose();
                            document.body.style.overflow = "auto";
                        }}
                    />
                </>
            )}
        </div>
    );
}