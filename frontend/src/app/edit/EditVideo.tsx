"use client";
import { useState } from "react";
import SideBar from "../../components/ui/SideBar";
import VideoPreview from "../../components/ui/VideoPreview";
import FormatVideo from "../../components/ui/FormatVideo";
import SubtitleSetting from "../../components/ui/SubtitleSetting";
import MusicSetting from "../../components/ui/MusicSetting";
import StickerSetting from "../../components/ui/StickerSetting";

const InitialSubtitles = [
    {
        text: "Đây là phụ đề.",
        start: 0,
        end: 3.984,
        style: {
            width: 300,
            position: "bottom",
            fontSize: 24,
            fontColor: "#FFFFFF@1.0",
            backgroundColor: "#000000@0.5",
            fontStyle: ["bold", "italic"],
            alignment: "center",
            shadow: {
                color: "#000000",
                blur: 4,
                offsetX: 2,
                offsetY: 2
            },
            outline: {
                color: "#FF0000",
                width: 1
            }
        }
    },
];

function AddNewSubtitle(text: string, currentList: any[] = []) {
    const lastSubtitle = currentList[currentList.length - 1];
    const startTime = lastSubtitle ? lastSubtitle.end : 0;

    return {
        text,
        start: startTime,
        end: startTime + 1,
        style: {
            width: 300,
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
                offsetY: 1
            },
            outline: {
                color: "#000000",
                width: 1
            }
        }
    };
}

export default function EditVideo() {
    const [selectedTool, setSelectedTool] = useState("subtitles");
    const [tab, setTab] = useState("sticker");
    const [subtitles, setSubtitles] = useState(InitialSubtitles);
    const [idxText, setIdxText] = useState(subtitles.length > 0 ? subtitles.length - 1 : -1);

    const handleAddSubtitle = (text: string) => {
        const newSubtitle = AddNewSubtitle(text, subtitles);
        setSubtitles([...subtitles, newSubtitle]);
        setIdxText(idxText + 1);
    };

    const handleUpdateSubtitle = (updatedSubtitle: any) => {
        // console.log(updatedSubtitle)
        const updatedList = [...subtitles];
        updatedList[idxText] = updatedSubtitle;
        setSubtitles(updatedList);
    };

    const handleDeleteSubtitle = (index: number) => {
        const updatedList = subtitles.filter((_, i) => i !== index);
        setSubtitles(updatedList);
    };

    return (
        <div className="flex h-full w-full pt-30 ">
            <SideBar selected={selectedTool} onSelect={setSelectedTool} />
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
                {selectedTool === "music" && <MusicSetting setTab={setTab} />}
                {selectedTool === "sticker" && (
                    <StickerSetting setTab={setTab} />
                )}
            </div>
            <div className="flex-1 overflow-y-auto max-h-screen custom-scroll">
                <VideoPreview />
            </div>
            <FormatVideo tab={selectedTool} setTab={setSelectedTool} subtitle={subtitles[idxText]} onUpdate={handleUpdateSubtitle}/>
        </div>
    );
}
