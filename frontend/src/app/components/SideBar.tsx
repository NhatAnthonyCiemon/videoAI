import { Music, Subtitles, Stamp } from "lucide-react";

type SideBarProps = {
  selected: string;
  onSelect: (key: string) => void;
};

export default function SideBar({ selected, onSelect }: SideBarProps) {
  return (
    <div className="w-20 bg-write h-full flex flex-col items-center py-4 space-y-4 border-r-1">
      <button
        className={`p-3 cursor-pointer rounded-full ${selected === "subtitles" ? "bg-red-200" : ""}`}
        onClick={() => onSelect("subtitles")}
      >
        <Subtitles />
      </button>
      <button
        className={`p-3 cursor-pointer rounded-full ${selected === "music" ? "bg-red-200" : ""}`}
        onClick={() => onSelect("music")}
      >
        <Music />
      </button>
      <button
        className={`p-3 cursor-pointer rounded-full ${selected === "sticker" ? "bg-red-200" : ""}`}
        onClick={() => onSelect("sticker")}
      >
        <Stamp />
      </button>
    </div>
  );
}
