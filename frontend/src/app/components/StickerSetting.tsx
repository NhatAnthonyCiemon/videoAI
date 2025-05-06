"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";

const mockStickers = [
    {
        id: 1,
        name: "Sticker vui nhộn",
        description: "Dán mặt cười ở góc dưới video",
        link: "https://res.cloudinary.com/dphytbuah/image/upload/v1746017853/Image_tiktok/t34tezoyfnqkdy1yqf75.webp",
        start: "00:05",
        end: "00:10",
        enabled: true,
    },
    {
        id: 2,
        name: "Ngôi sao",
        description: "Hiệu ứng lấp lánh khi bắt đầu",
        link: "https://res.cloudinary.com/dphytbuah/image/upload/v1746017853/Image_tiktok/t34tezoyfnqkdy1yqf75.webp",
        start: "00:00",
        end: "00:03",
        enabled: false,
    },
];

export default function StickerSetting({ setTab }: { setTab: (tab: string) => void }) {
    const [stickers, setStickers] = useState(mockStickers);

    const toggleEnable = (id: number) => {
        setStickers((prev) =>
            prev.map((sticker) =>
                sticker.id === id ? { ...sticker, enabled: !sticker.enabled } : sticker
            )
        );
    };

    const deleteSticker = (id: number) => {
        setStickers((prev) => prev.filter((sticker) => sticker.id !== id));
    };

    return (
        <div className="bg-white overflow-y-auto space-y-2 border-r-1 h-full border-gray-700 p-4">
            <div className="flex justify-between items-center mb-2 p-2">
                <button className="text-xl font-medium border border-gray-700 rounded-lg p-2 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setTab('sticker')}
                >
                    + Sticker
                </button>
            </div>

            {stickers.map((sticker) => (
                <div key={sticker.id} className="p-2 flex rounded-md">
                    <div className="border rounded-md p-2 flex items-center w-full gap-3 bg-gray-50">
                        <img
                            src={sticker.link}
                            alt={sticker.name}
                            className="w-12 h-12 object-contain rounded"
                        />
                        <div className="flex-1">
                            <p className="text-xl font-semibold text-gray-800">{sticker.name}</p>
                            <p className="text-gray-600">{sticker.description}</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 ml-5 mr-3">
                        <button onClick={() => deleteSticker(sticker.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={18} color="black" className="cursor-pointer" />
                        </button>
                    </div>
                    <div className="flex flex-col justify-between ml-2">
                        <div className="flex-1 border rounded-md p-1 bg-gray-50 w-[52px] text-center flex items-center justify-center">
                            {sticker.start}
                        </div>
                        <div className="min-h-3"></div>
                        <div className="flex-1 border rounded-md p-1 bg-gray-50 w-[52px] text-center flex items-center justify-center">
                            {sticker.end}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
