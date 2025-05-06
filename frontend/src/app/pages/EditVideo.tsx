'use client';
import { useState } from "react";
import SideBar from "../components/SideBar";
import VideoPreview from "../components/VideoPreview";
import FormatVideo from "../components/FormatVideo";
import SubtitleSetting from "../components/SubtitleSetting";
import MusicSetting from "../components/MusicSetting";
import StickerSetting from "../components/StickerSetting";


export default function EditVideo() {
    const [selectedTool, setSelectedTool] = useState("subtitles");

    return (
        <div className="flex h-screen w-screen">
            <SideBar selected={selectedTool} onSelect={setSelectedTool} />
            <div className="bg-white w-[400px]">
                {selectedTool === "subtitles" && <SubtitleSetting />}
                {selectedTool === "music" && <MusicSetting />}
                {selectedTool === "sticker" && <StickerSetting />}
            </div>
            <VideoPreview />
            <FormatVideo />
        </div>
    );
}
