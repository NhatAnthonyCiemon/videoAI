"use client";
import React from "react";
import CreateImage from "./CreateImage";
import CreateScript from "./CreateScript";
import CreateVideo from "./CreateVideo";
import CreateTop from "./CreateTop";
import { ContentGenerate } from "@/types/contentGenerate";
import Video from "@/types/Video";
function ContentPage({ video }: { video: Video }) {
    React.useEffect(() => {
        document.documentElement.classList.add("scrollbar-gutter-stable");
        return () => {
            document.documentElement.classList.remove(
                "scrollbar-gutter-stable"
            );
        };
    }, []);

    const [whichActive, setWhichActive] = React.useState(0);
    const [videoData, setVideoData] = React.useState<Video>(video);
    const [isPreparing, setIsPreparing] = React.useState(false);
    return (
        <div className="w-[1280px] mx-auto overflow-hidden">
            <CreateTop
                whichActive={whichActive}
                setWhichActive={setWhichActive}
                videoData={videoData}
            />
            {((whichActive === 0 && videoData.step >= 0) ||
                (isPreparing && videoData.step === 0)) && (
                <CreateScript
                    setWhichActive={setWhichActive}
                    videoData={videoData}
                    setVideoData={setVideoData}
                    isPreparing={isPreparing}
                    setIsPreparing={setIsPreparing}
                />
            )}
            {((whichActive === 1 && videoData.step >= 1) ||
                (isPreparing && videoData.step === 1)) && <CreateImage />}

            {whichActive === 2 && videoData.step >= 2 && <CreateVideo />}
        </div>
    );
}

export default ContentPage;
