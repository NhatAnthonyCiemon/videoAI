"use client";
import { useState, useRef } from "react";

const mockMusicList = [
  {
    id: 1,
    name: "Peaceful Morning",
    duration: "2:10",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    name: "Energetic Beat",
    duration: "3:00",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    name: "Soft Piano",
    duration: "1:45",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

export default function TabMusic() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handlePlay = (id: number, url: string) => {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setPlayingId(id);
      }
    }
  };

  const handleUpload = () => {
    alert("Tải nhạc lên...");
  };

  const handleSave = () => {
    const selectedMusic = mockMusicList.filter((m) =>
      selectedIds.includes(m.id)
    );
    console.log("Đã chọn:", selectedMusic);
  };

  return (
    <div className="space-y-4 text-2xl pt-4 bg-white overflow-y-auto p-4">
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} />

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
        {mockMusicList.map((music) => (
          <div
            key={music.id}
            className={`p-3 border rounded-md flex justify-between items-center transition ${
              selectedIds.includes(music.id)
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
            <div className="flex-1 cursor-pointer" onClick={() => toggleSelect(music.id)}>
              <p className="font-semibold">{music.name}</p>
              <p className="text-xl text-gray-600">{music.duration}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePlay(music.id, music.url)}
                className="text-xl bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
              >
                {playingId === music.id ? "⏸️ Pause" : "▶️ Play"}
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
  );
}
