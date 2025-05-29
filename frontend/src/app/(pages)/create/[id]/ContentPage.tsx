"use client";
import React, { useState } from "react";
import CreateImage from "./CreateImage";
import CreateScript from "./CreateScript";
import CreateVideo from "./CreateVideo";
import CreateTop from "./CreateTop";
import EditVideo from "./EditVideo";
import Video from "@/types/Video";
import { Music_System, Sticker_System, Subtitle, Music, Sticker } from "@/types/Video";
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
    const [musics_sys, setMusics_sys] = React.useState<Music_System[]>([]);
    const [stickers_sys, setStickers_sys] = React.useState<Sticker_System[]>([]);
    const [isPreparing, setIsPreparing] = React.useState(false);
    const [isCreateAgain, setIsCreateAgain] = React.useState(false);
    
    const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
    const [musics, setMusics] = useState<Music[]>([]);
    const [stickers, setStickers] = useState<Sticker[]>([]);
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
                    musics_sys={musics_sys}
                    setMusics_sys={setMusics_sys}
                    stickers_sys={stickers_sys}
                    setStickers_sys={setStickers_sys}

                    subtitles={subtitles}
                    setSubtitles={setSubtitles}
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
                    musics_sys={musics_sys}
                    setMusics_sys={setMusics_sys}
                    stickers_sys={stickers_sys}
                    setStickers_sys={setStickers_sys}
                    isPreparing={isPreparing}
                    setIsPreparing={setIsPreparing}
                    
                    subtitles={subtitles}
                    setSubtitles={setSubtitles}
                    musics={musics}
                    setMusics={setMusics}
                    stickers={stickers}
                    setStickers={setStickers}
                />
            )}
        </div>
    );
}

export default ContentPage;
