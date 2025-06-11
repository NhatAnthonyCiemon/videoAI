"use client";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";
import { on } from "events";

export default function SubtitleSetting({
    subtitles,
    onAdd,
    onUpdate,
    onDelete,
    onReorder,
    idxText,
    setIdxText,
}: {
    subtitles: any[];
    onAdd: (sub: any) => void;
    onUpdate: (sub: any) => void;
    onDelete: (index: number) => void;
    onReorder: (subs: any[]) => void;
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
    };

    const updateSubtitle = (
        index: number,
        field: "start" | "end",
        value: string | number
    ) => {
        const newValue =
            typeof subtitles[index][field] === "number" ? Number(value) : value;
        onUpdate({ ...subtitles[index], [field]: newValue });
    };

    const toggleEnable = (index: number) => {
        const sub = subtitles[index];
        if (sub) {
            onUpdate({ ...sub, status: !sub.status });
        }
    };

    // Hàm xử lý kéo thả xong:
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) return;

        const newSubs = Array.from(subtitles);
        const [removed] = newSubs.splice(sourceIndex, 1);
        newSubs.splice(destinationIndex, 0, removed);

        onReorder(newSubs);
        
    };

    return (
        <div className="bg-white overflow-y-auto space-y-2 h-full border-gray-700 p-4">
            <div className="flex justify-between items-center p-2">
                {isAdding ? (
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className={`text-2xl font-medium border border-gray-700 rounded-lg p-2 bg-gray-50 cursor-pointer active:bg-blue-100 ${isAdding ? "bg-gray-300" : "text-gray-700"
                            }`}
                    >
                        - Phụ đề
                    </button>
                ) : (
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className={`text-2xl font-medium border border-gray-700 rounded-lg p-2 bg-gray-50 cursor-pointer active:bg-blue-100 ${isAdding ? "bg-gray-300" : "text-gray-700"
                            }`}
                    >
                        + Phụ đề
                    </button>
                )}
            </div>

            {/* Form thêm phụ đề */}
            {isAdding && (
                <>
                    <div className="p-2 flex">
                        <div className="border rounded-md p-2 flex flex-col bg-gray-50 w-full">
                            <textarea
                                placeholder="Văn bản phụ đề"
                                value={newSubtitle.text}
                                onChange={(e) =>
                                    setNewSubtitle({ ...newSubtitle, text: e.target.value })
                                }
                                className="text-xl text-gray-700 bg-transparent border-none w-full focus:outline-none focus:ring-0"
                            />
                        </div>
                        <div className="flex flex-col justify-between ml-2">
                            <div className="flex-1 border rounded-md p-1 bg-gray-50 w-[52px] text-center flex items-center justify-center">
                                <input
                                    type="text"
                                    placeholder="start"
                                    value={newSubtitle.start}
                                    onChange={(e) =>
                                        setNewSubtitle({ ...newSubtitle, start: e.target.value })
                                    }
                                    className="bg-transparent border-none w-full text-center focus:outline-none focus:ring-0"
                                />
                            </div>
                            <div className="min-h-3"></div>
                            <div className="flex-1 border rounded-md p-1 bg-gray-50 w-[52px] text-center flex items-center justify-center">
                                <input
                                    type="text"
                                    placeholder="end"
                                    value={newSubtitle.end}
                                    onChange={(e) =>
                                        setNewSubtitle({ ...newSubtitle, end: e.target.value })
                                    }
                                    className="bg-transparent border-none w-full text-center focus:outline-none focus:ring-0"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-start p-2">
                        <button
                            onClick={() => {
                                onAdd(newSubtitle.text);
                                setIsAdding(false);
                                setNewSubtitle({ ...newSubtitle, text: "" });
                            }}
                            className="text-blue-500 hover:text-blue-700 border border-blue-500 rounded-lg p-2 bg-gray-50 hover:bg-gray-100 cursor-pointer active:bg-blue-100"
                        >
                            Thêm phụ đề
                        </button>
                    </div>
                    <hr className="bg-gray-300 border-none h-[1px] mb-5" />
                </>
            )}

            {/* Danh sách phụ đề có kéo thả */}
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="subsDroppable">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2"
                        >
                            {subtitles.map((sub, idx) => (
                                <Draggable
                                    key={idx}
                                    draggableId={`sub-${idx}`}
                                    index={idx}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`p-2 flex items-center ${snapshot.isDragging ? "bg-yellow-100" : ""
                                                }`}
                                            onClick={() => setIdxText(idx)}
                                        >
                                            <div className="flex items-center mr-3">
                                                <input
                                                    type="checkbox"
                                                    checked={idxText == idx}
                                                    onChange={() => setIdxText(idx)}
                                                    className="w-5 h-5 cursor-pointer"
                                                />
                                            </div>
                                            <div className="border w-full rounded-md p-2 flex flex-col bg-gray-50">
                                                <textarea
                                                    placeholder="Văn bản phụ đề"
                                                    value={sub.text}
                                                    onClick={() => setIdxText(idx)}
                                                    onChange={(e) => changeText(e.target.value)}
                                                    className="text-2xl text-gray-700 bg-transparent border-none w-full focus:outline-none focus:ring-0 resize-none"
                                                />
                                            </div>
                                            <div className="flex justify-between items-center mt-2 ml-5 mr-3">
                                                <button
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => onDelete(idx)}
                                                >
                                                    <Trash2
                                                        size={18}
                                                        color="black"
                                                        className="cursor-pointer"
                                                    />
                                                </button>
                                            </div>
                                            <div className="flex flex-col justify-between ml-2 text-xl">
                                                <div className="flex-1 border rounded-md p-1 bg-gray-50 w-[52px] text-center flex items-center justify-center">
                                                    <input
                                                        type="number"
                                                        value={sub.start}
                                                        onChange={(e) =>
                                                            updateSubtitle(
                                                                idx,
                                                                "start",
                                                                parseFloat(e.target.value)
                                                            )
                                                        }
                                                        className="bg-transparent border-none w-full text-center focus:outline-none focus:ring-0"
                                                    />
                                                </div>
                                                <div className="min-h-3"></div>
                                                <div className="flex-1 border rounded-md p-1 bg-gray-50 w-[52px] text-center flex items-center justify-center">
                                                    <input
                                                        type="number"
                                                        value={sub.end}
                                                        onChange={(e) =>
                                                            updateSubtitle(
                                                                idx,
                                                                "end",
                                                                parseFloat(e.target.value)
                                                            )
                                                        }
                                                        className="bg-transparent border-none w-full text-center focus:outline-none focus:ring-0"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center ml-3">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={sub.status || false}
                                                        onChange={() => toggleEnable(idx)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-orange-500 rounded-full peer peer-focus:ring-2 peer-focus:ring-orange-300 transition duration-300 ease-in-out"></div>
                                                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition duration-300 ease-in-out"></div>
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}
