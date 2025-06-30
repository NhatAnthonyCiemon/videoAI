"use client";
import React, { useState } from "react";
import InforVideo from "@/types/inforVideo";
import IncompleteVideoDialog from "./IncompleteVideoDialog";

interface VideoItemProps {
    inforVideo: InforVideo;
    onViewClick: () => void;
    onClickVideo: () => void;
}

const VideoItem = ({
    inforVideo,
    onViewClick,
}: VideoItemProps) => {
    const { id, url, keyword, name, category, created_at, step, url_edit } =
        inforVideo;
    const [isIncompleteDialogOpen, setIsIncompleteDialogOpen] = useState(false);
    const [displayName, setDisplayName] = useState(name);

    const handleViewClick = () => {
        if (step === "incomplete") {
            console.log("Video is incomplete, opening dialog");
            setIsIncompleteDialogOpen(true);
        } else {
            onViewClick();
        }
    };

    const handleIncompleteDialogOk = () => {
        console.log("Closing incomplete video dialog");
        setIsIncompleteDialogOpen(false);
    };

    return (
        <div className="rounded-xl overflow-hidden border shadow-sm bg-white">
            <div
                className="relative h-[400px] w-full aspect-[9/16] bg-gray-300"
                onClick={handleViewClick}
            >
                <video
                    src={url_edit || url || "/img/avatar_placeholder.png"} // Prioritize url_edit, fallback to url, then placeholder
                    title={keyword}
                    className="absolute top-0 left-0 w-full h-full rounded-xl cursor-pointer"
                />
                {/* <video
                    src={url_edit && url && "/img/avatar_placeholder.png"} // Prioritize url_edit, fallback to url
                    title={keyword}
                    className="absolute top-0 left-0 w-full h-full rounded-xl cursor-pointer"
                /> */}
            </div>

            <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-3xl truncate max-w-[70%]">
                        {displayName}
                    </span>                    
                </div>

                <div className="flex items-center text-xl text-gray-600">
                    <span>
                        {new Date(created_at).toLocaleDateString("vi-VN")}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{category || "Chưa có danh mục"}</span>
                </div>

                <div className="flex justify-end">
                    <button
                        className="text-xl px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 bg-gray-50 transition-colors duration-200 cursor-pointer shadow-sm font-medium"
                        onClick={handleViewClick}
                    >
                        Xem
                    </button>
                </div>
            </div>

            <IncompleteVideoDialog
                isOpen={isIncompleteDialogOpen}
                onOpenChange={setIsIncompleteDialogOpen}
                onOk={handleIncompleteDialogOk}
            />
        </div>
    );
};

export default React.memo(VideoItem);