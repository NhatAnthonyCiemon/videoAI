"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import "../homepage_style.css";
import Header from "@/components/layout/header";
import { useState } from "react";
import { useRouter } from "next/navigation";
import VideoPopup from "@/components/ui/videoPopup";

export default function HomePage() {
    type Platform = "Tiktok" | "YouTube" | "Twitter" | "Instagram";
    const router = useRouter();
    const trendData = {
        Tiktok: [
            "Hướng dẫn bán hàng",
            "Dance challenge",
            "Giới thiệu sản phẩm",
            "Du lịch khám phá",
            "DIY",
            "Thử thách nhảy",
            "Mẹo vặt",
            "Mua sắm trực tuyến",
        ],
        YouTube: [
            "Review sản phẩm",
            "Vlog",
            "Tutorial",
            "Chế tạo đồ thủ công",
            "Phản ứng với video",
            "Clip hài hước",
            "Video giải trí",
            "Video hát live",
        ],
        Twitter: [
            "Chủ đề nóng",
            "Tin tức",
            "Câu nói viral",
            "Meme mới",
            "Chia sẻ câu chuyện",
            "Cập nhật thể thao",
            "Phỏng vấn người nổi tiếng",
            "Khảo sát cộng đồng",
        ],
        Instagram: [
            "Story ý tưởng",
            "Ảnh đẹp",
            "Reels trend",
            "Quay phim phong cảnh",
            "Ảnh sản phẩm",
            "Video thử thách",
            "Câu chuyện ngắn",
            "Giới thiệu thương hiệu",
            "Chụp ảnh động vật",
        ],
    };

    const [selected, setSelected] = useState<Platform>("Tiktok");

    const videos = [
        {
            url: "https://www.youtube.com/embed/MbJ72KO5khs",
            subtitle: "Video 1 - Hướng dẫn sử dụng",
        },
        {
            url: "https://www.youtube.com/embed/hOHKltAiKXQ",
            subtitle: "Video 2 - Giới thiệu sản phẩm",
        },
        {
            url: "https://www.youtube.com/embed/6acS2vOxmRI",
            subtitle: "Video 3 - Video demo",
        },
        {
            url: "https://www.youtube.com/embed/fnlJw9H0xAM",
            subtitle: "Video 4 - Tạo video nhanh",
        },
        {
            url: "https://www.youtube.com/embed/NlC3tRmQrP0",
            subtitle: "Video 5 - Mẹo hay",
        },
        {
            url: "https://www.youtube.com/embed/5rFMFgv81YU",
            subtitle: "Video 6 - Hướng dẫn chi tiết",
        },
        {
            url: "https://www.youtube.com/embed/QX9Ox5-_GTw",
            subtitle: "Video 7 - Giới thiệu tính năng",
        },
        {
            url: "https://www.youtube.com/embed/Wo2G9740xyE",
            subtitle: "Video 8 - Xu hướng mới",
        },
        {
            url: "https://www.youtube.com/embed/7XPGU7dmZXg",
            subtitle: "Video 9 - Mẫu video",
        },
        {
            url: "https://www.youtube.com/embed/fHI8X4OXluQ",
            subtitle: "Video 10 - Thủ thuật tạo video",
        },
        {
            url: "https://www.youtube.com/embed/u6lihZAcy4s",
            subtitle: "Video 11 - Video nổi bật",
        },
        {
            url: "https://www.youtube.com/embed/KZoipAb2fo4",
            subtitle: "Video 12 - Tổng hợp video",
        },
    ];

    // State quản lý video đang mở popup
    const [popupVideo, setPopupVideo] = useState<{ url: string; subtitle: string } | null>(null);

    return (
        <main className="w-full min-h-screen bg-black text-white overflow-x-hidden text-[19px] md:text-[20px] lg:text-[21px] leading-relaxed">
            <Header />

            {/* Hero */}
            <section
                className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white bg-cover bg-right bg-no-repeat py-50 md:py-80"
                style={{ backgroundImage: "url(/img/robot.png)" }}
            >
                <div className="w-full mx-auto px-10 sm:px-20 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 space-y-6">
                        <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold leading-tight">
                            Biến ý tưởng thành video chỉ trong 1 phút!
                        </h1>
                        <p className="text-4xl text-[#EE6767] opacity-90 font-bold">
                            Sáng tạo video ngắn với AI - nhanh chóng, đơn giản,
                            chuyên nghiệp
                        </p>
                        <p className="text-4xl opacity-90">
                            Khám phá cách tạo ra những video Tiktok, Instagram,
                            Youtube Shorts đỉnh cao từ từ khóa xu hướng, AI tự
                            động sinh kịch bản, giọng đọc và video hoàn chỉnh
                            cho bạn
                        </p>
                        <div className="pt-4 flex flex-wrap gap-4">
                            <Button
                                onClick={() => router.push("/create")}
                                className="bg-green-500 hover:bg-green-600 text-white text-2xl px-8 py-9 rounded-xl"
                            >
                                Bắt đầu ngay
                            </Button>
                            <Button
                                variant="link"
                                className="text-white text-2xl p-9"
                            >
                                Xem thử video mẫu
                            </Button>
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
                        {/* Phần robot hoặc bất kỳ hình ảnh nào bạn muốn thêm */}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-pink-50 text-black py-24 px-6">
                <div className="w-full max-w-screen-lg xl:max-w-[70%] mx-auto text-center space-y-12">
                    <h2 className="text-5xl lg:text-6xl font-bold">
                        Tính Năng Nổi Bật
                    </h2>
                    <p className="text-gray-600 text-2xl">
                        Khám phá các công cụ mạnh mẽ giúp bạn tạo ra những video
                        ngắn chất lượng cao
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[
                            {
                                title: "Tạo Video Tự Động",
                                desc: "Từ ý tưởng đơn giản đến video hoàn chỉnh chỉ trong vài cú nhấp.",
                                icon: (
                                    <svg
                                        className="w-10 h-10 text-pink-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 11l4.553-4.553a1.414 1.414 0 00-2-2L13 9m2 2l-9 9a1.5 1.5 0 01-2.121-2.121l9-9"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 5h.01M5 9h.01M9 5h.01"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                title: "Chỉnh Sửa Dễ Dàng",
                                desc: "Lồng tiếng tự động với giọng nói AI tự nhiên, chân thực.",
                                icon: (
                                    <svg
                                        className="w-10 h-10 text-pink-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                title: "Phụ Đề Tự Động",
                                desc: "Thêm logo, đổi font, màu nền, chọn phong cách theo ý bạn.",
                                icon: (
                                    <svg
                                        className="w-10 h-10 text-pink-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 6h16M4 10h16M4 14h10m-10 4h6"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                title: "Gợi Ý Theo Chủ Đề",
                                desc: "Khám phá các chủ đề nổi bật và được gợi ý thông minh từ AI.",
                                icon: (
                                    <svg
                                        className="w-10 h-10 text-pink-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 2a7 7 0 00-7 7c0 2.485 1.5 4.623 3.5 6v2a1.5 1.5 0 001.5 1.5h4a1.5 1.5 0 001.5-1.5v-2c2-1.377 3.5-3.515 3.5-6a7 7 0 00-7-7z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 21h6"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                title: "Xuất Video Nhanh Chóng",
                                desc: "Tải về nhanh chóng hoặc chia sẻ lên mạng xã hội chỉ 1 click.",
                                icon: (
                                    <svg
                                        className="w-10 h-10 text-pink-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4v12m0 0l-3-3m3 3l3-3M4 20h16"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                title: "Xu Hướng AI Mới",
                                desc: "Cập nhật tính năng & mẫu video mới nhất từ AI mỗi tuần.",
                                icon: (
                                    <svg
                                        className="w-10 h-10 text-pink-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 17.75l-6.172 3.244L7 14.708 2.5 9.755l6.372-.927L12 3l3.128 5.828 6.372.927-4.5 4.953 1.172 6.286z"
                                        />
                                    </svg>
                                ),
                            },
                        ].map(({ title, desc, icon }, i) => (
                            <div
                                key={i}
                                className="bg-white p-10 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center text-center space-y-6 min-h-[200px]"
                            >
                                <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
                                    {icon}
                                </div>
                                <h3 className="text-4xl font-semibold">
                                    {title}
                                </h3>
                                <p className="text-gray-600 text-2xl">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Search */}
            <section className="bg-white py-24 px-6 text-black">
                <div className="w-full max-w-screen-lg xl:max-w-[70%] mx-auto space-y-10 text-center">
                    <h2 className="text-5xl lg:text-6xl font-bold">
                        Tìm Kiếm & Khám Phá Xu Hướng
                    </h2>
                    <p className="text-gray-600 text-2xl">
                        Chọn nền tảng để xem trend nổi bật hiện nay
                    </p>
                    <input
                        type="text"
                        placeholder="Gõ từ khóa: tiktok, giới thiệu, bán hàng..."
                        className="w-full border border-gray-300 rounded-full py-6 px-8 text-3xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    />

                    {/* Tabs */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-8">
                        {(Object.keys(trendData) as Platform[]).map(
                            (platform) => (
                                <div
                                    key={platform}
                                    onClick={() => setSelected(platform)}
                                    className={`cursor-pointer rounded-xl p-6 transition-all duration-300 text-center border-2
                ${selected === platform
                                            ? "border-fuchsia-600 bg-fuchsia-100"
                                            : "border-gray-300 hover:border-fuchsia-400"
                                        }`}
                                >
                                    <h3 className="text-3xl font-semibold text-fuchsia-700">
                                        {platform}
                                    </h3>
                                </div>
                            )
                        )}
                    </div>

                    {/* Trend list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
                        {trendData[selected].map((trend, i) => (
                            <div
                                key={i}
                                className="p-5 bg-gray-50 shadow-md rounded-lg hover:shadow-xl transition-all duration-200 cursor-pointer border border-gray-200 hover:border-fuchsia-300"
                            >
                                <p className="text-2xl font-medium text-gray-800">
                                    #{trend}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Videos */}
            <section className="bg-blue-50 py-24 px-6 text-black">
                <div className="w-full max-w-screen-lg xl:max-w-[70%] mx-auto text-center space-y-12">
                    <h2 className="text-5xl lg:text-6xl font-bold">Video Nổi Bật</h2>
                    <p className="text-gray-600 text-2xl">Khám phá các video ngắn hấp dẫn</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {videos.map(({ url, subtitle }, i) => (
                            <div
                                key={i}
                                className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg relative cursor-pointer"
                                onClick={() => setPopupVideo({ url, subtitle })}
                            >
                                <iframe
                                    src={url}
                                    title={`YouTube video ${i}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full pointer-events-none" // để không click iframe mà click div
                                />
                            </div>
                        ))}
                    </div>

                    <Button className="mt-10 px-12 py-8 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full text-xl">
                        Xem thêm video
                    </Button>
                </div>
            </section>

            {/* Popup video */}
            {popupVideo && (
                <VideoPopup
                    url={popupVideo.url}
                    subtitle={popupVideo.subtitle}
                    onClose={() => setPopupVideo(null)}
                />
            )}

            {/* CTA */}
            <section className="bg-black text-white text-center py-32 px-6">
                <div className="w-full max-w-screen-lg xl:max-w-[70%] mx-auto space-y-8">
                    <h2 className="text-6xl font-bold">
                        Bắt Đầu Tạo Video Ngắn Của Bạn Ngay Hôm nay
                    </h2>
                    <p className="text-gray-400 text-2xl">
                        Chỉ mất vài bước đơn giản để có một video chuyên nghiệp
                        từ AI
                    </p>
                    <Button className="px-12 py-8 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full text-xl">
                        Tạo Video
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white text-center text-gray-500 py-8 text-lg">
                © 2025 AI Short Video. All rights reserved.
            </footer>
        </main>
    );
}
