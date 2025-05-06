"use client";
import { useState } from "react";
import TabText from "./TabText";
import TabSticker from "./TabSticker";
import TabMusic from "./TabMusic";

export default function FormatVideo() {
  const [tab, setTab] = useState("sticker");

  return (
    <div className="w-[360px] h-full bg-white border-l-1 border-gray-700 flex flex-col">
      <div className="bg-gray-300 pt-5 pb-3">
        <div className="flex gap-2 text-xl justify-center pl-3 pr-3">
          <button
            className={`w-full cursor-pointer h-12 p-1 rounded ${tab === 'text' ? "bg-white border" : ""}`}
            onClick={() => setTab('text')}
          >
            Text
          </button>
          <button
            className={`w-full cursor-pointer h-12 p-1 rounded ${tab === 'sticker' ? "bg-white border" : ""}`}
            onClick={() => setTab('sticker')}
          >
            Sticker
          </button>
          <button
            className={`w-full cursor-pointer h-12 p-1 rounded ${tab === 'music' ? "bg-white border" : ""}`}
            onClick={() => setTab('music')}
          >
            Music
          </button>
        </div>
      </div>
      
      {tab === "text" && <TabText />}
      {tab === "sticker" && <TabSticker />}
      {tab === "music" && <TabMusic />}
    </div>
  );
}
