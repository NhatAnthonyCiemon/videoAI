"use client";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

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

export default function StickerSetting({
  stickers,
  onAdd,
  onUpdate,
  onDelete,
  idxSticker,
  setIdxSticker,
  setTab,
  onReorder, // thêm callback onReorder
}: {
  stickers: Sticker[];
  onAdd: (id: number, name: string, data: string) => void;
  onUpdate: (sticker: Sticker) => void;
  onDelete: (index: number) => void;
  idxSticker: number;
  setIdxSticker: (index: number) => void;
  setTab: (tab: string) => void;
  onReorder: (stickers: Sticker[]) => void;
}) {
  // State tạm lưu input start/end
  const [localInputs, setLocalInputs] = useState<{
    [key: number]: { start: string; end: string };
  }>({});

  const [stickersSystem] = useState([
    {
      id: 0,
      name: "Chim cánh cụt",
      data: "https://res.cloudinary.com/dphytbuah/image/upload/v1747738119/images-removebg-preview_y36zfk.png",
    },
    {
      id: 1,
      name: "Chim cánh cụt",
      data: "https://res.cloudinary.com/dphytbuah/image/upload/v1747738119/images-removebg-preview_y36zfk.png",
    },
  ]);

  const toggleEnable = (index: number) => {
    const sticker = stickers[index];
    if (sticker) {
      onUpdate({ ...sticker, status: !sticker.status });
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
    const sticker = stickers[index];
    const input = localInputs[index]?.[field];

    if (!sticker) return;

    let parsed: number;

    if (input === undefined || input.trim() === "") {
      // Gán mặc định nếu input trống
      parsed = field === "start" ? 0 : 1;
    } else {
      parsed = parseFloat(input);
      if (isNaN(parsed)) {
        // Nếu không parse được thì gán mặc định
        parsed = field === "start" ? 0 : 1;
      }
    }

    let updated = { ...sticker, [field]: parsed };

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

  // Khi danh sách stickers thay đổi, đồng bộ lại localInputs
  useEffect(() => {
    const newInputs: typeof localInputs = {};
    stickers.forEach((sticker, idx) => {
      newInputs[idx] = {
        start: sticker.start.toString(),
        end: sticker.end.toString(),
      };
    });
    setLocalInputs(newInputs);
  }, [stickers]);

  // Xử lý kéo thả reorder
  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    const fromIndex = result.source.index;
    const toIndex = result.destination.index;

    if (fromIndex === toIndex) return;

    const newStickers = Array.from(stickers);
    const [moved] = newStickers.splice(fromIndex, 1);
    newStickers.splice(toIndex, 0, moved);

    onReorder(newStickers);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sticker-list">
        {(provided) => (
          <div
            className="bg-white overflow-y-auto space-y-2 h-full border-gray-700 p-4"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <div className="flex justify-between items-center p-2">
              <button
                className="text-2xl font-medium border border-gray-700 rounded-lg p-2 bg-gray-50 cursor-pointer active:bg-blue-100 text-gray-700"
                onClick={() => setTab("sticker")}
              >
                Sticker
              </button>
            </div>

            {stickers.map((sticker, index) => (
              <Draggable
                key={sticker.id || index}
                draggableId={(sticker.id || index).toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    className={`p-2 flex ${
                      snapshot.isDragging ? "bg-yellow-100" : ""
                    }`}
                    onClick={() => setIdxSticker(index)}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div className="flex items-center mr-3">
                      <input
                        type="checkbox"
                        checked={idxSticker === index}
                        onChange={() => setIdxSticker(index)}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>
                    <div className="border w-full rounded-md p-2 flex items-center gap-3 bg-gray-50">
                      <img
                        src={sticker.data}
                        alt={sticker.name}
                        className="max-w-[40px] max-h-[40px] object-contain rounded"
                        style={{
                          width: sticker.style.width,
                          height: sticker.style.height,
                          transform: `rotate(${sticker.style.rotate}deg)`,
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-2xl font-semibold text-gray-800">
                          {sticker.name}
                        </p>
                        <p className="text-gray-600 text-xl">
                          Vị trí: ({sticker.style.position.x},{" "}
                          {sticker.style.position.y})
                        </p>
                      </div>
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
                            localInputs[index]?.start ?? sticker.start.toString()
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
                          value={localInputs[index]?.end ?? sticker.end.toString()}
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
                          checked={sticker.status || false}
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
