"use client";
import { useState, useRef, useEffect } from "react";
import { Music_System, Music } from "@/types/Video";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { getToken } from "@/lib/Token";
import Notification from "@/components/ui/Notification";

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

    const [editingMusic, setEditingMusic] = useState<Music_System | null>(null);
    const [rename, setRename] = useState("");
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [replaceOld, setReplaceOld] = useState(true);
    const [showNot, setShowNot] = useState(false);
    const [mes, setMes] = useState("");

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
        }
    }, []);

    const onClose = () => {
        setShowNot(false); // Ẩn Notification khi đóng
    };

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
                const formData = new FormData();
                formData.append("audio", file);
                setIsLoad(true);
                const token = getToken();

                const response = await fetch("http://localhost:4000/edit/upload-audio", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });

                if (!response.ok) throw new Error("Upload failed");

                const data = await response.json();
                onAddMusic(data.data.id, file.name || "Không xác định", data.data.url);
                e.target.value = "";
                setIsLoad(false);
            } catch (err) {
                alert("Lỗi khi tải file âm thanh");
                setIsLoad(false);
            }
        }
    };

    const getMusicUser = async () => {
        try {
            setIsLoad(true);
            const token = getToken();
            const res = await fetch("http://localhost:4000/edit/music-user", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            setMusicUser(json.data.musics);
            setIsLoad(false);
        } catch (err) {
            alert("Lỗi khi lấy nhạc nền");
            setIsLoad(false);
        }
    };

    useEffect(() => {
        getMusicUser();
    }, []);

    const handleSave = () => {
        if (musics_system) {
            const allMusics = [...musics_system, ...(music_user || [])];
            const selectedMusic = allMusics.filter((m) => selectedIds.includes(m.id));
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

    const openEditDialog = (m: Music_System) => {
        setEditingMusic(m);
        setRename(m.name);
        setTrimStart(0);
        setTrimEnd(10);
        setPreviewURL(m.url);
        setReplaceOld(true);
    };

    const handleTrimAndRename = async () => {
        if (!editingMusic || trimEnd <= trimStart) {
            alert("Khoảng thời gian không hợp lệ");
            return;
        }

        try {
            setIsLoad(true);
            const token = getToken();
            const response = await fetch("http://localhost:4000/edit/trim-audio", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: editingMusic.id,
                    name: rename,
                    start: trimStart,
                    end: trimEnd,
                    replace: replaceOld,
                }),
            });
            const json = await response.json();
            
            if (!response.ok) throw new Error(json.message || "Lỗi khi cắt nhạc");
            setShowNot(true);
            setMes("Cắt nhạc thành công!");
            setEditingMusic(null);
            getMusicUser();
            setIsLoad(false);
        } catch (err) {
            alert("Lỗi khi cắt nhạc");
            setIsLoad(false);
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
                    {musics_system?.map((m) => (
                        <div key={m.id} className={`p-3 border rounded-md flex justify-between items-center transition ${selectedIds.includes(m.id) ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(m.id)}
                                onChange={() => toggleSelect(m.id)}
                                className="w-5 h-5 cursor-pointer mr-4 ml-2"
                            />
                            <div className="flex-1 cursor-pointer" onClick={() => toggleSelect(m.id)}>
                                <p className="font-semibold">{m.name}</p>
                            </div>
                            <button onClick={() => handlePlaySystem(m.id, m.url)} className="text-xl bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">
                                {playingId === m.id ? "⏸️ Pause" : "▶️ Play"}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="space-y-2 mt-3">
                    <h2 className="text-2xl">Nhạc của người dùng</h2>
                    {music_user?.map((m) => (
                        <div key={m.id} className={`p-3 border rounded-md flex justify-between items-center transition ${selectedIds.includes(m.id) ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(m.id)}
                                onChange={() => toggleSelect(m.id)}
                                className="w-5 h-5 cursor-pointer mr-4 ml-2"
                            />
                            <div className="flex-1 cursor-pointer" onClick={() => toggleSelect(m.id)}>
                                <p className="font-semibold">{m.name}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handlePlaySystem(m.id, m.url)} className="text-xl bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">
                                    {playingId === m.id ? "⏸️ Pause" : "▶️ Play"}
                                </button>
                                <button onClick={() => openEditDialog(m)} className="text-xl bg-yellow-100 px-2 py-1 rounded hover:bg-yellow-200">
                                    ✂️ Cắt/Sửa
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
                    <div>
                        <h3 className="text-2xl font-bold">Nhạc đang chọn</h3>
                        <p className="text-2xl">Tên: {music.name}</p>
                        <button
                            onClick={() => handlePlayCurrent(music.data)}
                            className="text-2xl bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                        >
                            {playingCurrent ? "⏸️ Pause" : "▶️ Play"}
                        </button>
                        <div className="mt-2">
                            <label className="text-2xl">Âm lượng:</label>
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
                )}

                {editingMusic && (
                    <div className="mt-4 border-t pt-4">
                        <h3 className="text-2xl font-bold">Chỉnh sửa nhạc</h3>
                        <label className="block mt-2">Tên mới</label>
                        <input
                            className="border p-1 w-full"
                            value={rename}
                            onChange={(e) => setRename(e.target.value)}
                        />
                        <div className="flex gap-4 mt-2">
                            <div>
                                <label>Bắt đầu (s)</label>
                                <input
                                    type="number"
                                    value={trimStart}
                                    onChange={(e) => setTrimStart(parseFloat(e.target.value))}
                                    className="border p-1 w-full"
                                />
                            </div>
                            <div>
                                <label>Kết thúc (s)</label>
                                <input
                                    type="number"
                                    value={trimEnd}
                                    onChange={(e) => setTrimEnd(parseFloat(e.target.value))}
                                    className="border p-1 w-full"
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <audio controls src={previewURL || ""} />
                        </div>
                        <div className="mt-2">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={replaceOld}
                                    onChange={() => setReplaceOld(!replaceOld)}
                                />
                                Thay thế file hiện tại
                            </label>
                        </div>
                        <button
                            onClick={() => setEditingMusic(null)}
                            className="bg-gray-600 text-white px-4 py-2 rounded mt-2"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleTrimAndRename}
                            className="bg-green-600 text-white px-4 py-2 rounded mt-2 ml-3"
                        >
                            Cắt & Lưu
                        </button>
                    </div>
                )}
            </div>

            <LoadingOverlay isPreparing={isLoad} message="Đang xử lý audio..." />
            {showNot && (
                <>
                    <Notification
                        message={mes}
                        type="success"
                        onClose={() => {
                            onClose();
                            document.body.style.overflow = "auto";
                        }}
                    />
                </>
            )}
        </div>
    );
}