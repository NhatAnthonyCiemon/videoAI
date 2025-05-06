"use client";
import { useState } from "react";

import { AlignCenterIcon, AlignJustify, AlignLeft, AlignRight } from "lucide-react";

export default function FormatVideo() {
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(16);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [textAlignment, setTextAlignment] = useState("left");
  const [textFill, setTextFill] = useState("top");
  const [textEffect, setTextEffect] = useState("none");
  const [textColor, setTextColor] = useState("#000000");
  const [tab, setTab] = useState("sticker");


  return (
    <div className="w-[360px] h-full bg-white border-l-1 border-gray-700 flex flex-col">
      <div className="bg-gray-300 pt-5 pb-3">
        <div className="flex gap-2 text-xl justify-center pl-3 pr-3">
          <button
            className={`w-full cursor-pointer h-12 p-1 rounded ${tab === 'text' ? "bg-white border" : ""}`}
            onClick={() => setTab('text')}
          >
            Text
          </button>
          <button
            className={`w-full cursor-pointer h-12 p-1 rounded ${tab === 'sticker' ? "bg-white border" : ""}`}
            onClick={() => setTab('sticker')}
          >
            Sticker
          </button>
          <button
            className={`w-full cursor-pointer h-12 p-1 rounded ${tab === 'music' ? "bg-white border" : ""}`}
            onClick={() => setTab('music')}
          >
            Music
          </button>


        </div>
      </div>

      <div className="space-y-4 text-xl pt-4 bg-white overflow-y-auto p-4">
        <h2 className="font-bold">Subtitle Settings</h2>

        <div className="p-2">
          <div className="flex flex-col justify-between mb-5">
            <span>Text Alignment</span>
            <div className="flex gap-2 mt-2">
              <AlignLeft className={`border cursor-pointer rounded-md p-1 ${textAlignment === 'left' ? "bg-gray-300" : ""}`} size={28} color="black" onClick={() => setTextAlignment('left')}/>
              <AlignCenterIcon className={`border cursor-pointer rounded-md p-1 ${textAlignment === 'center' ? "bg-gray-300" : ""}`} size={28} color="black" onClick={() => setTextAlignment('center')}/>
              <AlignRight className={`border cursor-pointer rounded-md p-1 ${textAlignment === 'right' ? "bg-gray-300" : ""}`} size={28} color="black" onClick={() => setTextAlignment('right')}/>
              <AlignJustify className={`border cursor-pointer rounded-md p-1 ${textAlignment === 'justify' ? "bg-gray-300" : ""}`} size={28} color="black" onClick={() => setTextAlignment('justify')}/>
            </div>
          </div>

          <div className="mt-10">
            <label className="block font-medium mb-1">Font</label>
            <div className="flex gap-2 text-2xl">
              <button
                className={`font-bold cursor-pointer btn w-12 h-12 border p-1 rounded ${bold ? "bg-gray-300" : ""}`}
                onClick={() => setBold(!bold)}
              >
                B
              </button>
              <button
                className={`italic cursor-pointer w-12 h-12 border p-1 rounded ${italic ? "bg-gray-300" : ""}`}
                onClick={() => setItalic(!italic)}
              >
                I
              </button>
              <button
                className={`underline cursor-pointer w-12 h-12 border p-1 rounded ${underline ? "bg-gray-300" : ""}`}
                onClick={() => setUnderline(!underline)}
              >
                U
              </button>
            </div>
            <div className="flex mt-4">
              <select
                className="border p-1 rounded w-full mr-2"
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
              >
                <option>Arial</option>
                <option>Roboto</option>
              </select>
              <select
                className="border p-1 rounded w-[60px]"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
              >
                <option>16</option>
                <option>18</option>
                <option>20</option>
              </select>
            </div>
            <label className="block font-medium mt-10">Color</label>
            <div className="flex mt-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="border p-1 rounded w-full mr-2 cursor-pointer"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="border p-1 rounded w-[60px]"
              />
            </div>
          </div>

          <div className="mt-10">
            <label className="block font-medium mb-1">Fill</label>
            <div className="flex gap-2 text-xl">
              <button
                className={`cursor-pointer btn w-30 h-12 border p-1 rounded ${textFill === 'top' ? "bg-gray-300" : ""}`}
                onClick={() => setTextFill('top')}
              >
                Top
              </button>
              <button
                className={`cursor-pointer btn w-30 h-12 border p-1 rounded ${textFill === 'middle' ? "bg-gray-300" : ""}`}
                onClick={() => setTextFill('middle')}
              >
                Middle
              </button>
              <button
                className={`cursor-pointer btn w-30 h-12 border p-1 rounded ${textFill === 'bottom' ? "bg-gray-300" : ""}`}
                onClick={() => setTextFill('bottom')}
              >
                Bottom
              </button>
            </div>
          </div>

          <div className="mt-10">
            <label className="block font-medium mb-1">Text Effects</label>
            <div className="flex gap-2 text-xl">
              <button
                className={`cursor-pointer btn w-30 h-12 border p-1 rounded ${textEffect === 'none' ? "bg-gray-300" : ""}`}
                onClick={() => setTextEffect('none')}
              >
                None
              </button>
              <button
                className={`cursor-pointer btn w-30 h-12 border p-1 rounded ${textEffect === 'shadow' ? "bg-gray-300" : ""}`}
                onClick={() => setTextEffect('shadow')}
              >
                Shadow
              </button>
              <button
                className={`cursor-pointer btn w-30 h-12 border p-1 rounded ${textEffect === 'outline' ? "bg-gray-300" : ""}`}
                onClick={() => setTextEffect('outline')}
              >
                Outline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
