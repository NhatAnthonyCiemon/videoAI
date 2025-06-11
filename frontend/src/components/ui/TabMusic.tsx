"use client";
import { useState, useRef, useEffect } from "react";
import { Music_System, Music } from "@/types/Video";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

import { getToken } from "@/lib/Token";

export default function TabMusic({
    musics_system,
    music,
    onAddMusic,
    onUpdateMusic,
}: {
    musics_system: Music_System[] | null;
    music: Music;
    onAddMusic: (id: number, name: string, data: string) => void;
    onUpdateMusic: (music: Music) => void;
}) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [playingId, setPlayingId] = useState<number | null>(null);
    const [playingCurrent, setPlayingCurrent] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isLoad, setIsLoad] = useState(false);
    const [music_user, setMusicUser] = useState<Music_System[] | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
        }
    }, []);

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handlePlaySystem = (id: number, url: string) => {
        if (playingId === id) {
            audioRef.current?.pause();
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.play();
                setPlayingId(id);
                setPlayingCurrent(false);
            }
        }
    };

    const handlePlayCurrent = (url: string) => {
        if (playingCurrent) {
            audioRef.current?.pause();
            setPlayingCurrent(false);
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.play();
                setPlayingCurrent(true);
                setPlayingId(null);
            }
        }
    };

    const handleUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("audio/")) {
            try {
                // Tạo FormData để gửi file
                const formData = new FormData();
                formData.append("audio", file);
                setIsLoad(true);
                const token = getToken();
                // Gọi API /upload-audio
                const response = await fetch(
                    "http://localhost:4000/edit/upload-audio",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`, // truyền token vào header
                        },
                        body: formData,
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Upload failed");
                }

                const data = await response.json();
                console.log(data);
                if (!data.data.url) {
                    throw new Error("No URL returned from server");
                }

                // Gọi onAddMusic với URL từ server
                onAddMusic(
                    data.data.id,
                    file.name || "Không xác định",
                    data.data.url
                );

                // Reset input file để có thể chọn lại cùng file
                e.target.value = "";

                setIsLoad(false);
            } catch (error) {
                console.error("Error uploading audio:", error);
                alert(`Lỗi khi tải file âm thanh: Vui lòng thử lại.`);

                setIsLoad(false);
            }
        } else {
            alert("Vui lòng chọn file âm thanh hợp lệ!");
        }
    };

    const getMusicUser = async () => {
        try {
            setIsLoad(true);
            const token = getToken();
            // Gọi API /upload-audio
            const response = await fetch(
                "http://localhost:4000/edit/music-user",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`, // truyền token vào header
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Lấy nhạc nền thất bại");
            }
            const json = await response.json();
            setMusicUser(json.data.musics);

            console.log("Music User:", json);

            setIsLoad(false);
        } catch (error) {
            console.error("Error uploading audio:", error);
            alert(`Lỗi khi lấy nhạc nền: Vui lòng thử lại.`);

            setIsLoad(false);
        }

    };

    useEffect(() => {
        getMusicUser();
    }, []);

    const handleSave = () => {
        if (musics_system) {
            const allMusics = [...(musics_system || []), ...(music_user || [])];
            const selectedMusic = allMusics.filter((m) =>
                selectedIds.includes(m.id)
            );
            selectedMusic.forEach((m) => onAddMusic(m.id, m.name, m.url));
            setSelectedIds([]);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const volume = parseFloat(e.target.value);
        if (music) {
            onUpdateMusic({ ...music, volume });
        }
    };

    return (
        <div className="flex gap-5 w-full space-y-4 text-2xl pt-4 bg-white overflow-y-auto p-4">
            <div className="flex-1 space-y-4">
                <audio
                    ref={audioRef}
                    onEnded={() => {
                        setPlayingId(null);
                        setPlayingCurrent(false);
                    }}
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold">Chọn nhạc nền</h2>
                    <button
                        onClick={handleUpload}
                        className="text-2xl cursor-pointer bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition"
                    >
                        + Tải nhạc lên
                    </button>
                </div>

                <div className="space-y-2 mt-3">
                    <h2 className="text-2xl">Nhạc hệ thống</h2>
                    {musics_system?.map((music) => (
                        <div
                            key={music.id}
                            className={`p-3 border rounded-md flex justify-between items-center transition ${selectedIds.includes(music.id)
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300"
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(music.id)}
                                onChange={() => toggleSelect(music.id)}
                                className="w-5 h-5 cursor-pointer mr-4 ml-2"
                            />
                            <div
                                className="flex-1 cursor-pointer"
                                onClick={() => toggleSelect(music.id)}
                            >
                                <p className="font-semibold">{music.name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        handlePlaySystem(music.id, music.url)
                                    }
                                    className="text-xl bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                                >
                                    {playingId === music.id
                                        ? "⏸️ Pause"
                                        : "▶️ Play"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-2 mt-3">
                    <h2 className="text-2xl">Nhạc của người dùng</h2>
                    {music_user?.map((music) => (
                        <div
                            key={music.id}
                            className={`p-3 border rounded-md flex justify-between items-center transition ${selectedIds.includes(music.id)
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300"
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(music.id)}
                                onChange={() => toggleSelect(music.id)}
                                className="w-5 h-5 cursor-pointer mr-4 ml-2"
                            />
                            <div
                                className="flex-1 cursor-pointer"
                                onClick={() => toggleSelect(music.id)}
                            >
                                <p className="font-semibold">{music.name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        handlePlaySystem(music.id, music.url)
                                    }
                                    className="text-xl bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                                >
                                    {playingId === music.id
                                        ? "⏸️ Pause"
                                        : "▶️ Play"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedIds.length > 0 && (
                    <div className="pt-4">
                        <button
                            onClick={handleSave}
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
                        >
                            Thêm nhạc nền
                        </button>
                    </div>
                )}
            </div>

            <div className="w-1/2 space-y-4">
                {music && (
                    <div className="">
                        <h3 className="text-2xl font-bold">Nhạc đang chọn</h3>
                        <div className="mt-2">
                            <p className="text-2xl">Tên: {music.name}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <button
                                    onClick={() => handlePlayCurrent(music.data)}
                                    className="text-2xl bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                                >
                                    {playingCurrent ? "⏸️ Pause" : "▶️ Play"}
                                </button>
                            </div>
                            <div className="mt-2">
                                <label className="text-2xl">Âm lượng: </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={music.volume || 0.5}
                                    onChange={handleVolumeChange}
                                    className="w-full"
                                />
                                <span>{(music.volume * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <LoadingOverlay
                isPreparing={isLoad}
                message="Đang xử lý audio..."
            />
        </div>
    );
}
