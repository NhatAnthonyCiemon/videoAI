"use client";

import { useEffect, useRef, useState } from "react";
// import { FaVideo } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Logo = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true); // Start with true since video auto-plays
    const router = useRouter();

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            // Auto-play the video on mount
            video.play().catch(() => {
                // Handle browsers requiring user interaction
                setIsPlaying(false); // If play fails, show the play button
            });

            // Update state on play/pause events
            const handlePlay = () => setIsPlaying(true);
            const handlePause = () => setIsPlaying(false);
            video.addEventListener("play", handlePlay);
            video.addEventListener("pause", handlePause);

            return () => {
                video.removeEventListener("play", handlePlay);
                video.removeEventListener("pause", handlePause);
            };
        }
    }, []);

    const handleTogglePlay = () => {
        const video = videoRef.current;
        if (video) {
            if (isPlaying) {
                video.pause();
                setIsPlaying(false);
            } else {
                video.play().catch(() => { });
                setIsPlaying(true);
            }
        }
    };

    return (
        <div className="relative w-full h-full">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/30 z-10"
                onClick={handleTogglePlay} // Add click handler to overlay
            ></div>

            {/* Logo */}
            <Link
                href="/"
                className="absolute top-6 left-10 z-20 flex items-center gap-2 cursor-pointer"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="hidden md:inline w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-9"
                    fill="none"
                    stroke="#FFFFFF" // Changed to white
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="2" y="6" width="16" height="12" rx="2" ry="2" />
                    <path d="M22 8.5v7L18 12l4-3.5z" />
                </svg>
                <span className="flex flex-col md:flex-row leading-tight md:leading-normal font-bold text-white text-lg sm:text-xl md:text-3xl lg:text-4xl">
                    <span>AI Short Video Creator</span>
                </span>
            </Link>

            {/* Play button (shown when video is paused) */}
            {!isPlaying && (
                <div
                    className="absolute inset-0 flex items-center justify-center z-20"
                    onClick={handleTogglePlay}
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
                onClick={handleTogglePlay} // Keep click handler on video
                src="https://res.cloudinary.com/dphytbuah/video/upload/Video_tiktok/4a66e6c6-cc89-4e30-8ca6-1284f33fea9e.mp4"
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default Logo;