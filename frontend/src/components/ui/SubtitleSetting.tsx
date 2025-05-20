"use client";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function SubtitleSetting({
    subtitles,
    onAdd,
    onUpdate,
    onDelete,
    idxText,
    setIdxText
}: {
    subtitles: any[];
    onAdd: (sub: any) => void;
    onUpdate: (sub: any) => void;
    onDelete: (index: number) => void;
    idxText: number;
    setIdxText: (index: number) => void;
}) {
    const [isAdding, setIsAdding] = useState(false);
    const [newSubtitle, setNewSubtitle] = useState({
        text: "",
        start: "",
        end: "",
    });

    const changeText = (text: string) => {
        onUpdate({ ...subtitles[idxText], text });
    }

    return (
        <div className="bg-white overflow-y-auto space-y-2 border-r-1 h-full border-gray-700 p-4">
            <div className="flex justify-between items-center p-2">
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className={`text-2xl font-medium border border-gray-700 rounded-lg p-2 bg-gray-50 cursor-pointer active:bg-blue-100 ${isAdding ? "bg-gray-300" : "text-gray-700"}`}
                >
                    + Phụ đề
                </button>
            </div>

            {/* Form thêm phụ đề */}
            {isAdding && (
                <>
                    <div className="p-2 flex">
                        <div className="border rounded-md p-2 flex flex-col bg-gray-50 w-full">
                            <textarea
                                placeholder="Văn bản phụ đề"
                                value={newSubtitle.text}
                                onChange={(e) => setNewSubtitle({ ...newSubtitle, text: e.target.value })}
                                className="text-xl text-gray-700 bg-transparent border-none w-full focus:outline-none focus:ring-0"
                            />
                        </div>
                        <div className="flex flex-col justify-between ml-2">
                            <div className="flex-1 border rounded-md p-1 bg-gray-50 w-[52px] text-center flex items-center justify-center">
                                <input
                                    type="text"
                                    placeholder="Thời gian bắt đầu"
                                    value={newSubtitle.start}
                                    onChange={(e) => setNewSubtitle({ ...newSubtitle, start: e.target.value })}
                                    className="bg-transparent border-none w-full text-center focus:outline-none focus:ring-0"
                                />
                            </div>
                            <div className="min-h-3"></div>
                            <div className="flex-1 border rounded-md p-1 bg-gray-50 w-[52px] text-center flex items-center justify-center">
                                <input
                                    type="text"
                                    placeholder="Thời gian kết thúc"
                                    value={newSubtitle.end}
                                    onChange={(e) => setNewSubtitle({ ...newSubtitle, end: e.target.value })}
                                    className="bg-transparent border-none w-full text-center focus:outline-none focus:ring-0"
                                />
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-start p-2">
                        <button
                            onClick={() => onAdd(newSubtitle.text)}
                            className="text-blue-500 hover:text-blue-700 border border-blue-500 rounded-lg p-2 bg-gray-50 hover:bg-gray-100 cursor-pointer active:bg-blue-100"
                        >
                            Thêm phụ đề
                        </button>
                    </div>
                    <hr className="bg-gray-300 border-none h-[1px] mb-5" />
                </>
            )}

            {/* Danh sách các phụ đề hiện tại */}
            {subtitles.map((sub, idx) => (
                <div key={idx} className="p-2 flex">
                    <div className="flex items-center mr-3">
                        <input
                            type="checkbox"
                            checked={idxText == idx}
                            onChange={() => setIdxText(idx)}
                            className="w-5 h-5 cursor-pointer"
                        />
                    </div>
                    <div className="border w-full rounded-md p-2 flex flex-col bg-gray-50">
                        {/* <input type="text" value={sub.text} className="text-2xl text-gray-700" /> */}
                        <textarea
                            placeholder="Văn bản phụ đề"
                            value={sub.text}
                            onClick={() => setIdxText(idx)}
                            onChange={(e) => changeText(e.target.value)}
                            className="text-2xl text-gray-700 bg-transparent border-none w-full focus:outline-none focus:ring-0"
                        />
                    </div>
                    <div className="flex justify-between items-center mt-2 ml-5 mr-3">
                        <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => onDelete(idx)}
                        >
                            <Trash2 size={18} color="black" className="cursor-pointer" />
                        </button>
                    </div>
                    <div className="flex flex-col justify-between ml-2 text-xl">
                        <div className="flex-1 border rounded-md p-1 bg-gray-50 w-[52px] text-center flex items-center justify-center">
                            {sub.start}
                        </div>
                        <div className="min-h-3"></div>
                        <div className="flex-1 border rounded-md p-1 bg-gray-50 w-[52px] text-center flex items-center justify-center">
                            {sub.end}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
