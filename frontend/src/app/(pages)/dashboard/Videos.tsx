"use client";
import VideoItem from "./VideoItem";
import InforVideo from "@/types/inforVideo";
import Pagination from "./Pagination";
import { useState } from "react";
function Videos() {
    const inforVideos: InforVideo[] = [
        {
            title: "Video 1",
            category: "Category 1",
            date: "2021-01-01",
            views: "1000",
            duration: "100",
        },
        {
            title: "Video 2",
            category: "Category 2",
            date: "2021-01-02",
            views: "2000",
            duration: "200",
        },
        {
            title: "Video 3",
            category: "Category 3",
            date: "2021-01-03",
            views: "3000",
            duration: "300",
        },
        {
            title: "Video 4",
            category: "Category 4",
            date: "2021-01-04",
            views: "4000",
            duration: "400",
        },
        {
            title: "Video 5",
            category: "Category 5",
            date: "2021-01-05",
            views: "5000",
            duration: "500",
        },
        {
            title: "Video 6",
            category: "Category 6",
            date: "2021-01-06",
            views: "6000",
            duration: "600",
        },
        {
            title: "Video 7",
            category: "Category 7",
            date: "2021-01-07",
            views: "7000",
            duration: "700",
        },
        {
            title: "Video 8",
            category: "Category 8",
            date: "2021-01-08",
            views: "8000",
            duration: "800",
        },
        {
            title: "Video 9",
            category: "Category 9",
            date: "2021-01-09",
            views: "9000",
            duration: "900",
        },
    ];
    const [curpage, setCurpage] = useState(1);
    const [totalPages, setTotalPages] = useState(20);
    return (
        <>
            <div className="grid grid-cols-3 gap-x-5 gap-y-10 mt-[40px]">
                {inforVideos.map((inforVideo, index) => (
                    <VideoItem
                        key={index}
                        inforVideo={inforVideo}
                        onViewClick={() => {}}
                    />
                ))}
            </div>
            <Pagination
                curpage={curpage}
                totalPages={totalPages}
                onPageChange={setCurpage}
            />
        </>
    );
}

export default Videos;
