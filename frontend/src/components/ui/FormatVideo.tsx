"use client";
import { useState } from "react";
import TabText from "@/components/ui/TabText";
import TabSticker from "@/components/ui/TabSticker";
import TabMusic from "@/components/ui/TabMusic";

export default function FormatVideo({
    tab,
    setTab,
    musics_system,
    onAddMusic,

    subtitle,
    music,
    sticker,
    onUpdateSubtitle,
    onUpdateMusic,
    onUpdateSticker
}: {
    tab: string;
    setTab: (tab: string) => void;
    musics_system: any[];
    onAddMusic: (id: number, name: string, data: string) => void;
    subtitle: any;
    onUpdateSubtitle: (sub: any) => void;
    music: any;
    onUpdateMusic: (sub: any) => void;
    sticker: any;
    onUpdateSticker: (sub: any) => void;
}) {
    return (
        <div className="w-[400px] h-full bg-white border-l-1 border-gray-700 flex flex-col">
            <div className="bg-gray-300 pt-5 pb-3">
                <div className="flex gap-2 text-2xl justify-center pl-3 pr-3">
                    <button
                        className={`w-full cursor-pointer h-12 p-1 rounded ${
                            tab === "subtitles" ? "bg-white border" : ""
                        }`}
                        onClick={() => setTab("subtitles")}
                    >
                        Text
                    </button>
                    <button
                        className={`w-full cursor-pointer h-12 p-1 rounded ${
                            tab === "music" ? "bg-white border" : ""
                        }`}
                        onClick={() => setTab("music")}
                    >
                        Music
                    </button>
                    <button
                        className={`w-full cursor-pointer h-12 p-1 rounded ${
                            tab === "sticker" ? "bg-white border" : ""
                        }`}
                        onClick={() => setTab("sticker")}
                    >
                        Sticker
                    </button>
                </div>
            </div>

            {tab === "subtitles" && <TabText subtitle={subtitle} onUpdate={onUpdateSubtitle}/>}
            {tab === "music" && <TabMusic musics_system={musics_system} music={music} onAddMusic={onAddMusic} onUpdateMusic={onUpdateMusic}/>}
            {tab === "sticker" && <TabSticker />}
        </div>
    );
}
