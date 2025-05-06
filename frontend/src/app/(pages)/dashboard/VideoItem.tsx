"use client";
import React from "react";
import InforVideo from "@/types/inforVideo";

interface VideoItemProps {
    inforVideo: InforVideo;
    onViewClick: () => void;
}

const VideoItem = ({ inforVideo, onViewClick }: VideoItemProps) => {
    const { title, duration, category, date, views } = inforVideo;

    return (
        <div className="rounded-xl overflow-hidden border shadow-sm bg-white cursor-pointer">
            {/* Thumbnail + Duration */}
            <div className="relative h-[400px] w-full aspect-[9/16] bg-gray-300">
                <span className="absolute bottom-1 right-1 bg-black text-white text-2xl px-1.5 py-0.5 rounded-sm">
                    {duration}
                </span>
            </div>

            {/* Info Section */}
            <div className="p-3 space-y-1">
                <div className="flex justify-between items-center">
                    <span className="mt-3 font-medium text-3xl">{title}</span>
                    <button className="text-gray-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 12h.01M12 12h.01M18 12h.01"
                            />
                        </svg>
                    </button>
                </div>

                <div className="text-2xl text-gray-500 flex gap-3 mt-3 items-center flex-wrap">
                    <span>{category}</span>
                    <span>•</span>
                    <span>{date}</span>
                </div>
                <div className="flex justify-between items-center mb-[10px]">
                    <div className="text-xl text-gray-500">{views}</div>

                    <button
                        className="mt-2 text-2xl px-3 border rounded-sm hover:bg-gray-100 cursor-pointer py-2"
                        onClick={onViewClick}
                    >
                        Xem
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoItem;
