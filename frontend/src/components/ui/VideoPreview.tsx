"use client";
import {
    Play,
    Pause,
    Volume2 as Speaker,
    VolumeX as SpeakerOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Style {
    width: number;
    position: string;
    fontSize: number;
    fontColor: string;
    backgroundColor: string;
    fontStyle: string[];
    alignment: string;
    shadow: {
        color: string;
        blur: number;
        offsetX: number;
        offsetY: number;
    };
    outline: {
        color: string;
        width: number;
    };
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
    style: {
        width: number;
        height: number;
        rotate: number;
        position: {
            x: number;
            y: number;
        };
    };
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

export default function VideoPreview({
    url,
    subtitles,
    stickers,
    musics,
}: VideoPreviewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);
    const [currentStickers, setCurrentStickers] = useState<Sticker[]>([]);
    const [volume, setVolume] = useState(1);
    const [videoDimensions, setVideoDimensions] = useState({ width: 1, height: 1 });
    const [isVideoReady, setIsVideoReady] = useState(false);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
        } else {
            video.play().catch(() => setIsPlaying(false));
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        const time = videoRef.current?.currentTime || 0;
        setCurrentTime(time);

        const activeSub = subtitles.find(
            (sub) => sub.status && time >= sub.start - 0.01 && time <= sub.end + 0.01 // Khoan dung sai lệch
        );
        setCurrentSubtitle(activeSub || null);

        const activeStickers = stickers.filter(
            (sticker) => sticker.status && time >= sticker.start && time <= sticker.end
        );
        setCurrentStickers(activeStickers);

        const activeMusic = musics.find(
            (music) => music.status && time >= music.start && time <= music.end
        );
        if (videoRef.current) {
            videoRef.current.volume = activeMusic ? activeMusic.volume : volume;
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration || 0);
            setVideoDimensions({
                width: videoRef.current.videoWidth || 1,
                height: videoRef.current.videoHeight || 1,
            });
            setIsPlaying(false);
            setIsVideoReady(videoRef.current.readyState >= 2); // Kiểm tra video sẵn sàng
            videoRef.current.volume = volume;
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current && !isNaN(time) && duration > 0 && isVideoReady) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
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

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            const updateTime = () => setCurrentTime(video.currentTime);
            const handleSeeking = () => setCurrentTime(video.currentTime);
            const handleCanPlay = () => setIsVideoReady(video.readyState >= 2);
            video.addEventListener("timeupdate", updateTime);
            video.addEventListener("seeking", handleSeeking);
            video.addEventListener("seeked", handleSeeking);
            video.addEventListener("canplay", handleCanPlay);
            video.addEventListener("pause", () => setIsPlaying(false));
            video.addEventListener("play", () => setIsPlaying(true));
            return () => {
                video.removeEventListener("timeupdate", updateTime);
                video.removeEventListener("seeking", handleSeeking);
                video.removeEventListener("seeked", handleSeeking);
                video.removeEventListener("canplay", handleCanPlay);
                video.removeEventListener("pause", () => setIsPlaying(false));
                video.removeEventListener("play", () => setIsPlaying(true));
            };
        }
    }, []);

    const scaleX = (value: number) => (value / videoDimensions.width) * (videoRef.current?.clientWidth || 1);
    const scaleY = (value: number) => (value / videoDimensions.height) * (videoRef.current?.clientHeight || 1);

    const getBackgroundColor = (color: string) => {
        if (color.includes('@')) {
            const [hex, opacity = '0.5'] = color.split('@');
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

        if (alignment === "left") {
            return { left: `${offset}px`, right: "auto" };
        } else if (alignment === "right") {
            return { right: `${offset}px`, left: "auto" };
        } else {
            return { left: "50%", transform: "translateX(-50%)" };
        }
    };

    return (
        <div className="flex-1 flex flex-col pt-5 px-4 py-6">
            <div
                className="w-full bg-black flex justify-center overflow-hidden rounded-lg shadow relative"
                ref={videoContainerRef}
            >
                <video
                    ref={videoRef}
                    src={url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    className="w-auto object-cover max-h-[500px] relative"
                    loop
                >
                    Your browser does not support the video tag.
                </video>

                {currentSubtitle && (
                    <div
                        className="absolute flex"
                        style={{
                            bottom: currentSubtitle.style.position === "bottom" ? `${scaleY(30)}px` : "auto",
                            top: currentSubtitle.style.position === "top" ? `${scaleY(30)}px` : "auto",
                            ...getSubtitlePosition(currentSubtitle.style.alignment),
                            alignItems:
                                currentSubtitle.style.position === "middle"
                                    ? "center"
                                    : "flex-start",
                            height:
                                currentSubtitle.style.position === "middle"
                                    ? "100%"
                                    : "auto",
                        }}
                    >
                        <p
                            style={{
                                fontSize: `${scaleY(currentSubtitle.style.fontSize)}px`,
                                color: currentSubtitle.style.fontColor,
                                backgroundColor: getBackgroundColor(currentSubtitle.style.backgroundColor),
                                fontWeight: currentSubtitle.style.fontStyle.includes("bold")
                                    ? "bold"
                                    : "normal",
                                fontStyle: currentSubtitle.style.fontStyle.includes("italic")
                                    ? "italic"
                                    : "normal",
                                width: `${scaleX(currentSubtitle.style.width)}px`,
                                textAlign: currentSubtitle.style.alignment as any,
                                padding: `${scaleY(4)}px ${scaleX(8)}px`,
                                borderRadius: `${scaleX(4)}px`,
                                textShadow: currentSubtitle.style.shadow
                                    ? `${scaleX(currentSubtitle.style.shadow.offsetX)}px ${
                                          scaleY(currentSubtitle.style.shadow.offsetY)
                                      }px ${scaleY(currentSubtitle.style.shadow.blur)}px ${
                                          currentSubtitle.style.shadow.color
                                      }`
                                    : "none",
                                WebkitTextStroke: currentSubtitle.style.outline
                                    ? `${scaleX(currentSubtitle.style.outline.width)}px ${
                                          currentSubtitle.style.outline.color
                                      }`
                                    : "none",
                            }}
                        >
                            {currentSubtitle.text}
                        </p>
                    </div>
                )}

                {currentStickers.map((sticker) => (
                    <img
                        key={sticker.id}
                        src={sticker.data}
                        alt={sticker.name}
                        className="absolute"
                        style={{
                            width: `${scaleX(sticker.style.width)}px`,
                            height: `${scaleY(sticker.style.height)}px`,
                            transform: `translate(${scaleX(sticker.style.position.x)}px, ${scaleY(
                                sticker.style.position.y
                            )}px) rotate(${sticker.style.rotate}deg)`,
                        }}
                    />
                ))}

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
                    {isPlaying ? (
                        <Pause size={24} className="cursor-pointer" />
                    ) : (
                        <Play size={24} className="cursor-pointer" />
                    )}
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
                    onInput={handleSeek} // Cập nhật liên tục khi kéo
                    onMouseDown={() => videoRef.current?.pause()}
                    onMouseUp={() => isPlaying && videoRef.current?.play().catch(() => {})}
                    className="flex-1 accent-blue-600 cursor-pointer mx-2"
                    disabled={!isVideoReady}
                />

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
        </div>
    );
}