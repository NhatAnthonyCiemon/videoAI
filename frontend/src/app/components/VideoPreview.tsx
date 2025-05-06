"use client";
import {
    Play,
    Pause,
    Volume2 as Speaker,
    VolumeX as SpeakerOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function VideoPreview() {
    const url =
        "https://res.cloudinary.com/dphytbuah/video/upload/Video_tiktok/4a66e6c6-cc89-4e30-8ca6-1284f33fea9e.mp4";

    const subtitles = [
        { start: 0, end: 5, text: "Xin chào, đây là một video mẫu." },
        { start: 5, end: 10, text: "Tiếp tục với nội dung kế tiếp." },
        { start: 10, end: 15, text: "Cảm ơn bạn đã theo dõi." },
    ];

    const content = "Figma ipsum export pencil scrolling edit ellipse bullet edit hand blur text mask opacity layout blur shadow union layout star device effect prototype fill auto rectangle list component frame ellipse strikethrough bold align figma select slice pencil vertical main bullet arrange arrange plugin frame vector edit rotate scrolling invite connection plugin plugin main project boolean asset pixel invite bullet vector stroke device opacity object figjam clip text image text inspect object edit italic vector bold effect scale invite rectangle pen underline vertical scrolling draft main line flatten reesizing layout duplicate overflow invite figjam layer asset subtract move export italic vector.";

    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentSubtitle, setCurrentSubtitle] = useState("");
    const [volume, setVolume] = useState(1); // full volume

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        const time = videoRef.current?.currentTime || 0;
        setCurrentTime(time);

        const activeSub = subtitles.find(
            (sub) => time >= sub.start && time <= sub.end
        );
        setCurrentSubtitle(activeSub ? activeSub.text : "");
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
        }
        setCurrentTime(time);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        if (videoRef.current) {
            videoRef.current.volume = vol;
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
        return `${minutes}:${seconds}`;
    };
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
        }
    }, [volume]);

    return (
        <div className="flex-1 flex flex-col pt-5 px-4 py-6">
            <div className="w-full bg-black flex justify-center overflow-hidden rounded-lg shadow relative">
                <video
                    ref={videoRef}
                    src={url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    className="w-full object-cover"
                    loop
                >
                    Your browser does not support the video tag.
                </video>

                {currentSubtitle && (
                    <p className="absolute bottom-7 justify-center text-white text-xl bg-black bg-opacity-50 px-2 py-1 p-4 rounded">
                        {currentSubtitle}
                    </p>
                )}

                {!isPlaying && (
                    <div
                        className="absolute inset-0 flex items-center justify-center bg-[rgba(31,41,55,0.56)] cursor-pointer"
                        onClick={togglePlay}
                    >
                        <Play size={40} className="text-white opacity-80" />
                    </div>
                )}
            </div>

            <div className="w-full mt-4 flex items-center gap-2">
                <button
                    onClick={togglePlay}
                    className="text-blue-600 hover:scale-110 transition"
                >
                    {isPlaying ? <Pause size={24} className="cursor-pointer"/> : <Play size={24} className="cursor-pointer"/>}
                </button>

                <span className="text-base">{formatTime(currentTime)}</span>
                <span>/</span>
                <span className="text-base">{formatTime(duration)}</span>

                <input
                    type="range"
                    min={0}
                    max={duration}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 accent-blue-600 cursor-pointer mx-2"
                />

                {/* Volume Control */}
                <div className="relative group ml-2">
                    <div className="cursor-pointer">
                        {volume > 0 ? (
                            <Speaker size={20} className="text-blue-600" />
                        ) : (
                            <SpeakerOff size={20} className="text-blue-600" />
                        )}
                    </div>

                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={handleVolumeChange}
                        className="cursor-pointer absolute bottom-24 left-7 -translate-x-1/2 w-30 rotate-[-90deg] origin-bottom group-hover:opacity-100 opacity-0 transition-opacity duration-300"
                    />
                </div>
            </div>


            <p className="mt-5 text-2xl font-semibold">Transcript</p>
            <p className="text-xl text-gray-700 p-2">{content}</p>
        </div>
    );
}
