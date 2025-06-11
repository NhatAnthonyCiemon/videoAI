"use client";
import { useState } from "react";
import { AlignCenterIcon, AlignLeft, AlignRight } from "lucide-react";
import { SketchPicker } from "react-color";
import { hexAlphaToRgba, rgbaToHexAlpha } from "./color";

export default function TabText({
    subtitle,
    onUpdate
}: {
    subtitle: any;
    onUpdate: (sub: any) => void;
}) {
    const [showFontColorPicker, setShowFontColorPicker] = useState(false);
    const [showBgColorPicker, setShowBgColorPicker] = useState(false);

    const updateStyle = (newStyle: any) => {
        onUpdate({ ...subtitle, style: { ...subtitle.style, ...newStyle } });
    };

    const handleFontStyle = (style: string, value: boolean) => {
        const currentStyles = subtitle?.style?.fontStyle || [];
        const newStyles = value
            ? [...currentStyles, style]
            : currentStyles.filter((s: string) => s !== style);
        updateStyle({ fontStyle: newStyles });
    };

    return (
        <>
            {subtitle && (
                <div className="flex h-full flex-row justify-between gap-8 text-2xl pt-4 bg-white">
                    {/* Width + Align */}
                    <div className="min-w-[120px]">
                        <label className="block font-medium mt-1">Width</label>
                        <div className="flex mt-2 mb-5">
                            <input
                                type="number"
                                value={subtitle.style.width || 300}
                                onChange={(e) => updateStyle({ width: parseInt(e.target.value) })}
                                className="border p-1 rounded w-[100px]"
                            />
                        </div>

                        <label className="block font-medium mb-1">Text Alignment</label>
                        <div className="flex gap-2 mt-2">
                            <AlignLeft
                                className={`border cursor-pointer rounded-md p-1 ${subtitle.style.alignment === "left" ? "bg-gray-300" : ""}`}
                                size={28}
                                color="black"
                                onClick={() => updateStyle({ alignment: "left" })}
                            />
                            <AlignCenterIcon
                                className={`border cursor-pointer rounded-md p-1 ${subtitle.style.alignment === "center" ? "bg-gray-300" : ""}`}
                                size={28}
                                color="black"
                                onClick={() => updateStyle({ alignment: "center" })}
                            />
                            <AlignRight
                                className={`border cursor-pointer rounded-md p-1 ${subtitle.style.alignment === "right" ? "bg-gray-300" : ""}`}
                                size={28}
                                color="black"
                                onClick={() => updateStyle({ alignment: "right" })}
                            />
                        </div>
                    </div>

                    {/* Font settings */}
                    <div className="min-w-[300px] border-l border-gray-800 pl-4">
                        <label className="block font-medium mb-1">Font</label>
                        <div className="flex gap-2 text-2xl items-center">
                            <button
                                className={`font-bold cursor-pointer w-12 h-12 border p-1 rounded ${subtitle.style.fontStyle?.includes("bold") ? "bg-gray-300" : ""}`}
                                onClick={() => handleFontStyle("bold", !subtitle.style.fontStyle?.includes("bold"))}
                            >
                                B
                            </button>
                            <button
                                className={`italic cursor-pointer w-12 h-12 border p-1 rounded ${subtitle.style.fontStyle?.includes("italic") ? "bg-gray-300" : ""}`}
                                onClick={() => handleFontStyle("italic", !subtitle.style.fontStyle?.includes("italic"))}
                            >
                                I
                            </button>
                            <div className="flex w-[90%]">
                                <select
                                    className="border p-1 rounded w-full mr-2"
                                    value={subtitle.style.fontFamily || "Arial"}
                                    onChange={(e) => updateStyle({ fontFamily: e.target.value })}
                                >
                                    <option>Arial</option>
                                    <option>Roboto</option>
                                </select>
                                <select
                                    className="border p-1 rounded w-[60px]"
                                    value={subtitle.style.fontSize || 16}
                                    onChange={(e) => updateStyle({ fontSize: parseInt(e.target.value) })}
                                >
                                    <option>16</option>
                                    <option>18</option>
                                    <option>20</option>
                                </select>
                            </div>
                        </div>



                        <div className="flex gap-3">

                            <div>
                                {/* Font Color */}
                                <label className="block font-medium mt-6">Color</label>
                                <div className="flex items-center mt-2 space-x-2">
                                    <div
                                        className="w-10 h-10 rounded border cursor-pointer"
                                        style={{ backgroundColor: subtitle.style.fontColor?.split("@")[0] || "#FFFFFF" }}
                                        onClick={() => setShowFontColorPicker(!showFontColorPicker)}
                                    />
                                    <input
                                        type="text"
                                        value={subtitle.style.fontColor?.split("@")[0] || "#FFFFFF"}
                                        onChange={(e) => updateStyle({ fontColor: `${e.target.value}@1.0` })}
                                        className="border p-1 rounded w-[90px]"
                                    />
                                </div>
                                {showFontColorPicker && (
                                    <div className="relative z-20">
                                        <div className="absolute inset-0" onClick={() => setShowFontColorPicker(false)} />
                                        <div className="absolute mt-2 z-30">
                                            <SketchPicker
                                                color={hexAlphaToRgba(subtitle.style.fontColor || "#FFFFFF@1.0")}
                                                onChange={(color) => {
                                                    const safeRgb = {
                                                        r: color.rgb.r,
                                                        g: color.rgb.g,
                                                        b: color.rgb.b,
                                                        a: color.rgb.a ?? 1.0,
                                                    };
                                                    updateStyle({ fontColor: rgbaToHexAlpha(safeRgb) });
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}



                            </div>
                            <div>
                                {/* Background Color */}
                                <label className="block font-medium mt-6">Background Color</label>
                                <div className="flex items-center mt-2 space-x-2">
                                    <div
                                        className="w-10 h-10 rounded border cursor-pointer"
                                        style={{ backgroundColor: subtitle.style.backgroundColor?.split("@")[0] || "#FFFFFF" }}
                                        onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                                    />
                                    <input
                                        type="text"
                                        value={subtitle.style.backgroundColor?.split("@")[0] || "#FFFFFF"}
                                        onChange={(e) => updateStyle({ backgroundColor: `${e.target.value}@1.0` })}
                                        className="border p-1 rounded w-[90px]"
                                    />
                                </div>
                                {showBgColorPicker && (
                                    <div className="relative z-20">
                                        <div className="absolute inset-0" onClick={() => setShowFontColorPicker(false)} />
                                        <div className="absolute mt-2 z-30">
                                            <SketchPicker
                                                color={hexAlphaToRgba(subtitle.style.backgroundColor || "#FFFFFF@1.0")}
                                                onChange={(color) => {
                                                    const safeRgb = {
                                                        r: color.rgb.r,
                                                        g: color.rgb.g,
                                                        b: color.rgb.b,
                                                        a: color.rgb.a ?? 1.0,
                                                    };
                                                    updateStyle({ backgroundColor: rgbaToHexAlpha(safeRgb) });
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* Position */}
                    <div className="min-w-[200px] border-l border-gray-800 pl-4">
                        <label className="block font-medium mb-1">Position</label>
                        <div className="flex gap-2 text-xl">
                            {["top", "middle", "bottom"].map(pos => (
                                <button
                                    key={pos}
                                    className={`cursor-pointer btn w-30 h-12 border p-1 rounded ${subtitle.style.position === pos ? "bg-gray-300" : ""}`}
                                    onClick={() => updateStyle({ position: pos })}
                                >
                                    {pos[0].toUpperCase() + pos.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Effects */}
                    <div className="min-w-[130px] border-l border-gray-800 pl-4">
                        <label className="block font-medium mb-1">Text Effects</label>
                        <div className="flex gap-2 text-xl">
                            <button
                                className={`cursor-pointer btn w-30 h-12 border p-1 rounded ${subtitle.style.shadow ? "bg-gray-300" : ""}`}
                                onClick={() => updateStyle({
                                    shadow: subtitle.style.shadow ? null : { color: "#000000", blur: 4, offsetX: 2, offsetY: 2 }
                                })}
                            >
                                Shadow
                            </button>
                            <button
                                className={`cursor-pointer btn w-30 h-12 border p-1 rounded ${subtitle.style.outline ? "bg-gray-300" : ""}`}
                                onClick={() => updateStyle({
                                    outline: subtitle.style.outline ? null : { color: "#FF0000", width: 1 }
                                })}
                            >
                                Outline
                            </button>
                        </div>
                    </div>
                    <div className="min-w-[150px]">
                        {/* Shadow Settings */}
                        {subtitle.style.shadow && (
                            <div className="mt-4">
                                <label className="block font-medium mb-1">Shadow Settings</label>
                                <div className="flex flex-col gap-2 text-lg">
                                    {["color", "blur", "offsetX", "offsetY"].map(field => (
                                        <div className="flex items-center" key={field}>
                                            <label className="w-24 capitalize">{field}</label>
                                            <input
                                                type={field === "color" ? "color" : "number"}
                                                value={subtitle.style.shadow[field] || (field === "color" ? "#000000" : 0)}
                                                onChange={(e) => updateStyle({
                                                    shadow: { ...subtitle.style.shadow, [field]: field === "color" ? e.target.value : parseInt(e.target.value) }
                                                })}
                                                className="border p-1 rounded w-[70px]"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="min-w-[150px]">
                        {/* Outline Settings */}
                        {subtitle.style.outline && (
                            <div className="mt-4">
                                <label className="block font-medium mb-1">Outline Settings</label>
                                <div className="flex flex-col gap-2 text-lg">
                                    <div className="flex items-center">
                                        <label className="w-24">Color</label>
                                        <input
                                            type="color"
                                            value={subtitle.style.outline.color || "#FF0000"}
                                            onChange={(e) => updateStyle({
                                                outline: { ...subtitle.style.outline, color: e.target.value }
                                            })}
                                            className="border p-1 rounded w-[70px]"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <label className="w-24">Width</label>
                                        <input
                                            type="number"
                                            value={subtitle.style.outline.width || 1}
                                            onChange={(e) => updateStyle({
                                                outline: { ...subtitle.style.outline, width: parseInt(e.target.value) }
                                            })}
                                            className="border p-1 rounded w-[70px]"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
