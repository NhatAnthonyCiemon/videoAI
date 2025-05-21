"use client";
import { Play, Pause, Volume2 as Speaker, VolumeX as SpeakerOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Style {
    width: number;
    position: string;
    fontSize: number;
    fontColor: string;
    backgroundColor: string;
    fontStyle: string[];
    alignment: string;
    shadow: { color: string; blur: number; offsetX: number; offsetY: number };
    outline: { color: string; width: number };
}

interface Subtitle {
    text: string;
    start: number;
    end: number;
    style: Style;
    status: boolean;
}

interface Sticker {
    id: number;
    name: string;
    data: string;
    start: number;
    end: number;
    style: { width: number; height: number; rotate: number; position: { x: number; y: number } };
    status: boolean;
}

interface Music {
    id: number;
    name: string;
    data: string;
    start: number;
    end: number;
    volume: number;
    duration: number;
    status: boolean;
}

interface VideoPreviewProps {
    url: string;
    subtitles: Subtitle[];
    stickers: Sticker[];
    musics: Music[];
}

export default function VideoPreview({ url, subtitles, stickers, musics }: VideoPreviewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const audioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({});
    const [isPlaying, setIsPlaying] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [videoDimensions, setVideoDimensions] = useState({ width: 1, height: 1 });
    const [videoOffset, setVideoOffset] = useState({ x: 0, y: 0 }); // Thêm state để lưu offset

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video || !isVideoReady) return;
        if (isPlaying) {
            video.pause();
            Object.values(audioRefs.current).forEach((audio) => audio?.pause());
        } else {
            video.play().catch(() => setIsPlaying(false));
            handleMusicPlayback(video.currentTime);
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        const time = videoRef.current?.currentTime || 0;
        setCurrentTime(time);
        const activeMusic = musics.find((music) => music.status && time >= music.start && time <= music.end);
        if (videoRef.current) videoRef.current.volume = activeMusic ? activeMusic.volume : volume;
        handleMusicPlayback(time);
    };

    const handleMusicPlayback = (time: number) => {
        musics.forEach((music, idx) => {
            if (!music.status) return;
            const audio = audioRefs.current[idx];
            if (!audio) return;

            if (time >= music.start && time <= music.end && isPlaying) {
                audio.volume = music.volume;
                if (audio.paused) {
                    audio.currentTime = time - music.start;
                    audio.play().catch((err) => console.error("Audio play error:", err));
                }
            } else if (audio && !audio.paused) {
                audio.pause();
            }
        });
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            const newDuration = videoRef.current.duration || 0;
            setDuration(newDuration);
            setVideoDimensions({ width: videoRef.current.videoWidth || 1, height: videoRef.current.videoHeight || 1 });
            setIsVideoReady(videoRef.current.readyState >= 2);
            videoRef.current.volume = volume;
            // Tính offset của video so với container
            const videoRect = videoRef.current.getBoundingClientRect();
            const containerRect = videoContainerRef.current?.getBoundingClientRect();
            if (containerRect) {
                setVideoOffset({
                    x: videoRect.left - containerRect.left,
                    y: videoRect.top - containerRect.top,
                });
            }
            console.log("Video duration:", newDuration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current && !isNaN(time) && duration > 0 && isVideoReady) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
            handleMusicPlayback(time);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        if (videoRef.current) videoRef.current.volume = vol;
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    useEffect(() => {
        if (!url) return; // Ngăn useEffect chạy nếu url rỗng
        const video = videoRef.current;
        if (!video) return;

        console.log("Setting up video events for URL:", url);
        const updateTime = () => setCurrentTime(video.currentTime);
        const handleSeeking = () => setCurrentTime(video.currentTime);
        const handleCanPlay = () => setIsVideoReady(video.readyState >= 2);
        video.addEventListener("timeupdate", updateTime);
        video.addEventListener("seeking", handleSeeking);
        video.addEventListener("seeked", handleSeeking);
        video.addEventListener("canplay", handleCanPlay);
        video.addEventListener("pause", () => setIsPlaying(false));
        video.addEventListener("play", () => setIsPlaying(true));
        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("error", () => console.error("Video load error:", video.error));

        video.src = url;
        video.load();
        setIsLoading(false);

        return () => {
            video.removeEventListener("timeupdate", updateTime);
            video.removeEventListener("seeking", handleSeeking);
            video.removeEventListener("seeked", handleSeeking);
            video.removeEventListener("canplay", handleCanPlay);
            video.removeEventListener("pause", () => setIsPlaying(false));
            video.removeEventListener("play", () => setIsPlaying(true));
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("error", () => {});
        };
    }, [url]);

    useEffect(() => {
        if (videoRef.current) videoRef.current.volume = volume;
    }, [volume]);

    const scaleX = (value: number) => (value / videoDimensions.width) * (videoRef.current?.clientWidth || 1);
    const scaleY = (value: number) => (value / videoDimensions.height) * (videoRef.current?.clientHeight || 1);

    const getBackgroundColor = (color: string) => {
        if (color.includes("@")) {
            const [hex, opacity = "0.5"] = color.split("@");
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${parseFloat(opacity) || 0.5})`;
        }
        return color;
    };

    const getSubtitlePosition = (alignment: string) => {
        const videoWidth = videoRef.current?.clientWidth || 1;
        const containerWidth = videoContainerRef.current?.clientWidth || 1;
        const offset = (containerWidth - videoWidth) / 2;
        if (alignment === "left") return { left: `${offset}px`, right: "auto" };
        if (alignment === "right") return { right: `${offset}px`, left: "auto" };
        return { left: "50%", transform: "translateX(-50%)" };
    };

    return (
        <div className="flex-1 flex flex-col pt-5 px-4 py-6">
            {!isVideoReady && <div className="text-center text-xl">Đang tải video...</div>}
            <div
                className={`w-full bg-black flex justify-center overflow-hidden rounded-lg shadow relative ${
                    isLoading ? "opacity-0" : "opacity-100"
                }`}
                ref={videoContainerRef}
            >
                <video
                    ref={videoRef}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    className={`w-auto object-cover max-h-[500px] relative`}
                    loop
                >
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {musics.map((music, idx) =>
                    music.status ? (
                        <audio
                            key={idx}
                            ref={(el) => {
                                audioRefs.current[idx] = el;
                            }}
                            src={music.data}
                            preload="auto"
                        />
                    ) : null
                )}

                {subtitles.map((sub, index) =>
                    sub.status && currentTime >= sub.start - 0.01 && currentTime <= sub.end + 0.01 ? (
                        <div
                            key={index}
                            className="absolute flex"
                            style={{
                                bottom: sub.style.position === "bottom" ? `${scaleY(30)}px` : "auto",
                                top: sub.style.position === "top" ? `${scaleY(30)}px` : "auto",
                                ...getSubtitlePosition(sub.style.alignment),
                                alignItems: sub.style.position === "middle" ? "center" : "flex-start",
                                height: sub.style.position === "middle" ? "100%" : "auto",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: `${scaleY(sub.style.fontSize)}px`,
                                    color: sub.style.fontColor,
                                    backgroundColor: getBackgroundColor(sub.style.backgroundColor),
                                    fontWeight: sub.style.fontStyle.includes("bold") ? "bold" : "normal",
                                    fontStyle: sub.style.fontStyle.includes("italic") ? "italic" : "normal",
                                    width: `${scaleX(sub.style.width)}px`,
                                    textAlign: sub.style.alignment as any,
                                    padding: `${scaleY(4)}px ${scaleX(8)}px`,
                                    borderRadius: `${scaleX(4)}px`,
                                    textShadow: sub.style.shadow
                                        ? `${scaleX(sub.style.shadow.offsetX)}px ${scaleY(
                                              sub.style.shadow.offsetY
                                          )}px ${scaleY(sub.style.shadow.blur)}px ${sub.style.shadow.color}`
                                        : "none",
                                    WebkitTextStroke: sub.style.outline
                                        ? `${scaleX(sub.style.outline.width)}px ${sub.style.outline.color}`
                                        : "none",
                                }}
                            >
                                {sub.text}
                            </p>
                        </div>
                    ) : null
                )}

                {stickers.map((sticker) =>
                    sticker.status && currentTime >= sticker.start && currentTime <= sticker.end ? (
                        <img
                            key={sticker.id}
                            src={sticker.data}
                            alt={sticker.name}
                            className="absolute"
                            style={{
                                width: `${scaleX(sticker.style.width)}px`,
                                height: `${scaleY(sticker.style.height)}px`,
                                left: `${videoOffset.x + scaleX(sticker.style.position.x)}px`,
                                top: `${videoOffset.y + scaleY(sticker.style.position.y)}px`,
                                transform: `rotate(${sticker.style.rotate}deg)`,
                            }}
                        />
                    ) : null
                )}

                {!isPlaying && isVideoReady && (
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
                    disabled={!isVideoReady}
                >
                    {isPlaying ? <Pause size={24} className="cursor-pointer" /> : <Play size={24} className="cursor-pointer" />}
                </button>

                <span className="text-xl">{formatTime(currentTime)}</span>
                <span>/</span>
                <span className="text-xl">{formatTime(duration)}</span>

                <input
                    type="range"
                    min={0}
                    max={duration || 1}
                    step={0.01}
                    value={currentTime}
                    onChange={handleSeek}
                    onInput={handleSeek}
                    onMouseDown={() => videoRef.current?.pause()}
                    onMouseUp={() => isPlaying && videoRef.current?.play().catch(() => {})}
                    className="flex-1 cursor-pointer mx-2"
                    disabled={!isVideoReady}
                    style={{ accentColor: "#2563eb", background: "#e5e7eb" }}
                />

                <div className="relative group ml-2">
                    <div className="cursor-pointer">
                        {volume > 0 ? <Speaker size={20} className="text-blue-600" /> : <SpeakerOff size={20} className="text-blue-600" />}
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={handleVolumeChange}
                        className="cursor-pointer absolute bottom-24 left-7 -translate-x-1/2 w-30 rotate-[-90deg] origin-bottom group-hover:opacity-100 opacity-0 transition-opacity duration-300"
                        style={{ accentColor: "#2563eb" }}
                    />
                </div>
            </div>
        </div>
    );
}