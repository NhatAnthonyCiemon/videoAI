"use client";
import VideoItem from "./VideoItem";
import InforVideo from "@/types/inforVideo";
import Pagination from "./Pagination";
import { useState } from "react";
import VideoPopup from "@/components/ui/videoPopup";

function Videos() {
    const inforVideos: InforVideo[] = [
        { url: "https://www.youtube.com/embed/MbJ72KO5khs", subtitle: "Video 1 - Hướng dẫn sử dụng" },
        { url: "https://www.youtube.com/embed/hOHKltAiKXQ", subtitle: "Video 2 - Giới thiệu sản phẩm" },
        { url: "https://www.youtube.com/embed/6acS2vOxmRI", subtitle: "Video 3 - Video demo" },
        { url: "https://www.youtube.com/embed/fnlJw9H0xAM", subtitle: "Video 4 - Tạo video nhanh" },
        { url: "https://www.youtube.com/embed/NlC3tRmQrP0", subtitle: "Video 5 - Mẹo hay" },
        { url: "https://www.youtube.com/embed/5rFMFgv81YU", subtitle: "Video 6 - Hướng dẫn chi tiết" },
        { url: "https://www.youtube.com/embed/QX9Ox5-_GTw", subtitle: "Video 7 - Giới thiệu tính năng" },
        { url: "https://www.youtube.com/embed/Wo2G9740xyE", subtitle: "Video 8 - Xu hướng mới" },
        { url: "https://www.youtube.com/embed/7XPGU7dmZXg", subtitle: "Video 9 - Mẫu video" },
    ];

    const [curpage, setCurpage] = useState(1);
    const [totalPages, setTotalPages] = useState(20);
    const [popupVideo, setPopupVideo] = useState<{ url: string; subtitle: string } | null>(null);

    return (
        <>
            <div className="grid grid-cols-3 gap-x-5 gap-y-10 mt-[40px]">
                {inforVideos.map((inforVideo, index) => (
                    <VideoItem
                        key={index}
                        inforVideo={inforVideo}
                        onViewClick={() => setPopupVideo(inforVideo)}
                        onClickVideo={() => setPopupVideo(inforVideo)}
                    />
                ))}
            </div>

            <Pagination
                curpage={curpage}
                totalPages={totalPages}
                onPageChange={setCurpage}
            />

            {/* Popup video */}
            {popupVideo && (
                <VideoPopup
                    url={popupVideo.url}
                    subtitle={popupVideo.subtitle}
                    onClose={() => setPopupVideo(null)}
                />
            )}
        </>
    );
}

export default Videos;
