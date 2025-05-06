import { useState } from "react";
import { Trash2 } from "lucide-react";

const mockMusics = [
    {
        id: 1,
        name: "Calm Piano",
        duration: "2:30",
        start: "00:10",
        end: "00:40",
        enabled: true,
    },
    {
        id: 2,
        name: "Ambient Background",
        duration: "1:45",
        start: "00:05",
        end: "00:20",
        enabled: false,
    },
    {
        id: 3,
        name: "Energetic Beat",
        duration: "3:10",
        start: "00:00",
        end: "00:25",
        enabled: true,
    },
];

export default function MusicSetting() {
    const [musics, setMusics] = useState(mockMusics);

    const toggleEnable = (id: number) => {
        setMusics((prev) =>
            prev.map((music) =>
                music.id === id ? { ...music, enabled: !music.enabled } : music
            )
        );
    };

    const deleteMusic = (id: number) => {
        setMusics((prev) => prev.filter((m) => m.id !== id));
    };

    return (
        <div className="bg-white overflow-y-auto space-y-2 border-r-1 h-full border-gray-700 p-4">
            <div className="flex justify-between items-center mb-2 p-2">
                <button className="text-xl font-medium border border-gray-700 rounded-lg p-2 bg-gray-50 hover:bg-gray-100 cursor-pointer">
                    + Nhạc nền
                </button>
            </div>

            {musics.map((music) => (
                <div key={music.id} className="p-2 flex rounded-md">
                    <div className="border rounded-md p-2 flex w-full">
                        <div className="flex-1 ">
                            <p className="text-xl font-semibold text-gray-800">{music.name}</p>
                            <p className=" text-gray-600">Thời lượng nhạc: {music.duration}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={music.enabled}
                                    onChange={() => toggleEnable(music.id)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-300 peer-checked:bg-orange-500 rounded-full peer peer-focus:ring-2 peer-focus:ring-orange-300 transition duration-300 ease-in-out"></div>
                                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition duration-300 ease-in-out"></div>
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 ml-5 mr-3">
                        <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => deleteMusic(music.id)} // Thêm sự kiện onClick để gọi deleteMusic
                        >
                            <Trash2 size={18} color="black" className="cursor-pointer" />
                        </button>
                    </div>
                    <div className="flex flex-col justify-between ml-2">
                        <div className="flex-1 border rounded-md p-1 bg-gray-50 w-[52px] text-center flex items-center justify-center">
                            {music.start}
                        </div>
                        <div className="min-h-3"></div>
                        <div className="flex-1 border rounded-md p-1 bg-gray-50 w-[52px] text-center flex items-center justify-center">
                            {music.end}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
