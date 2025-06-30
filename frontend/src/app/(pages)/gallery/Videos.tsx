"use client";
import VideoItem from "./VideoItem";
import InforVideo from "@/types/inforVideo";
import Pagination from "./Pagination";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VideoPopup from "@/components/ui/videoPopup";
import fetchApi from "@/lib/api/fetch";
import HttpMethod from "@/types/httpMethos";
import { useFilter } from "./FilterContext";

function Videos() {
    const router = useRouter();
    const { search, category, sort, status } = useFilter();
    const [inforVideos, setInforVideos] = useState<InforVideo[]>([]);
    const [curpage, setCurpage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [popupVideo, setPopupVideo] = useState<{
        id: string;
        url: string;
        subtitle: string;
        url_edit?: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVideos = async (page: number) => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: page.toString(),
                limit: "6",
                ...(search && { q: search }),
                ...(category !== "Tất cả danh mục" && { category }),
                ...(sort && { sort: sort === "Mới nhất" ? "desc" : "asc" }),
                ...(status && {
                    status:
                        status === "Hoàn thiện" ? "completed" : "incomplete",
                }),
            });

            const url = `http://localhost:4000/video/getVideoDataFull?${params.toString()}`;

            const res = await fetchApi<InforVideo[] & { totalPages: number }>(
                url,
                HttpMethod.GET
            );

            if (res.mes === "success" && res.status === 200) {
                if (!Array.isArray(res.data)) {
                    console.warn(
                        "Dữ liệu video không phải mảng, đặt mảng rỗng"
                    );
                    setInforVideos([]);
                    setTotalPages(1);
                } else {
                    setInforVideos(res.data);
                    setTotalPages(res.totalPages || 1);
                }
            } else {
                throw new Error(
                    res.message || "Định dạng response không hợp lệ"
                );
            }
        } catch (err: any) {
            const errorMessage =
                err.message || "Lỗi khi tải dữ liệu video. Vui lòng thử lại.";
            setError(errorMessage);
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("useEffect chạy, page:", curpage, "filters:", {
            search,
            category,
            sort,
            status,
        });
        fetchVideos(curpage);
    }, [curpage, search, category, sort, status]);

    const handleVideoClick = (id: string) => {
        console.log("k")
        router.push(`/create/${id}`);
    };

    return (
        <>
            {loading && (
                <div className="text-center text-2xl mt-10">Đang tải...</div>
            )}
            {error && (
                <div className="text-red-500 text-center text-2xl mt-10">
                    {error}
                </div>
            )}
            {!loading && !error && inforVideos.length === 0 && (
                <div className="text-center text-2xl mt-10">
                    Không có video nào để hiển thị.
                </div>
            )}
            {!loading && inforVideos.length > 0 && (
                <div className="grid grid-cols-3 gap-x-5 gap-y-10 mt-[40px]">
                    {inforVideos.map((inforVideo, index) => (
                        <VideoItem
                            key={index}
                            inforVideo={inforVideo}
                            onViewClick={() => setPopupVideo(inforVideo)}
                            onClickVideo={() => handleVideoClick(inforVideo.id)}
                        />
                    ))}
                </div>
            )}

            {!loading && !error && inforVideos.length > 0 && (
                <Pagination
                    curpage={curpage}
                    totalPages={totalPages}
                    onPageChange={setCurpage}
                />
            )}

            {popupVideo && (
                <VideoPopup
                    id={popupVideo.id}
                    url={popupVideo.url_edit ?? popupVideo.url} // Use url_edit if available, otherwise use url
                    subtitle={popupVideo.subtitle}
                    onClose={() => setPopupVideo(null)}
                    fromGallery={true}
                />
            )}
        </>
    );
}

export default Videos;