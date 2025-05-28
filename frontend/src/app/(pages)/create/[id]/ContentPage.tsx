"use client";
import React from "react";
import CreateImage from "./CreateImage";
import CreateScript from "./CreateScript";
import CreateVideo from "./CreateVideo";
import CreateTop from "./CreateTop";
import EditVideo from "./EditVideo";
import Video from "@/types/Video";
import { Music_System, Sticker_System } from "@/types/Video";
function ContentPage({ video }: { video: Video }) {
    React.useEffect(() => {
        document.documentElement.classList.add("scrollbar-gutter-stable");
        return () => {
            document.documentElement.classList.remove(
                "scrollbar-gutter-stable"
            );
        };
    }, []);
    const [whichActive, setWhichActive] = React.useState(video.step);
    const [videoData, setVideoData] = React.useState<Video>(video);
    const [musics, setMusics] = React.useState<Music_System[]>([]);
    const [stickers, setStickers] = React.useState<Sticker_System[]>([]);
    const [isPreparing, setIsPreparing] = React.useState(false);
    const [isCreateAgain, setIsCreateAgain] = React.useState(false);
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
                (isPreparing && videoData.step === 1)) && (
                <CreateImage
                    setWhichActive={setWhichActive}
                    videoData={videoData}
                    setVideoData={setVideoData}
                    isPreparing={isPreparing}
                    setIsPreparing={setIsPreparing}
                />
            )}

            {((whichActive === 2 && videoData.step >= 2) ||
                (isPreparing && videoData.step === 2)) && (
                <CreateVideo
                    videoData={videoData}
                    setVideoData={setVideoData}
                    isCreateAgain = {isCreateAgain}
                    setIsCreateAgain ={setIsCreateAgain}
                    setWhichActive={setWhichActive}
                    isPreparing={isPreparing}
                    setIsPreparing={setIsPreparing}
                    musics={musics}
                    setMusics={setMusics}
                    stickers={stickers}
                    setStickers={setStickers}
                />
            )}

             {((whichActive === 3 && videoData.step >= 3) ||
                (isPreparing && videoData.step === 3)) && (
                <EditVideo
                    videoData={videoData}
                    setVideoData={setVideoData}
                    setWhichActive={setWhichActive}
                    musics_sys={musics}
                    setMusics_sys={setMusics}
                    stickers_sys={stickers}
                    setStickers_sys={setStickers}
                    isPreparing={isPreparing}
                    setIsPreparing={setIsPreparing}
                />
            )}
        </div>
    );
}

export default ContentPage;
