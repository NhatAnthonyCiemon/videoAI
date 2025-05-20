"use client";
import { useState } from "react";
import TabText from "@/components/ui/TabText";
import TabSticker from "@/components/ui/TabSticker";
import TabMusic from "@/components/ui/TabMusic";

export default function FormatVideo({
    tab,
    setTab,
    subtitle,
    onUpdate
}: {
    tab: string;
    setTab: (tab: string) => void;
    subtitle: any;
    onUpdate: (sub: any) => void;
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

            {tab === "subtitles" && <TabText subtitle={subtitle} onUpdate={onUpdate}/>}
            {tab === "music" && <TabMusic />}
            {tab === "sticker" && <TabSticker />}
        </div>
    );
}
