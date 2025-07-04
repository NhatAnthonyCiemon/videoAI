"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import "../homepage_style.css";
import Header from "@/components/layout/header";
import { useRouter } from "next/navigation";
import VideoPopup from "@/components/ui/videoPopup";
import generateRandomString from "@/lib/generateRandomString";
import fetchApi from "@/lib/api/fetch";
import HttpMethod from "@/types/httpMethos";

export default function HomePage() {
    type Platform = "TikTok" | "YouTube" | "Twitter" | "Instagram";
    const router = useRouter();

    // Dữ liệu tĩnh cho trend
    const trendData = {
        TikTok: [
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

    const [selected, setSelected] = useState<Platform>("TikTok");
    const [videos, setVideos] = useState<{ id: string; url: string; url_edit?: string; subtitle: string; step: string }[]>([]);
    const [popupVideo, setPopupVideo] = useState<{ id: string; url: string; url_edit?: string; subtitle: string; step: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Gọi API để lấy 12 video ngẫu nhiên với status=completed
    useEffect(() => {
        const fetchRandomVideos = async () => {
            try {
                setLoading(true);
                setError(null);

                const url = `http://localhost:4000/video/getRandomVideos?status=completed`;
                const res = await fetchApi<{
                    data: { id: string; url: string; url_edit?: string; subtitle: string; step: string }[];
                }>(url, HttpMethod.GET);

                if (res.message === "success" && res.status === 200) {
                    if (res.data && Array.isArray(res.data)) {
                        setVideos(res.data.slice(0, 12));
                    } else {
                        setVideos([]);
                        console.warn("Dữ liệu video không hợp lệ:", res.data);
                    }
                } else {
                    throw new Error(res.message || "Không thể lấy dữ liệu video");
                }
            } catch (err: any) {
                const errorMessage = err.message || "Lỗi khi tải video ngẫu nhiên";
                setError(errorMessage);
                console.error("Error:", err);
                setVideos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRandomVideos();
    }, []);

    return (
        <main className="w-full min-h-screen bg-black text-white overflow-x-hidden text-[19px] md:text-[20px] lg:text-[21px] leading-relaxed">
            <Header />

            {/* Hero */}
            <section
                className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white bg-cover bg-right bg-no-repeat py-50 md:py-60"
                style={{ backgroundImage: "url(/img/robot.png)" }}
            >
                <div className="w-full mx-auto px-10 sm:px-20 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/3 space-y-6">
                        <h1 className="text-3xl md:text-6xl xl:text-6xl font-bold leading-tight">
                            Biến ý tưởng thành video chỉ trong 1 phút!
                        </h1>
                        <p className="text-3xl text-[#EE6767] opacity-90 font-bold">
                            Sáng tạo video ngắn với AI - nhanh chóng, đơn giản, chuyên nghiệp
                        </p>
                        <p className="text-3xl opacity-90">
                            Khám phá cách tạo ra những video TikTok, Instagram, YouTube Shorts đỉnh cao từ từ khóa xu hướng, AI tự động sinh kịch bản, giọng đọc và video hoàn chỉnh cho bạn
                        </p>
                        <div className="pt-4 flex flex-wrap gap-4">
                            <Button
                                onClick={() => router.push("/create/" + generateRandomString())}
                                className="bg-green-500 hover:bg-green-600 text-white text-2xl px-8 py-9 rounded-xl cursor-pointer"
                            >
                                Bắt đầu ngay
                            </Button>
                            <Button
                                onClick={() => router.push("/gallery")}
                                variant="link"
                                className="text-white text-2xl p-9 cursor-pointer"
                            >
                                Xem video mẫu
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
                    <h2 className="text-5xl lg:text-6xl font-bold">Tính Năng Nổi Bật</h2>
                    <p className="text-gray-600 text-2xl">
                        Khám phá các công cụ mạnh mẽ giúp bạn tạo ra những video ngắn chất lượng cao
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
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5h.01M5 9h.01M9 5h.01" />
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
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10m-10 4h6" />
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
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21h6" />
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
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-3-3m3 3l3-3M4 20h16" />
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
                                <h3 className="text-4xl font-semibold">{title}</h3>
                                <p className="text-gray-600 text-2xl">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Search */}
            <section className="bg-white py-24 px-6 text-black">
                <div className="w-full max-w-screen-lg xl:max-w-[70%] mx-auto space-y-10 text-center">
                    <h2 className="text-5xl lg:text-6xl font-bold">Tìm Kiếm & Khám Phá Xu Hướng</h2>
                    <p className="text-gray-600 text-2xl">Chọn nền tảng để xem trend nổi bật hiện nay</p>
                    <input
                        type="text"
                        placeholder="Gõ từ khóa: tiktok, giới thiệu, bán hàng..."
                        className="w-full border border-gray-300 rounded-full کوتاه
                        full py-6 px-8 text-3xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    />

                    {/* Tabs */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-8">
                        {(Object.keys(trendData) as Platform[]).map((platform) => (
                            <div
                                key={platform}
                                onClick={() => setSelected(platform)}
                                className={`cursor-pointer rounded-xl p-6 transition-all duration-300 text-center border-2
                ${selected === platform ? "border-fuchsia-600 bg-fuchsia-100" : "border-gray-300 hover:border-fuchsia-400"}`}
                            >
                                <h3 className="text-3xl font-semibold text-fuchsia-700">{platform}</h3>
                            </div>
                        ))}
                    </div>

                    {/* Trend list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
                        {trendData[selected].map((trend, i) => (
                            <div
                                key={i}
                                className="p-5 bg-gray-50 shadow-md rounded-lg hover:shadow-xl transition-all duration-200 cursor-pointer border border-gray-200 hover:border-fuchsia-300"
                            >
                                <p className="text-2xl font-medium text-gray-800">#{trend}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Videos */}
            <section className="bg-blue-50 py-24 px-6 text-black">
                <div className="w-full max-w-screen-lg xl:max-w-[70%] mx-auto text-center space-y-12">
                    <h2 className="text-5xl font-bold">Video Nổi Bật</h2>
                    <p className="text-gray-600 text-2xl">Khám phá các video ngắn hấp dẫn</p>

                    {loading && <div className="text-center text-2xl">Đang tải video...</div>}
                    {error && <div className="text-red-500 text-center"> {error}</div>}
                    {!loading && !error && videos.length === 0 && (
                        <div className="text-center text-2xl">Không có video để hiển thị.</div>
                    )}
                    {!loading && videos.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {videos.map(({ id, url, url_edit, subtitle }, i) => (
                                <div
                                    className="aspect-video bg-gray-50 rounded-2xl overflow-hidden shadow-lg relative cursor-pointer"
                                    key={id}
                                    onClick={() => setPopupVideo({ id, url, url_edit, subtitle, step: "completed" })}
                                >
                                    <video
                                        src={url_edit ?? url}
                                        title={`Video ${id}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <Button className="px-12 py-8 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full cursor-pointer text-xl hover:scale-105 transition-all duration-300 ease-in-out"
                        onClick={() => router.push("/gallery")}
                    >
                        Xem thêm video
                    </Button>
                </div>
            </section>

            {/* Popup video */}
            {popupVideo && (
                <VideoPopup
                    id={popupVideo.id}
                    url={popupVideo.url_edit ?? popupVideo.url}
                    subtitle={popupVideo.subtitle}
                    onClose={() => setPopupVideo(null)}
                    fromHome={true}
                />
            )}

            {/* CTA */}
            <section className="bg-black text-white text-center py-32 px-6">
                <div className="w-full max-w-screen-lg xl:max-w-[70%] mx-auto space-y-8">
                    <h2 className="text-6xl font-bold">Bắt Đầu Tạo Video Ngắn Của Bạn Ngay Hôm Nay</h2>
                    <p className="text-gray-400 text-2xl">Chỉ mất vài bước đơn giản để có một video chuyên nghiệp từ AI</p>
                    <Button
                        onClick={() => router.push(`/create/${generateRandomString()}`)}
                        className="px-12 py-8 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full cursor-pointer text-xl hover:scale-105 transition-all duration-300 ease-in-out"
                    >
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