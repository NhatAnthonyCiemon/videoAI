"use client";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface Sticker {
    id: number;
    name: string;
    data: string;
    start: number;
    end: number;
    style: {
        width: number;
        height: number;
        rotate: number;
        position: {
            x: number;
            y: number;
        };
    };
    status: boolean;
}

export default function StickerSetting({
    stickers,
    onAdd,
    onUpdate,
    onDelete,
    idxSticker,
    setIdxSticker,
    setTab,
}: {
    stickers: Sticker[];
    onAdd: (id: number, name: string, data: string) => void;
    onUpdate: (sticker: Sticker) => void;
    onDelete: (index: number) => void;
    idxSticker: number;
    setIdxSticker: (index: number) => void;
    setTab: (tab: string) => void;
}) {
    const [stickersSystem] = useState([
        {
            id: 0,
            name: "Chim cánh cụt",
            data: "https://res.cloudinary.com/dphytbuah/image/upload/v1747738119/images-removebg-preview_y36zfk.png",
        },
        {
            id: 1,
            name: "Chim cánh cụt",
            data: "https://res.cloudinary.com/dphytbuah/image/upload/v1747738119/images-removebg-preview_y36zfk.png",
        },
    ]);

    const toggleEnable = (index: number) => {
        const sticker = stickers[index];
        if (sticker) {
            onUpdate({ ...sticker, status: !sticker.status });
        }
    };

    const updateSticker = (index: number, field: "start" | "end", value: string) => {
        const sticker = stickers[index];
        if (sticker) {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                onUpdate({ ...sticker, [field]: numValue });
            }
        }
    };

    return (
        <div className="bg-white overflow-y-auto space-y-2 border-r-1 h-full border-gray-700 p-4">
            <div className="flex justify-between items-center p-2">
                <button
                    className="text-2xl font-medium border border-gray-700 rounded-lg p-2 bg-gray-50 cursor-pointer active:bg-blue-100 text-gray-700"
                    onClick={() => setTab("sticker")}
                >
                    Sticker
                </button>
            </div>

            {stickers.map((sticker, index) => (
                <div key={sticker.id || index} className="p-2 flex" onClick={() => setIdxSticker(index)}>
                    <div className="flex items-center mr-3">
                        <input
                            type="checkbox"
                            checked={idxSticker === index}
                            onChange={() => setIdxSticker(index)}
                            className="w-5 h-5 cursor-pointer"
                        />
                    </div>
                    <div className="border w-full rounded-md p-2 flex items-center gap-3 bg-gray-50">
                        <img
                            src={sticker.data}
                            alt={sticker.name}
                            className="max-w-[40px] max-h-[40px] object-contain rounded"
                            style={{
                                width: sticker.style.width,
                                height: sticker.style.height,
                                transform: `rotate(${sticker.style.rotate}deg)`,
                            }}
                        />
                        <div className="flex-1">
                            <p className="text-2xl font-semibold text-gray-800">{sticker.name}</p>
                            <p className="text-gray-600 text-xl">
                                Vị trí: ({sticker.style.position.x}, {sticker.style.position.y})
                            </p>
                        </div>
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
                                value={sticker.start.toFixed(2)}
                                onChange={(e) => updateSticker(index, "start", e.target.value)}
                                className="bg-transparent border-none w-full text-center focus:outline-none focus:ring-0"
                            />
                        </div>
                        <div className="min-h-3"></div>
                        <div className="flex-1 border rounded-md p-1 bg-gray-50 w-[52px] text-center flex items-center justify-center">
                            <input
                                type="text"
                                value={sticker.end.toFixed(2)}
                                onChange={(e) => updateSticker(index, "end", e.target.value)}
                                className="bg-transparent border-none w-full text-center focus:outline-none focus:ring-0"
                            />
                        </div>
                    </div>
                    <div className="flex items-center ml-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={sticker.status || false}
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