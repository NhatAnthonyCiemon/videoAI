"use client";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

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

export default function MusicSetting({
  musics,
  onAdd,
  onUpdate,
  onDelete,
  idxMusic,
  setIdxMusic,
  setTab,
  onReorder, // thêm callback onReorder
}: {
  musics: Music[];
  onAdd: (id: number, name: string, data: string) => void;
  onUpdate: (music: Music) => void;
  onDelete: (index: number) => void;
  idxMusic: number;
  setIdxMusic: (index: number) => void;
  setTab: (tab: string) => void;
  onReorder: (musics: Music[]) => void;
}) {
  // State tạm lưu input start/end
  const [localInputs, setLocalInputs] = useState<{
    [key: number]: { start: string; end: string };
  }>({});

  const toggleEnable = (index: number) => {
    const music = musics[index];
    if (music) {
      onUpdate({ ...music, status: !music.status });
    }
  };

  // Khi thay đổi input thì chỉ cập nhật localInputs
  const handleChange = (
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    setLocalInputs((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  // Khi rời input (onBlur), kiểm tra và gọi onUpdate nếu hợp lệ
  const handleBlur = (index: number, field: "start" | "end") => {
    const music = musics[index];
    const input = localInputs[index]?.[field];

    if (!music) return;

    let parsed: number;

    if (input === undefined || input.trim() === "") {
      // Gán mặc định nếu input trống
      if (field === "start") parsed = 0;
      else parsed = music.duration || 0;
    } else {
      parsed = parseFloat(input);
      if (isNaN(parsed)) {
        if (field === "start") parsed = 0;
        else parsed = music.duration || 0;
      }
    }

    let updated = { ...music, [field]: parsed };

    // Ràng buộc không vượt quá duration
    if (updated.start > music.duration) updated.start = music.duration;
    if (updated.end > music.duration) updated.end = music.duration;

    // Ràng buộc end >= start
    if (field === "start" && updated.end < parsed) updated.end = parsed;
    if (field === "end" && parsed < updated.start) updated.start = parsed;

    // Cập nhật localInputs đồng bộ giá trị mới đã ràng buộc
    setLocalInputs((prev) => ({
      ...prev,
      [index]: {
        start: updated.start.toString(),
        end: updated.end.toString(),
      },
    }));

    onUpdate(updated);
  };

  // Khi danh sách musics thay đổi, đồng bộ lại localInputs để không lỗi thời
  useEffect(() => {
    const newInputs: typeof localInputs = {};
    musics.forEach((music, idx) => {
      newInputs[idx] = {
        start: music.start.toString(),
        end: music.end.toString(),
      };
    });
    setLocalInputs(newInputs);
  }, [musics]);

  // Đọc thời lượng của các music nếu duration chưa được gán
  useEffect(() => {
    musics.forEach((music, index) => {
      if (!music.duration || music.duration === 0) {
        const audio = new Audio(music.data);
        audio.addEventListener("loadedmetadata", () => {
          const duration = audio.duration || 0;
          audio.remove();
          if (duration > 0) {
            onUpdate({ ...music, duration });
          }
        });
        audio.addEventListener("error", () => {
          audio.remove();
          onUpdate({ ...music, duration: 0 });
        });
        audio.load();
      }
    });
  }, [musics, onUpdate]);

  // Xử lý kéo thả reorder
  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    const fromIndex = result.source.index;
    const toIndex = result.destination.index;

    if (fromIndex === toIndex) return;

    const newMusics = Array.from(musics);
    const [moved] = newMusics.splice(fromIndex, 1);
    newMusics.splice(toIndex, 0, moved);

    onReorder(newMusics);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="music-list">
        {(provided) => (
          <div
            className="bg-white overflow-y-auto space-y-2 h-full border-gray-700 p-4"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <div className="flex justify-between items-center p-2">
              <button
                className="text-2xl font-medium border border-gray-700 rounded-lg p-2 bg-gray-50 cursor-pointer active:bg-blue-100 text-gray-700"
              >
                Nhạc nền
              </button>
            </div>

            {musics.map((music, index) => (
              <Draggable
                key={music.id}
                draggableId={music.id.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    className={`p-2 flex ${
                      snapshot.isDragging ? "bg-yellow-100" : ""
                    }`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => setIdxMusic(index)}
                  >
                    <div className="flex items-center mr-3">
                      <input
                        type="checkbox"
                        checked={idxMusic === index}
                        onChange={() => setIdxMusic(index)}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>
                    <div className="border w-full rounded-md p-2 flex flex-col bg-gray-50">
                      <p className="text-2xl font-semibold">{music.name}</p>
                      <p className="text-gray-600 text-xl">
                        Thời lượng:{" "}
                        {music.duration
                          ? music.duration.toFixed(2)
                          : (music.end - music.start).toFixed(2)}
                        s
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-2 ml-5 mr-3">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => onDelete(index)}
                      >
                        <Trash2
                          size={18}
                          color="black"
                          className="cursor-pointer"
                        />
                      </button>
                    </div>
                    <div className="flex flex-col justify-between ml-2 text-xl">
                      <div className="flex-1 border rounded-md p-1 bg-gray-50 w-[52px] text-center flex items-center justify-center">
                        <input
                          type="number"
                          value={
                            localInputs[index]?.start ?? music.start.toString()
                          }
                          onChange={(e) =>
                            handleChange(index, "start", e.target.value)
                          }
                          onBlur={() => handleBlur(index, "start")}
                          className="bg-transparent border-none w-full text-center focus:outline-none focus:ring-0"
                        />
                      </div>
                      <div className="min-h-3"></div>
                      <div className="flex-1 border rounded-md p-1 bg-gray-50 w-[52px] text-center flex items-center justify-center">
                        <input
                          type="number"
                          value={localInputs[index]?.end ?? music.end.toString()}
                          onChange={(e) =>
                            handleChange(index, "end", e.target.value)
                          }
                          onBlur={() => handleBlur(index, "end")}
                          className="bg-transparent border-none w-full text-center focus:outline-none focus:ring-0"
                        />
                      </div>
                    </div>
                    <div className="flex items-center ml-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={music.status}
                          onChange={() => toggleEnable(index)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-checked:bg-orange-500 rounded-full peer peer-focus:ring-2 peer-focus:ring-orange-300 transition duration-300 ease-in-out"></div>
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition duration-300 ease-in-out"></div>
                      </label>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
