"use client";

import { useEffect, useRef, useState } from "react";
import { FaVideo } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Logo = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const router = useRouter();
    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            const handlePlay = () => setIsPlaying(true);
            video.addEventListener("play", handlePlay);
            video.play().catch(() => {}); // một số browser yêu cầu user interaction
            return () => {
                video.removeEventListener("play", handlePlay);
            };
        }
    }, []);

    const handlePlay = () => {
        videoRef.current?.play();
    };

    return (
        <div className="relative w-full h-full">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 z-10"></div>

            {/* Logo */}
            <div
                onClick={() => {
                    router.push("/");
                }}
                className="absolute top-6 left-6 z-20 flex items-center gap-2"
            >
                <div className="h-10 w-10 border border-white/70 rounded flex items-center justify-center bg-black">
                    <FaVideo className="text-white" />
                </div>
                <span className="text-white text-lg font-large">
                    AI SHORT VIDEO CREATOR
                </span>
            </div>

            {/* Play button (ẩn khi đang phát) */}
            {!isPlaying && (
                <div
                    className="absolute inset-0 flex items-center justify-center z-20"
                    onClick={handlePlay}
                >
                    <div className="h-16 w-16 rounded-full bg-white/30 flex items-center justify-center cursor-pointer hover:bg-white/40 transition-colors">
                        <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-black border-b-[8px] border-b-transparent ml-1"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Video */}
            <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                src="https://res.cloudinary.com/dphytbuah/video/upload/Video_tiktok/4a66e6c6-cc89-4e30-8ca6-1284f33fea9e.mp4"
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default Logo;
