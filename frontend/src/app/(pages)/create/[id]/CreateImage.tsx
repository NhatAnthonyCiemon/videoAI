"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Video from "@/types/Video";
import useOverlay from "@/hooks/useOverlay";
import DraftModal from "@/components/ui/DraftModal";
import videoClass from "@/lib/Video";
import fetchApi from "@/lib/api/fetch";
import { Image_video } from "@/types/Video";
import { Button } from "@/components/ui/button";
import HttpMethod from "@/types/httpMethos";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import Mp3Uploader from "@/components/ui/upFileMP3";
import uploadMp3ToCloud from "@/lib/uploadMp3ToCloud";
import AnimationSelector from "@/components/ui/animation";
import io from "socket.io-client";
type SocketType = ReturnType<typeof io>;
let socket: SocketType;

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
    isCustomVoice,
}: {
    setWhichActive: (Active: number) => void;
    videoData: Video;
    setVideoData: (video: Video) => void;
    isPreparing: boolean;
    setIsPreparing: (Active: boolean) => void;
    isCustomVoice: boolean;
}) {
    console.log("videoData hiện tại:", videoData); // Thêm dòng này

    const { isModalOpen, openModal, closeModal } = useOverlay();
    const [loadingIndexes, setLoadingIndexes] = useState<Set<number>>(
        new Set()
    );
    const [message, setMessage] = useState<string>(
        "Đang làm việc với âm thanh... [1/4]"
    );
    useEffect(() => {
        // Kết nối đến server Socket.IO
        socket = io("http://localhost:4000");

        // lắng nghe sự kiện tạo Video
        socket.on("createVideo", (data: string) => {
            setMessage(data);
        });
        return () => {
            // Ngắt kết nối khi component unmount
            socket.disconnect();
        };
    }, []);

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
            const newImage = res.data!!;
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

    const handleCreateVideo = async () => {
        if (videoData.step === 2) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
            const newVideoData = videoClass.updateVideo(videoData, "url", "");
            setVideoData(videoClass.updateVideo(newVideoData, "step", 1));
        }
        setIsPreparing(true);
        setWhichActive(2);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

        // === Upload mp3 lên cloud nếu có file local ===
        const image_video = [...videoData.image_video];
        console.log("image_video trước khi upload mp3:", image_video);

        const uploadMp3Tasks = image_video.map(async (img, i) => {
            const file = img.file_mp3;
            if (file && file instanceof File) {
                const url = await uploadMp3ToCloud(file);
                if (url) {
                    img.url_mp3 = url;
                } else {
                    showErrorToast(`Upload mp3 cho ảnh ${i + 1} thất bại!`);
                    throw new Error(`Upload mp3 cho ảnh ${i + 1} thất bại!`);
                }
            }
        });

        try {
            await Promise.all(uploadMp3Tasks);
        } catch (err) {
            setIsPreparing(false);
            return;
        }
        // Cập nhật lại videoData với url mp3 mới
        setVideoData(
            videoClass.updateVideo(videoData, "image_video", image_video)
        );

        // === Tiếp tục gọi API tạo video ===
        const res = await fetchApi<{
            url: string;
            durations: number[];
            durationAll: number;
            quality: string;
            bg_music: boolean;
            thumbnail: string;
            socketID: string;
        }>(`http://localhost:4000/content/createvideo`, HttpMethod.POST, {
            ...videoData,
            image_video, // Đảm bảo truyền image_video đã có url mp3
            socketID: socket.id, // Truyền socket ID để nhận thông báo
        });
        if (res.mes === "success") {
            const newVideoData = videoClass.updateVideo(
                videoData,
                "url",
                res.data!!.url
            );

            newVideoData.image_video.forEach((img, index) => {
                img.start_time = res.data!!.durations[index];
                if (index !== newVideoData.image_video.length - 1) {
                    img.end_time = res.data!!.durations[index + 1] - 0.01;
                } else {
                    img.end_time = res.data!!.durationAll;
                }
            });

            const newVideoData3 = videoClass.updateVideo(
                newVideoData,
                "duration",
                res.data!!.durationAll
            );
            const newVideoData4 = videoClass.updateVideo(
                newVideoData3,
                "thumbnail",
                res.data!!.thumbnail
            );
            const newVideoData5 = videoClass.updateVideo(
                newVideoData4,
                "quality",
                res.data!!.quality
            );
            const newVideoData6 = videoClass.updateVideo(
                newVideoData5,
                "is_bg_music",
                res.data!!.bg_music
            );

            const newVideoData2 = videoClass.updateVideo(
                newVideoData6,
                "step",
                2
            );
            setVideoData(newVideoData2);
            setIsPreparing(false);
        } else {
            throw new Error("Invalid response format");
        }
    };

    return (
        <div>
            {!isPreparing && (
                <>
                    <div className="flex flex-col gap-8">
                        {videoData.image_video.map((img, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-md shadow-md"
                            >
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                                    Ảnh {index + 1}:
                                </h2>
                                <div className="grid grid-cols-3 gap-9">
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
                                            src={img.url || undefined}
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
                                            <div className="font-semibold flex gap-5 text-gray-800 text-xl">
                                                <span>Script:</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="size-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                                    />
                                                </svg>
                                            </div>
                                            {isCustomVoice ? (
                                                <Mp3Uploader
                                                    urlMp3={img.url_mp3 || null} // Nếu có url mp3 từ backend, truyền vào
                                                    onUpload={(file) => {
                                                        // Lưu file vào đúng ảnh
                                                        const image_video = [
                                                            ...videoData.image_video,
                                                        ];
                                                        image_video[
                                                            index
                                                        ].file_mp3 = file; // hoặc có thể upload lên cloud trước rồi lưu url
                                                        setVideoData(
                                                            videoClass.updateVideo(
                                                                videoData,
                                                                "image_video",
                                                                image_video
                                                            )
                                                        );
                                                        // In ra tên file để test
                                                        console.log(
                                                            "File mp3 đã chọn:",
                                                            videoData
                                                                .image_video[
                                                                index
                                                            ].file_mp3?.name
                                                        );
                                                    }}
                                                />
                                            ) : (
                                                <textarea
                                                    className="text-gray-600 px-[5px] w-full rounded-md py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-gray-400 transition resize-none"
                                                    style={{
                                                        border: "none",
                                                        minHeight: "32px",
                                                        height: "auto",
                                                        overflow: "hidden",
                                                    }}
                                                    value={img.content}
                                                    onChange={(e) => {
                                                        const image_video = [
                                                            ...videoData.image_video,
                                                        ];
                                                        image_video[
                                                            index
                                                        ].content =
                                                            e.target.value;
                                                        setVideoData(
                                                            videoClass.updateVideo(
                                                                videoData,
                                                                "image_video",
                                                                image_video
                                                            )
                                                        );
                                                    }}
                                                />
                                            )}
                                            <AnimationSelector
                                                video={videoData}
                                                index={index}
                                                onChangeAnim={(
                                                    animValue: number
                                                ) => {
                                                    const image_video = [
                                                        ...videoData.image_video,
                                                    ];
                                                    image_video[index].anim =
                                                        animValue;
                                                    setVideoData(
                                                        videoClass.updateVideo(
                                                            videoData,
                                                            "image_video",
                                                            image_video
                                                        )
                                                    );
                                                }}
                                            />
                                        </div>

                                        <div className="ml-[-5px]">
                                            <p className="w-[150px] ml-[5px] relative font-semibold text-gray-800 text-xl">
                                                Prompt (Description):
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="size-6 absolute top-[50%] right-0 translate-y-[-50%]"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                                    />
                                                </svg>
                                            </p>
                                            <textarea
                                                spellCheck="false"
                                                ref={(el) => {
                                                    if (el) {
                                                        el.style.height =
                                                            "auto";
                                                        el.style.height =
                                                            el.scrollHeight +
                                                            "px";
                                                    }
                                                }}
                                                className="text-gray-600 px-[5px] w-full rounded-md py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-gray-400 transition resize-none"
                                                style={{
                                                    border: "none",
                                                    minHeight: "32px",
                                                    height: "auto",
                                                    overflow: "hidden",
                                                }}
                                                value={img.prompt}
                                                onChange={(e) => {
                                                    const textarea = e.target;
                                                    textarea.style.height =
                                                        "auto"; // reset trước
                                                    textarea.style.height =
                                                        textarea.scrollHeight +
                                                        "px"; // set lại theo nội dung

                                                    const image_video = [
                                                        ...videoData.image_video,
                                                    ];
                                                    image_video[index].prompt =
                                                        e.target.value;
                                                    setVideoData(
                                                        videoClass.updateVideo(
                                                            videoData,
                                                            "image_video",
                                                            image_video
                                                        )
                                                    );
                                                }}
                                            />
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
                        <Button
                            onClick={openModal}
                            className="cursor-pointer text-2xl h-[40px] py-4 min-w-[100px] bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                        >
                            Lưu bản nháp
                        </Button>
                        <Button
                            onClick={handleCreateVideo}
                            className="cursor-pointer text-2xl px-4 h-[40px] min-w-[100px] bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            {videoData.step === 1 ? "Tạo video" : "Tạo lại"}
                        </Button>
                    </div>
                </>
            )}
            <DraftModal
                videoData={videoData}
                setVideoData={setVideoData}
                open={isModalOpen}
                onClose={closeModal}
            />
            <LoadingOverlay isPreparing={isPreparing} message={message} />
        </div>
    );
}
