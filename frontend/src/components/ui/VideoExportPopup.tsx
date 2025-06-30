"use client";
import { useState } from "react";
import { FaDownload, FaShareAlt, FaSave } from "react-icons/fa";
import Notification from "@/components/ui/Notification";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import SharePlatformPopup from "@/components/ui/SharePlatformPopup";
import fetchApi from "@/lib/api/fetch";
import HttpMethod from "@/types/httpMethos";

interface CheckYoutubeResponse {
    isAuthenticated: boolean;
}

interface CheckFacebookResponse {
    isAuthenticated: boolean;
}

interface YoutubeAuthResponse {
    authUrl: string;
}

interface FacebookAuthResponse {
    authUrl: string;
}

export default function VideoExportPopup({
    videoUrl,
    videoid,
    onClose,
}: {
    videoUrl: string;
    videoid: string;
    onClose: () => void;
}) {
    const [isCopied, setIsCopied] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [showNot, setShowNot] = useState(false);
    const [mes, setMes] = useState("");
    const [isLoad, setIsLoad] = useState(false);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<
        "youtube" | "facebook" | "tiktok" | null
    >(null);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(videoUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleDownload = async () => {
        try {
            setIsLoad(true);
            const response = await fetch(videoUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "video/mp4",
                },
            });

            if (!response.ok) {
                throw new Error("Không thể tải video");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "exported_video.mp4";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setIsLoad(false);
        } catch (err) {
            console.error("Download error:", err);
            setIsLoad(false);
            setShowNot(true);
            setMes("Lỗi tải xuống video! Vui lòng thử lại.");
        }
    };

    const handleSave = async () => {
        try {
            const payload = {
                video_id: videoid,
                url_edit: videoUrl,
            };

            setIsLoad(true);

            const response = await fetch("http://localhost:4000/edit/save-video", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Lỗi từ server");
            }

            const result = await response.json();

            console.log("Save result:", result);

            setIsLoad(false);
            setShowNot(true);
            setMes("Lưu video edit thành công!");
        } catch (err) {
            console.error("Save error:", err);
            setIsLoad(false);
            setShowNot(true);
            setMes("Có lỗi xảy ra! Hãy thử lại!");
        }
    };

    const handleShareToPlatform = async (platform: "youtube" | "facebook" | "tiktok") => {
        if (platform === "youtube") {
            try {
                console.log("Clicked YouTube");
                const res = await fetchApi<CheckYoutubeResponse>(
                    "http://localhost:4000/auth/youtube/check",
                    HttpMethod.GET
                );
                if (!res.data?.isAuthenticated) {
                    const authRes = await fetchApi<YoutubeAuthResponse>(
                        "http://localhost:4000/auth/youtube",
                        HttpMethod.GET
                    );
                    if (authRes.data?.authUrl) {
                        const authWindow = window.open(authRes.data.authUrl, "_blank", "width=600,height=600");
                        if (!authWindow) {
                            setShowNot(true);
                            setMes("Không thể mở cửa sổ xác thực. Vui lòng cho phép cửa sổ bật lên.");
                            return;
                        }
                        const checkWindowClosed = setInterval(() => {
                            if (authWindow.closed) {
                                clearInterval(checkWindowClosed);
                                checkAuthStatus("youtube");
                            }
                        }, 1000);
                    } else {
                        throw new Error("Không nhận được URL xác thực");
                    }
                } else {
                    setSelectedPlatform(platform);
                    setShowSharePopup(true);
                }
            } catch (error: any) {
                setShowNot(true);
                setMes("Lỗi kiểm tra xác thực YouTube: " + (error.message || "Không xác định"));
            }
        } else if (platform === "facebook") {
            try {
                console.log("Clicked Facebook");
                const res = await fetchApi<CheckFacebookResponse>(
                    "http://localhost:4000/auth/facebook/check",
                    HttpMethod.GET
                );
                console.log(res)
                if (!res.data?.isAuthenticated) {
                    const authRes = await fetchApi<FacebookAuthResponse>(
                        "http://localhost:4000/auth/facebook",
                        HttpMethod.GET
                    );
                    if (authRes.data?.authUrl) {
                        const authWindow = window.open(authRes.data.authUrl, "_blank", "width=600,height=600");
                        if (!authWindow) {
                            setShowNot(true);
                            setMes("Không thể mở cửa sổ xác thực. Vui lòng cho phép cửa sổ bật lên.");
                            return;
                        }
                        const checkWindowClosed = setInterval(() => {
                            if (authWindow.closed) {
                                clearInterval(checkWindowClosed);
                                checkAuthStatus("facebook");
                            }
                        }, 1000);
                    } else {
                        throw new Error("Không nhận được URL xác thực");
                    }
                } else {
                    setSelectedPlatform(platform);
                    setShowSharePopup(true);
                }
            } catch (error: any) {
                setShowNot(true);
                setMes("Lỗi kiểm tra xác thực Facebook: " + (error.message || "Không xác định"));
            }
        } else {
            const shareInfo = { title, description, videoUrl };
            console.log(`📤 Chia sẻ lên ${platform}:`, shareInfo);
            alert(`Đã chuẩn bị chia sẻ lên ${platform}!\nTiêu đề: ${title}\nMô tả: ${description}`);
        }
    };

    const checkAuthStatus = async (platform: "youtube" | "facebook") => {
        try {
            const res = await fetchApi<CheckYoutubeResponse | CheckFacebookResponse>(
                `http://localhost:4000/auth/${platform}/check`,
                HttpMethod.GET
            );
            if (res.data?.isAuthenticated) {
                setSelectedPlatform(platform);
                setShowSharePopup(true);
            } else {
                setShowNot(true);
                setMes(`Xác thực ${platform} không thành công. Vui lòng thử lại.`);
            }
        } catch (error: any) {
            setShowNot(true);
            setMes(`Lỗi kiểm tra xác thực ${platform}: ` + (error.message || "Không xác định"));
        }
    };

    return (
        <div className="fixed inset-0 bg-[#201f1f86] flex items-center justify-center z-50 text-2xl">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-[900px] p-6 mx-4 animate-fade-in">
                <h2 className="text-4xl font-bold mb-10 mt-3 text-center text-gray-800">
                    🎉 Video đã xuất thành công!
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col h-full">
                        <video
                            controls
                            className="w-full rounded-xl shadow-md border border-gray-200 flex-1"
                        >
                            <source src={videoUrl} type="video/mp4" />
                            Trình duyệt của bạn không hỗ trợ video.
                        </video>
                    </div>

                    <div className="flex flex-col justify-between h-full">
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleCopyLink}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                            >
                                <FaShareAlt /> {isCopied ? "Đã sao chép!" : "Sao chép link"}
                            </button>
                            <button
                                onClick={handleDownload}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                            >
                                <FaDownload /> Tải xuống
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
                            >
                                <FaSave /> Lưu thông tin
                            </button>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-2xl font-semibold mb-2">📤 Chia sẻ video</h3>
                            <input
                                type="text"
                                placeholder="Tiêu đề"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring focus:ring-blue-300"
                            />
                            <textarea
                                placeholder="Mô tả"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring focus:ring-blue-300"
                            ></textarea>

                            <div className="flex gap-3 mt-3 justify-between">
                                <button
                                    onClick={() => handleShareToPlatform("facebook")}
                                    className="bg-blue-800 text-white flex-1 py-2 rounded hover:bg-blue-900 transition"
                                >
                                    Facebook
                                </button>
                                <button
                                    onClick={() => handleShareToPlatform("youtube")}
                                    className="bg-red-600 text-white flex-1 py-2 rounded hover:bg-red-700 transition"
                                >
                                    YouTube
                                </button>
                                <button
                                    onClick={() => handleShareToPlatform("tiktok")}
                                    className="bg-black text-white flex-1 py-2 rounded hover:bg-gray-800 transition"
                                >
                                    TikTok
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="mt-10 mb-4 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition w-full"
                >
                    Đóng
                </button>
            </div>

            <LoadingOverlay isPreparing={isLoad} message="Đang xử lý..." />

            {showNot && (
                <Notification
                    message={mes}
                    type="error"
                    onClose={() => {
                        setShowNot(false);
                        document.body.style.overflow = "auto";
                    }}
                />
            )}

            {showSharePopup && selectedPlatform && (
                <SharePlatformPopup
                    videoId={videoid}
                    platform={selectedPlatform}
                    videoUrl={videoUrl}
                    onClose={() => setShowSharePopup(false)}
                />
            )}
        </div>
    );
}