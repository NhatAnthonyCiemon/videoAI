"use client";
import React from "react";
import InforVideo from "@/types/inforVideo";

interface VideoItemProps {
    inforVideo: InforVideo;
    onViewClick: () => void;
    onClickVideo: () => void;
}

const VideoItem = ({ inforVideo, onViewClick, onClickVideo }: VideoItemProps) => {
    const { url, subtitle } = inforVideo;

    return (
        <div className="rounded-xl overflow-hidden border shadow-sm bg-white cursor-pointer">
            {/* Thumbnail/iframe click mở video popup */}
            <div
                className="relative h-[400px] w-full aspect-[9/16] bg-gray-300"
                onClick={onClickVideo}
            >
                <iframe
                    src={url}
                    title={subtitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-xl"
                />
            </div>

            {/* Info Section */}
            <div className="p-3 space-y-1">
                <div className="flex justify-between items-center">
                    <span className="mt-3 font-medium text-3xl line-clamp-2">
                        {subtitle}
                    </span>
                </div>

                <div className="flex justify-end">
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
