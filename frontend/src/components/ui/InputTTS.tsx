"use client";

import { useState, useRef } from 'react';
interface VoiceSelectorProps {
   voices: string[];
   demoMp3Url: string; // URL mp3 demo do bạn cung cấp
}

export default function VoiceSelector({ voices, demoMp3Url }: VoiceSelectorProps) {
  const [selectedVoice, setSelectedVoice] = useState<string>(voices[0] || "");
  const [rate, setRate] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [text, setText] = useState("xin chào bạn, tôi là một giọng nói AI. Tôi có thể giúp gì cho bạn hôm nay?");
const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };


  return (
    <div>
      {/* Voice Selector */}
      <div>
        <label
          htmlFor="voice"
          className="mb-3 block text-sm font-medium text-gray-700 mb-1"
        >
          Giọng đọc
        </label>
        <div className="relative mb-4">
          <select
            id="voice"
            className="block w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
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
      <div>
        <label
          htmlFor="rate"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tốc độ (Rate): {rate.toFixed(1)}
        </label>
        <input
          id="rate"
          type="range"
          min="-50"
          max="50"
          step="0.1"
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Pitch Slider */}
      <div>
        <label
          htmlFor="pitch"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tông giọng (Pitch): {pitch.toFixed(1)}
        </label>
        <input
          id="pitch"
          type="range"
          min="-50"
          max="50"
          step="0.1"
          value={pitch}
          onChange={(e) => setPitch(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      {/* Text Input with Character Counter */}
      <div>
        <label
          htmlFor="text-input"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nội dung (tối đa 100 ký tự)
        </label>
        <textarea
          id="text-input"
          rows={3}
          maxLength={100}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Nhập nội dung..."
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {text.length}/100
        </div>
      </div>

      {/* Nút nghe thử */}
      <div>
        <button
          onClick={handlePlay}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Nghe thử
        </button>
      </div>

      {/* Audio element ẩn để phát */}
      <audio ref={audioRef} src={demoMp3Url} preload="auto" controls className="w-full mt-2 rounded" />

    </div>
  );
}
