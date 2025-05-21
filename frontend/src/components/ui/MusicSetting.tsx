"use client";
import { Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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

export default function MusicSetting({
    musics,
    onAdd,
    onUpdate,
    onDelete,
    idxMusic,
    setIdxMusic,
    setTab,
}: {
    musics: Music[];
    onAdd: (id: number, name: string, data: string) => void;
    onUpdate: (music: Music) => void;
    onDelete: (index: number) => void;
    idxMusic: number;
    setIdxMusic: (index: number) => void;
    setTab: (tab: string) => void;
}) {
    const toggleEnable = (index: number) => {
        const music = musics[index];
        if (music) {
            onUpdate({ ...music, status: !music.status });
        }
    };

    const updateMusic = (index: number, field: "start" | "end", value: string) => {
        const music = musics[index];
        if (music) {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                onUpdate({ ...music, [field]: numValue });
            }
        }
    };

    // Đọc thời lượng của các music nếu duration chưa được gán
    useEffect(() => {
        musics.forEach((music, index) => {
            if (!music.duration || music.duration === 0) {
                const audio = new Audio(music.data);
                audio.addEventListener("loadedmetadata", () => {
                    const duration = audio.duration || 0;
                    audio.remove();
                    if (duration > 0) {
                        onUpdate({ ...music, duration });
                    }
                });
                audio.addEventListener("error", () => {
                    audio.remove();
                    onUpdate({ ...music, duration: 0 });
                });
                audio.load();
            }
        });
    }, [musics, onUpdate]);

    return (
        <div className="bg-white overflow-y-auto space-y-2 border-r-1 h-full border-gray-700 p-4">
            <div className="flex justify-between items-center p-2">
                <button
                    className="text-2xl font-medium border border-gray-700 rounded-lg p-2 bg-gray-50 cursor-pointer active:bg-blue-100 text-gray-700"
                >
                    Nhạc nền
                </button>
            </div>

            {musics.map((music, index) => (
                <div key={music.id || index} className="p-2 flex" onClick={() => setIdxMusic(index)}>
                    <div className="flex items-center mr-3">
                        <input
                            type="checkbox"
                            checked={idxMusic === index}
                            onChange={() => setIdxMusic(index)}
                            className="w-5 h-5 cursor-pointer"
                        />
                    </div>
                    <div className="border w-full rounded-md p-2 flex flex-col bg-gray-50">
                        <p className="text-2xl font-semibold">{music.name}</p>
                        <p className="text-gray-600 text-xl">
                            Thời lượng: {music.duration ? music.duration.toFixed(2) : (music.end - music.start).toFixed(2)}s
                        </p>
                    </div>
                    <div className="flex justify-between items-center mt-2 ml-5 mr-3">
                        <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => onDelete(index)}
                        >
                            <Trash2 size={18} color="black" className="cursor-pointer" />
                        </button>
                    </div>
                    <div className="flex flex-col justify-between ml-2 text-xl">
                        <div className="flex-1 border rounded-md p-1 bg-gray-50 w-[52px] text-center flex items-center justify-center">
                            <input
                                type="text"
                                value={music.start.toFixed(2)}
                                onChange={(e) => updateMusic(index, "start", e.target.value)}
                                className="bg-transparent border-none w-full text-center focus:outline-none focus:ring-0"
                            />
                        </div>
                        <div className="min-h-3"></div>
                        <div className="flex-1 border rounded-md p-1 bg-gray-50 w-[52px] text-center flex items-center justify-center">
                            <input
                                type="text"
                                value={music.end.toFixed(2)}
                                onChange={(e) => updateMusic(index, "end", e.target.value)}
                                className="bg-transparent border-none w-full text-center focus:outline-none focus:ring-0"
                            />
                        </div>
                    </div>
                    <div className="flex items-center ml-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={music.status}
                                onChange={() => toggleEnable(index)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-checked:bg-orange-500 rounded-full peer peer-focus:ring-2 peer-focus:ring-orange-300 transition duration-300 ease-in-out"></div>
                            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition duration-300 ease-in-out"></div>
                        </label>
                    </div>
                </div>
            ))}
        </div>
    );
}