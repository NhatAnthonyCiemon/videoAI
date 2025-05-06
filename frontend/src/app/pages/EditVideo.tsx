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
    const [tab, setTab] = useState("sticker");

    return (
        <div className="flex h-screen w-screen">
            <SideBar selected={selectedTool} onSelect={setSelectedTool} />
            <div className="bg-white w-[400px]">
                {selectedTool === "subtitles" && <SubtitleSetting/>}
                {selectedTool === "music" && <MusicSetting setTab={setTab}/>}
                {selectedTool === "sticker" && <StickerSetting setTab={setTab}/>}
            </div>
            <VideoPreview />
            <FormatVideo tab={tab} setTab={setTab}/>
        </div>
    );
}
