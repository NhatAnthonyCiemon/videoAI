"use client";
import { useState } from "react";
import SideBar from "../../components/ui/SideBar";
import VideoPreview from "../../components/ui/VideoPreview";
import FormatVideo from "../../components/ui/FormatVideo";
import SubtitleSetting from "../../components/ui/SubtitleSetting";
import MusicSetting from "../../components/ui/MusicSetting";
import StickerSetting from "../../components/ui/StickerSetting";

export default function EditVideo() {
    const [selectedTool, setSelectedTool] = useState("subtitles");
    const [tab, setTab] = useState("sticker");

    return (
        <div className="flex h-screen w-screen">
            <SideBar selected={selectedTool} onSelect={setSelectedTool} />
            <div className="bg-white w-[400px]">
                {selectedTool === "subtitles" && <SubtitleSetting />}
                {selectedTool === "music" && <MusicSetting setTab={setTab} />}
                {selectedTool === "sticker" && (
                    <StickerSetting setTab={setTab} />
                )}
            </div>
            <VideoPreview />
            <FormatVideo tab={tab} setTab={setTab} />
        </div>
    );
}
