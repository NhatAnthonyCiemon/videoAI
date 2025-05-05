import { Music, Subtitles } from "lucide-react";

type SideBarProps = {
  selected: string;
  onSelect: (key: string) => void;
};

export default function SideBar({ selected, onSelect }: SideBarProps) {
  return (
    <div className="w-20 bg-pink-100 h-full flex flex-col items-center py-4 space-y-4">
      <button
        className={`p-2 rounded-full ${selected === "subtitles" ? "bg-white" : ""}`}
        onClick={() => onSelect("subtitles")}
      >
        <Subtitles />
      </button>
      <button
        className={`p-2 rounded-full ${selected === "music" ? "bg-white" : ""}`}
        onClick={() => onSelect("music")}
      >
        <Music />
      </button>
    </div>
  );
}
