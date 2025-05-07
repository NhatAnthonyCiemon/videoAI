"use client";
import { useState } from "react";

const stickers = [
  {
    id: 1,
    name: "Funny Cat",
    image: "https://res.cloudinary.com/dphytbuah/image/upload/v1746017853/Image_tiktok/t34tezoyfnqkdy1yqf75.webp",
    description: "A cute funny cat sticker",
  },
  {
    id: 2,
    name: "Cool Sunglasses",
    image: "https://res.cloudinary.com/dphytbuah/image/upload/v1746017853/Image_tiktok/t34tezoyfnqkdy1yqf75.webp",
    description: "Stylish sunglasses sticker",
  },
  {
    id: 3,
    name: "Fire",
    image: "https://res.cloudinary.com/dphytbuah/image/upload/v1746017853/Image_tiktok/t34tezoyfnqkdy1yqf75.webp",
    description: "Hot and spicy!",
  },
];

export default function TabSticker() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSave = () => {
    const selectedSticker = stickers.find((s) => s.id === selectedId);
    console.log("Sticker đã chọn:", selectedSticker);
    // Gửi selectedSticker ra ngoài qua props, context hoặc callback tùy bạn
  };

  return (
    <div className="space-y-4 pt-4 bg-white overflow-y-auto p-4 h-full">
      <h2 className="font-bold text-2xl mb-5">Chọn nhãn dán</h2>
      <div className="space-y-2">
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            onClick={() => setSelectedId(sticker.id)}
            className={`flex items-center gap-4 p-2 border rounded-md cursor-pointer transition ${
              selectedId === sticker.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }`}
          >
            <img
              src={sticker.image}
              alt={sticker.name}
              className="w-12 h-12 rounded object-cover ml-1"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-2xl">{sticker.name}</span>
              <span className="text-gray-600 text-xl">{sticker.description}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedId && (
        <div className="pt-4">
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
          >
            Thêm nhãn dán
          </button>
        </div>
      )}
    </div>
  );
}
