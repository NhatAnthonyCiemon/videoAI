"use client";
import React, { useState, useEffect } from "react";
import Notification2 from "./Notification2";
import fetchApi from "@/lib/api/fetch";
import HttpMethod from "@/types/httpMethos";

interface VideoData {
    id: string;
    name: string;
    subtitle: string;
    urlyoutube: string | null;
    urlfacebook: string | null;
    [key: string]: any;
}

interface UploadData {
    youtubeVideo?: {
        id: string;
        youtubeUrl: string;
    };
    facebookVideo?: {
        id: string;
        facebookUrl: string;
    };
    databaseVideo: {
        id: string;
        name: string;
        urlyoutube?: string;
        urlfacebook?: string;
        [key: string]: any;
    };
}

interface APIResponse<T> {
    mes: string;
    status: number;
    data?: T;
    message?: string;
}

interface SharePlatformPopupProps {
    videoId: string;
    platform: "youtube" | "facebook" | "tiktok";
    videoUrl: string;
    onClose: () => void;
}

const SharePlatformPopup: React.FC<SharePlatformPopupProps> = ({
    videoId,
    platform,
    videoUrl,
    onClose,
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const url = `http://localhost:4000/video/getVideoInfo/${videoId}`;
                const res = await fetchApi<VideoData>(url, HttpMethod.GET);

                if (res.mes === "success" && res.status === 200) {
                    if (!res.data) {
                        throw new Error("Không tìm thấy dữ liệu video");
                    }
                    const video = res.data;
                    setTitle(video.name || "");
                    setDescription(video.subtitle || "");
                } else {
                    throw new Error(res.message || "Lỗi khi lấy thông tin video");
                }
            } catch (error: any) {
                console.error("Error fetching video:", error.message);
                setNotification({ message: "Lỗi khi lấy thông tin video", type: "error" });
            }
        };
        fetchVideo();
    }, [videoId]);

    const handleUpload = async () => {
        if (platform !== "youtube" && platform !== "facebook") {
            setNotification({ message: "Chỉ hỗ trợ đăng video lên YouTube hoặc Facebook", type: "error" });
            return;
        }

        setLoading(true);
        try {
            const url = platform === "youtube"
                ? "http://localhost:4000/video/uploadYoutube"
                : "http://localhost:4000/video/uploadFacebook";
            const res = await fetchApi<UploadData>(url, HttpMethod.POST, {
                videoUrl,
                cloudinaryPublicId: videoId,
                title,
                description,
            });

            if (res.mes === "success" && res.status === 200) {
                if (!res.data) {
                    throw new Error("Không nhận được dữ liệu phản hồi từ server");
                }
                const shareUrl = platform === "youtube"
                    ? res.data.youtubeVideo?.youtubeUrl
                    : res.data.facebookVideo?.facebookUrl;
                if (!shareUrl) {
                    throw new Error("Không nhận được URL video từ server");
                }
                console.log(`${platform} Video URL:`, shareUrl);

                try {
                    const saveShareRes = await fetchApi<APIResponse<null>>(
                        "http://localhost:4000/share/save",
                        HttpMethod.POST,
                        {
                            videoId,
                            platform,
                            url: shareUrl,
                        }
                    );

                    if (saveShareRes.mes !== "success" || saveShareRes.status !== 200) {
                        throw new Error(saveShareRes.message || "Lỗi khi lưu URL chia sẻ");
                    }
                } catch (error: any) {
                    console.error("Error saving share URL:", error.message);
                    setNotification({
                        message: `Lưu URL chia sẻ thất bại: ${error.message}`,
                        type: "error",
                    });
                    setLoading(false);
                    return;
                }

                setNotification({
                    message: `Đăng video thành công! URL: ${shareUrl}`,
                    type: "success",
                });
                navigator.clipboard.writeText(shareUrl);
            } else {
                throw new Error(res.message || "Lỗi khi đăng video");
            }
        } catch (error: any) {
            console.error(`Error uploading video to ${platform}:`, error.message);
            setNotification({ message: `Lỗi khi đăng video: ${error.message}`, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    const handleNotificationClose = () => {
        setNotification(null);
        if (notification?.type === "success") {
            onClose(); // Chỉ đóng popup khi notification là thành công
        }
    };

    return (
        <div className="fixed inset-0 bg-[#201f1f86] flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full h-full max-h-[400px] max-w-[600px] p-8 mx-4">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Đăng video lên {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </h2>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold text-xl mb-3">Tiêu đề</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tiêu đề video"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold text-xl mb-3">Mô tả</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 border rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mô tả video"
                        rows={9}
                    />
                </div>
                <div className="flex justify-end space-x-6">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg text-lg hover:bg-gray-400"
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleUpload}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? "Đang đăng..." : "OK"}
                    </button>
                </div>
            </div>
            {notification && (
                <Notification2
                    isOpen={!!notification}
                    message={notification?.message || ""}
                    onClose={handleNotificationClose}
                />
            )}
        </div>
    );
};

export default SharePlatformPopup;