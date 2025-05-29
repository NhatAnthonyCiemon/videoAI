import { useState } from "react";
import { FaDownload, FaShareAlt, FaSave } from "react-icons/fa";
import Notification from "@/components/ui/Notification";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

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
                url_edit: videoUrl
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
            setMes("Lưu video edit thành công!")
        } catch (err) {
            console.error("Save error:", err);
            setShowNot(true);
            setMes("Có lỗi xảy ra! Hãy thử lại!")
        }
    };

    const shareToPlatform = (platform: string) => {
        const shareInfo = { title, description, videoUrl };
        console.log(`📤 Chia sẻ lên ${platform}:`, shareInfo);
        alert(`Đã chuẩn bị chia sẻ lên ${platform}!\nTiêu đề: ${title}\nMô tả: ${description}`);
    };

    return (
        <div className="fixed inset-0 bg-[#201f1f86] flex items-center justify-center z-50 text-2xl">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-[900px] p-6 mx-4 animate-fade-in">
                <h2 className="text-4xl font-bold mb-10 mt-3 text-center text-gray-800">
                    🎉 Video đã xuất thành công!
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* LEFT: Video Preview */}
                    <div className="flex flex-col h-full">
                        <video
                            controls
                            className="w-full rounded-xl shadow-md border border-gray-200 flex-1"
                        >
                            <source src={videoUrl} type="video/mp4" />
                            Trình duyệt của bạn không hỗ trợ video.
                        </video>
                    </div>

                    {/* RIGHT: Actions */}
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
                                    onClick={() => shareToPlatform("facebook")}
                                    className="bg-blue-800 text-white flex-1 py-2 rounded hover:bg-blue-900 transition"
                                >
                                    Facebook
                                </button>
                                <button
                                    onClick={() => shareToPlatform("youtube")}
                                    className="bg-red-600 text-white flex-1 py-2 rounded hover:bg-red-700 transition"
                                >
                                    YouTube
                                </button>
                                <button
                                    onClick={() => shareToPlatform("tiktok")}
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
                <>
                    <Notification
                        message={mes}
                        type="success"
                        onClose={() => {
                            // onClose();
                            document.body.style.overflow = "auto";
                        }}
                    />
                </>
            )}
        </div>
    );
}
