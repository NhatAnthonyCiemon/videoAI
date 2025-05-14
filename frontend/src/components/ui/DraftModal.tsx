import React, { useState } from "react";
import Video from "@/types/Video";
import VideoClass from "@/lib/Video";
import APIResponse from "@/types/apiResponse";
import fetchApi from "@/lib/api/fetch";
import HttpMethod from "@/types/httpMethos";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
    videoData: Video;
    setVideoData: (data: Video) => void;
    open: boolean;
    onClose: () => void;
}

const urlStep = [
    "http://localhost:4000/store/fullcontent",
    "http://localhost:4000/store/image",
    "http://localhost:4000/store/video",
];
const DraftModal: React.FC<Props> = ({
    videoData,
    setVideoData,
    open,
    onClose,
}) => {
    const [isSave, setIsSave] = useState(videoData.name !== "");
    const [isSavedDraft, setIsSavedDraft] = useState(false);
    const [isStatusSave, setStatusSave] = useState(0); // 0: default, 1: success, 2: fail
    const [isLoading, setIsLoading] = useState(false);

    const handleSaveDraft = () => {
        if (!isSave) {
            if (!isSavedDraft) {
                setIsSavedDraft(true);
                return;
            }
            if (videoData.name.length === 0) return;
        }

        setIsLoading(true);
        fetchApi<string>(
            `${urlStep[videoData.step]}`,
            HttpMethod.POST,
            videoData
        ).then((res: APIResponse<string>) => {
            if (res.mes === "success") {
                setStatusSave(1);
                setIsSave(true);
            } else {
                setStatusSave(2);
                setIsSavedDraft(false);
                setVideoData(
                    VideoClass.updateVideo(videoData, "name", "Draft")
                );
            }
            setIsLoading(false);
        });
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onMouseEnter={() => (document.body.style.overflow = "hidden")}
            onMouseLeave={() => (document.body.style.overflow = "auto")}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                {isStatusSave === 0 && (
                    <>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                            {!isSavedDraft
                                ? "Lưu bản nháp"
                                : "Nhập tên bản nháp"}
                        </h2>
                        {!isSavedDraft ? (
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={handleSaveDraft}
                                    disabled={isLoading}
                                    className={`cursor-pointer text-xl px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
                                        isLoading
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {isLoading ? "Đang lưu..." : "Lưu"}
                                </button>
                                <button
                                    onClick={() => {
                                        onClose();
                                        setIsSavedDraft(false);
                                        setStatusSave(0);
                                        setVideoData(
                                            VideoClass.updateVideo(
                                                videoData,
                                                "name",
                                                "Draft"
                                            )
                                        );
                                        document.body.style.overflow = "auto";
                                    }}
                                    disabled={isLoading}
                                    className={`cursor-pointer text-xl px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 ${
                                        isLoading
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    Hủy
                                </button>
                            </div>
                        ) : (
                            <>
                                <Input
                                    type="text"
                                    value={videoData.name}
                                    onChange={(e) =>
                                        setVideoData(
                                            VideoClass.updateVideo(
                                                videoData,
                                                "name",
                                                e.target.value
                                            )
                                        )
                                    }
                                    placeholder="Nhập tên bản nháp"
                                    className="w-full text-xl px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="flex justify-end gap-4 mt-4">
                                    <Button
                                        onClick={handleSaveDraft}
                                        disabled={isLoading}
                                        className="text-xl px-4 h-[35px] bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        {isLoading ? "Đang lưu..." : "Lưu"}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            onClose();
                                            setVideoData(
                                                VideoClass.updateVideo(
                                                    videoData,
                                                    "name",
                                                    "Draft"
                                                )
                                            );
                                            setIsSavedDraft(false);
                                        }}
                                        disabled={isLoading}
                                        className="text-xl px-4 h-[35px] bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                    >
                                        Hủy
                                    </Button>
                                </div>
                            </>
                        )}
                    </>
                )}

                {isStatusSave === 1 && (
                    <>
                        <h2 className="text-2xl font-semibold mb-4 text-green-800">
                            Đã lưu bản nháp thành công
                        </h2>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    onClose();
                                    setStatusSave(0);
                                    setIsSavedDraft(false);
                                    document.body.style.overflow = "auto";
                                }}
                                className="cursor-pointer text-xl px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Xong
                            </button>
                        </div>
                    </>
                )}

                {isStatusSave === 2 && (
                    <>
                        <h2 className="text-2xl font-semibold mb-4 text-red-800">
                            Lưu bản nháp thất bại
                        </h2>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    onClose();
                                    setStatusSave(0);
                                    setIsSavedDraft(false);
                                }}
                                className="cursor-pointer text-xl px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Xong
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DraftModal;
