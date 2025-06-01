"use client";

import fetchApi from "@/lib/api/fetch";
import HttpMethod from "@/types/httpMethos";
import { useState, useRef } from "react";
import videoClass from "@/lib/Video";
import Video from "@/types/Video";
interface VoiceSelectorProps {
  voices: string[];
  videoData: Video;
  setVideoData: (video: Video) => void;
  isCustomVoice: boolean;
  setIsCustomVoice: (isCustomVoice: boolean) => void;
}

export default function VoiceSelector({
  voices,
  videoData,
  setVideoData,
  isCustomVoice,
  setIsCustomVoice,
}: VoiceSelectorProps) {
  const [text, setText] = useState(
    "xin chào bạn, tôi là một giọng nói AI. Tôi có thể giúp gì cho bạn hôm nay?"
  );
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleVoiceToggle = () => {
    const newValue = !isCustomVoice;
    setIsCustomVoice(newValue);
    console.log("CHON VOICE AI ?:", newValue);

    // Cập nhật videoData với giá trị mới
    const newVideoData = videoClass.updateVideo(
      videoData,
      "is_custom_voice",
      newValue
    );
    setVideoData(newVideoData);

    console.log("CHON VOICE AI ?:", newVideoData);
  };

  const handlePlay = async () => {
    if (text.length === 0) {
      return;
    }
    setLoading(true); // Bắt đầu loading
    setHasData(false);
    const res = await fetchApi<string>(
      "http://localhost:4000/user/api_voice",
      HttpMethod.POST,
      {
        text,
        voice: videoData?.voice_info.voice,
        rate: videoData?.voice_info.rate,
        pitch: videoData?.voice_info.pitch,
      }
    );
    if (res.mes === "success") {
      setHasData(true);
      if (audioRef.current) {
        audioRef.current.src = res.data!!;
        audioRef.current.play();
      }
    }
    if (res.mes === "error") {
      setHasData(false);
      if (audioRef.current) {
        audioRef.current.src =
          "https://res.cloudinary.com/dasqsts9r/video/upload/v1746943227/output_audio_y7osuo.mp3";
      }
    }
    setLoading(false); // Kết thúc loading
  };
  return (
    <div>
      {/* Voice Selector */}
      <div className="mb-4">
        <label
          htmlFor="voice"
          className="block text-2xl font-medium text-gray-700 mb-1 flex justify-between items-center gap-3"
        >
          Giọng đọc
          <div className="flex items-center gap-4">
            {/* Checkbox ngay cạnh label */}
            <input
              type="checkbox"
              id="voice-check"
              className="ml-2 w-5 h-5 accent-blue-600"
              checked={isCustomVoice}
              onChange={handleVoiceToggle}
            />
            <span className="text-gray-500">Sử dụng voice của bạn</span>
          </div>
        </label>
        <div className="relative mb-4">
          <select
            id="voice"
            className="block text-xl w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={videoData?.voice_info.voice}
            onChange={(e) => {
              const newVoiceInfo = {
                ...videoData.voice_info,
                voice: e.target.value,
              };
              setVideoData(
                videoClass.updateVideo(videoData, "voice_info", newVoiceInfo)
              );
            }}
            disabled={isCustomVoice}
          >
            {voices.map((voice, idx) => (
              <option key={idx} value={voice}>
                {voice}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 011.414-1.414L10 9.586l2.293-2.293a1 1 0 011.414 1.414l-3 3A1 1 0 0110 12z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Rate Slider */}
      <div className="mb-4">
        <label
          htmlFor="rate"
          className="block text-2xl font-medium text-gray-700 mb-1"
        >
          Tốc độ (Rate): {videoData.voice_info.rate.toFixed(1)}
        </label>
        <input
          id="rate"
          type="range"
          min="-50"
          max="50"
          step="1"
          value={videoData.voice_info.rate}
          onChange={(e) => {
            const newVoiceInfo = {
              ...videoData.voice_info,
              rate: parseFloat(e.target.value),
            };
            setVideoData({
              ...videoData,
              voice_info: newVoiceInfo,
            });
          }}
          className="w-full"
          disabled={isCustomVoice}
        />
      </div>

      {/* Pitch Slider */}
      <div>
        <label
          htmlFor="pitch"
          className="block text-2xl font-medium text-gray-700 mb-1"
        >
          Tông giọng (Pitch): {videoData.voice_info.pitch.toFixed(1)}
        </label>
        <input
          id="pitch"
          type="range"
          min="-50"
          max="50"
          step="1"
          value={videoData.voice_info.pitch}
          onChange={(e) => {
            const newVoiceInfo = {
              ...videoData.voice_info,
              pitch: parseFloat(e.target.value),
            };
            setVideoData({
              ...videoData,
              voice_info: newVoiceInfo,
            });
          }}
          className="w-full"
          disabled={isCustomVoice}
        />
      </div>
      {/* Text Input with Character Counter */}
      <div className=" mt-4">
        <label
          htmlFor="text-input"
          className="block text-2xl font-medium text-gray-700 mb-1"
        >
          Nội dung (tối đa 100 ký tự)
        </label>
        <textarea
          id="text-input"
          rows={3}
          maxLength={100}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="text-xl none_focus resize-none overflow-auto h-[50px] w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-[#a1a1a1]"
          placeholder="Nhập nội dung..."
          disabled={isCustomVoice}
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {text.length}/100
        </div>
      </div>

      {/* Nút nghe thử */}
      <div>
        <div>
          <button
            onClick={handlePlay}
            disabled={loading || isCustomVoice}
            className={`bg-blue-500 mb-2 text-white px-4 py-2 rounded-lg transition ${
              loading || isCustomVoice
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {loading ? "Đang tải ..." : "Nghe thử"}
          </button>
        </div>
      </div>

      {/* Audio element ẩn để phát */}
      <audio
        ref={audioRef}
        src="https://res.cloudinary.com/dasqsts9r/video/upload/v1746943227/output_audio_y7osuo.mp3"
        preload="auto"
        controls
        className={`w-full mt-2 rounded ${hasData ? "block" : "hidden"}`}
      />
    </div>
  );
}
