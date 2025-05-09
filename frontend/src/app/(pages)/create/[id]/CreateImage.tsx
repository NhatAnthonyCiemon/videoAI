"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import Video from "@/types/Video";
import useOverlay from "@/hooks/useOverlay";
import DraftModal from "@/components/ui/DraftModal";
import videoClass from "@/lib/Video";
import fetchApi from "@/lib/api/fetch";
import { Image_video } from "@/types/Video";
import HttpMethod from "@/types/httpMethos";

function showErrorToast(message: string) {
    toast.error(message, {
        duration: 4000,
        position: "top-center",
    });
}
function showSuccessToast(message: string) {
    toast.success(message, {
        duration: 3000,
        position: "top-center",
    });
}

export default function CreateImage({
    setWhichActive,
    videoData,
    setVideoData,
    isPreparing,
    setIsPreparing,
}: {
    setWhichActive: (Active: number) => void;
    videoData: Video;
    setVideoData: (video: Video) => void;
    isPreparing: boolean;
    setIsPreparing: (Active: boolean) => void;
}) {
    const { isModalOpen, openModal, closeModal } = useOverlay();
    const [loadingIndexes, setLoadingIndexes] = useState<Set<number>>(
        new Set()
    );
    // Lưu trạng thái loading cho nhiều ảnh
    const handleRegenerate = async (index: number) => {
        setLoadingIndexes((prev) => new Set(prev).add(index));

        const image_video = [...videoData.image_video];
        image_video[index].url =
            "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg";
        setVideoData(
            videoClass.updateVideo(videoData, "image_video", image_video)
        );

        const res = await fetchApi<Image_video>(
            "http://localhost:4000/content/regenerateimage",
            HttpMethod.POST,
            {
                index: index,
                content: image_video[index].content,
                prompt: image_video[index].prompt,
            }
        );

        if (res.mes === "success") {
            const newImage = res.data;
            image_video[index].url = newImage.url;
            setVideoData(
                videoClass.updateVideo(videoData, "image_video", image_video)
            );
            showSuccessToast("Tạo lại ảnh thành công");
        } else {
            showErrorToast("Tạo lại ảnh thất bại");
        }

        // Xóa index khỏi danh sách loading
        setLoadingIndexes((prev) => {
            const newSet = new Set(prev);
            newSet.delete(index);
            return newSet;
        });
    };

    return (
        <div>
            <div className="flex flex-col gap-8">
                {videoData.image_video.map((img, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-md shadow-md"
                    >
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                            Ảnh {index + 1}:
                        </h2>
                        <div className="grid grid-cols-3 gap-8">
                            {/* Image Placeholder */}
                            <div className="col-span-1 h-[100%] min-h-[200px] bg-gray-300 rounded-md relative">
                                {loadingIndexes.has(index) && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                                        <svg
                                            className="animate-spin h-12 w-12 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            ></path>
                                        </svg>
                                    </div>
                                )}
                                <img
                                    src={img.url}
                                    alt="Image"
                                    className={`w-full h-full object-cover rounded-md ${
                                        loadingIndexes.has(index)
                                            ? "opacity-50"
                                            : "opacity-100"
                                    }`}
                                />
                            </div>

                            {/* Script and Prompt */}
                            <div className="col-span-2 text-2xl flex flex-col gap-4">
                                <div>
                                    <p className="font-semibold text-gray-800 text-xl">
                                        Script:
                                    </p>
                                    <p className="text-gray-600">
                                        {img.content}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-xl">
                                        Prompt (Description):
                                    </p>
                                    <p className="text-gray-600">
                                        {img.prompt}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Regenerate Button */}
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => handleRegenerate(index)}
                                className="px-4 py-4 cursor-pointer text-2xl bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                disabled={loadingIndexes.has(index)} // Vô hiệu hóa nút khi đang loading
                            >
                                {loadingIndexes.has(index)
                                    ? "Đang tạo lại..."
                                    : "Tạo lại"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-8 my-10">
                <button
                    onClick={openModal}
                    className="px-4 cursor-pointer py-4 text-2xl bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                    Lưu bản nháp
                </button>
                <button className="px-4 cursor-pointer py-4 text-2xl bg-black text-white rounded-md hover:bg-gray-800">
                    Tạo Video
                </button>
            </div>
            <DraftModal
                videoData={videoData}
                setVideoData={setVideoData}
                open={isModalOpen}
                onClose={closeModal}
            />
        </div>
    );
}
