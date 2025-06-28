"use client";
import { useState, useEffect } from "react";
import { Sticker_System, Sticker } from "@/types/Video";


export default function TabSticker({
    stickers_system,
    sticker,
    onAddSticker,
    onUpdateSticker,
}: {
    stickers_system: Sticker_System[] | null;
    sticker: Sticker | null;
    onAddSticker: (id: number, name: string, data: string) => void;
    onUpdateSticker: (sticker: Sticker) => void;
}) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleSave = () => {
        if (stickers_system) {
            const selectedStickers = stickers_system.filter((s) => selectedIds.includes(s.id));
            selectedStickers.forEach((s) => onAddSticker(s.id, s.name, s.url));
            setSelectedIds([]);
        }
    };

    const handleStyleChange = (field: keyof Sticker["style"], value: number) => {
        if (sticker) {
            onUpdateSticker({
                ...sticker,
                style: { ...sticker.style, [field]: value },
            });
        }
    };

    const handlePositionChange = (axis: "x" | "y", value: number) => {
        if (sticker) {
            onUpdateSticker({
                ...sticker,
                style: {
                    ...sticker.style,
                    position: { ...sticker.style.position, [axis]: value },
                },
            });
        }
    };

    return (
        <div className="flex space-y-4 text-2xl pt-4 bg-white overflow-y-auto p-4 h-full">
            <div className="flex-1 space-y-4">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold">Chọn nhãn dán</h2>
                </div>

                <div className="space-y-2 mt-3">
                    {stickers_system?.map((s) => (
                        <div
                            key={s.id}
                            className={`p-3 border rounded-md flex justify-between items-center transition ${selectedIds.includes(s.id)
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300"
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(s.id)}
                                onChange={() => toggleSelect(s.id)}
                                className="w-5 h-5 cursor-pointer mr-4 ml-2"
                            />
                            <div
                                className="flex-1 cursor-pointer"
                                onClick={() => toggleSelect(s.id)}
                            >
                                <p className="font-semibold">{s.name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <img
                                    src={s.url}
                                    alt={s.name}
                                    className="w-12 h-12 rounded object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {selectedIds.length > 0 && (
                    <div className="pt-4">
                        <button
                            onClick={handleSave}
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
                        >
                            Thêm nhãn dán
                        </button>
                    </div>
                )}
            </div>

            <div className="w-1/2 pl-8 pr-8">
                {sticker && (
                    <div className="">
                        <h3 className="text-2xl font-bold">Sticker đang chọn</h3>
                        <div className="mt-2 flex gap-[30px]">
                            <div>
                                <p className="text-2xl">Tên: {sticker.name}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <img
                                        src={sticker.data}
                                        alt={sticker.name}
                                        className="max-w-[100px] max-h-[100px] rounded object-contain"
                                        style={{
                                            width: sticker.style.width,
                                            height: sticker.style.height,
                                            transform: `rotate(${sticker.style.rotate}deg)`,
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="">
                                    <label className="text-2xl">Chiều rộng: </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={sticker.style.width}
                                        onChange={(e) =>
                                            handleStyleChange("width", parseFloat(e.target.value))
                                        }
                                        className="w-24 text-xl border rounded-md p-1"
                                    />
                                    <span className="ml-2">px</span>
                                </div>
                                <div className="mt-2">
                                    <label className="text-2xl">Chiều cao: </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={sticker.style.height}
                                        onChange={(e) =>
                                            handleStyleChange("height", parseFloat(e.target.value))
                                        }
                                        className="w-24 text-xl border rounded-md p-1"
                                    />
                                    <span className="ml-2">px</span>
                                </div>
                                <div className="mt-2">
                                    <label className="text-2xl">Xoay: </label>
                                    <input
                                        type="number"
                                        value={sticker.style.rotate}
                                        onChange={(e) =>
                                            handleStyleChange("rotate", parseFloat(e.target.value))
                                        }
                                        className="w-24 text-xl border rounded-md p-1"
                                    />
                                    <span className="ml-2">deg</span>
                                </div>
                                <div className="mt-2">
                                    <label className="text-2xl">Vị trí X: </label>
                                    <input
                                        type="number"
                                        value={sticker.style.position.x}
                                        onChange={(e) =>
                                            handlePositionChange("x", parseFloat(e.target.value))
                                        }
                                        className="w-24 text-xl border rounded-md p-1"
                                    />
                                    <span className="ml-2">px</span>
                                </div>
                                <div className="mt-2">
                                    <label className="text-2xl">Vị trí Y: </label>
                                    <input
                                        type="number"
                                        value={sticker.style.position.y}
                                        onChange={(e) =>
                                            handlePositionChange("y", parseFloat(e.target.value))
                                        }
                                        className="w-24 text-xl border rounded-md p-1"
                                    />
                                    <span className="ml-2">px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}