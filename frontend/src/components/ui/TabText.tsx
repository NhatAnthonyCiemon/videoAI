"use client";
import { useState } from "react";
import { AlignCenterIcon, AlignLeft, AlignRight, AlignJustify } from "lucide-react";

export default function TabText({
    subtitle,
    onUpdate
}: {
    subtitle: any;
    onUpdate: (sub: any) => void;
}) {
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
                <div className="space-y-4 text-2xl pt-4 bg-white overflow-hidden overflow-y-auto p-4 custom-scroll">
                    <h2 className="font-bold">Subtitle Settings</h2>

                    <div className="p-2">
                        <div className="flex flex-col justify-between mb-5">
                            <label className="block font-medium mt-1">Width</label>
                            <div className="flex mt-2 mb-5">
                                <input
                                    type="number"
                                    value={subtitle.style.width || 300}
                                    onChange={(e) => updateStyle({ width: parseInt(e.target.value) })}
                                    className="border p-1 rounded w-[100px]"
                                />
                            </div>
                            <label className="block font-medium mb-1 mt-5">Text Alignment</label>
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

                        <div className="mt-10">
                            <label className="block font-medium mb-1">Font</label>
                            <div className="flex gap-2 text-2xl">
                                <button
                                    className={`font-bold cursor-pointer btn w-12 h-12 border p-1 rounded ${subtitle.style.fontStyle?.includes("bold") ? "bg-gray-300" : ""}`}
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
                            </div>
                            <div className="flex mt-4">
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
                            <label className="block font-medium mt-10">Color</label>
                            <div className="flex mt-2">
                                <input
                                    type="color"
                                    value={subtitle.style.fontColor?.split("@")[0] || "#FFFFFF"}
                                    onChange={(e) => updateStyle({ fontColor: `${e.target.value}@1.0` })}
                                    className="border p-1 rounded w-full mr-2 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={subtitle.style.fontColor?.split("@")[0] || "#FFFFFF"}
                                    onChange={(e) => updateStyle({ fontColor: `${e.target.value}@1.0` })}
                                    className="border p-1 rounded w-[70px]"
                                />
                            </div>
                            <label className="block font-medium mt-10">Background Color</label>
                            <div className="flex mt-2">
                                <input
                                    type="color"
                                    value={subtitle.style.backgroundColor?.split("@")[0] || "#FFFFFF"}
                                    onChange={(e) => updateStyle({ backgroundColor: `${e.target.value}@1.0` })}
                                    className="border p-1 rounded w-full mr-2 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={subtitle.style.backgroundColor?.split("@")[0] || "#FFFFFF"}
                                    onChange={(e) => updateStyle({ backgroundColor: `${e.target.value}@1.0` })}
                                    className="border p-1 rounded w-[70px]"
                                />
                            </div>
                        </div>

                        <div className="mt-10">
                            <label className="block font-medium mb-1">Position</label>
                            <div className="flex gap-2 text-xl">
                                <button
                                    className={`cursor-pointer btn w-30 h-12 border p-1 rounded ${subtitle.style.position === "top" ? "bg-gray-300" : ""}`}
                                    onClick={() => updateStyle({ position: "top" })}
                                >
                                    Top
                                </button>
                                <button
                                    className={`cursor-pointer btn w-30 h-12 border p-1 rounded ${subtitle.style.position === "middle" ? "bg-gray-300" : ""}`}
                                    onClick={() => updateStyle({ position: "middle" })}
                                >
                                    Middle
                                </button>
                                <button
                                    className={`cursor-pointer btn w-30 h-12 border p-1 rounded ${subtitle.style.position === "bottom" ? "bg-gray-300" : ""}`}
                                    onClick={() => updateStyle({ position: "bottom" })}
                                >
                                    Bottom
                                </button>
                            </div>
                        </div>

                        <div className="mt-10">
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

                                <div className="flex-col ml-5">
                                    {subtitle.style.shadow && (
                                        <div className="">
                                            <label className="block font-medium mb-1">Shadow Settings</label>
                                            <div className="flex flex-col gap-2 text-lg">
                                                <div className="flex items-center">
                                                    <label className="w-24">Color</label>
                                                    <input
                                                        type="color"
                                                        value={subtitle.style.shadow.color || "#000000"}
                                                        onChange={(e) => updateStyle({
                                                            shadow: { ...subtitle.style.shadow, color: e.target.value }
                                                        })}
                                                        className="border p-1 rounded w-[60px]"
                                                    />
                                                </div>
                                                <div className="flex items-center">
                                                    <label className="w-24">Blur</label>
                                                    <input
                                                        type="number"
                                                        value={subtitle.style.shadow.blur || 4}
                                                        onChange={(e) => updateStyle({
                                                            shadow: { ...subtitle.style.shadow, blur: parseInt(e.target.value) }
                                                        })}
                                                        className="border p-1 rounded w-[60px]"
                                                    />
                                                </div>
                                                <div className="flex items-center">
                                                    <label className="w-24">Offset X</label>
                                                    <input
                                                        type="number"
                                                        value={subtitle.style.shadow.offsetX || 2}
                                                        onChange={(e) => updateStyle({
                                                            shadow: { ...subtitle.style.shadow, offsetX: parseInt(e.target.value) }
                                                        })}
                                                        className="border p-1 rounded w-[60px]"
                                                    />
                                                </div>
                                                <div className="flex items-center">
                                                    <label className="w-24">Offset Y</label>
                                                    <input
                                                        type="number"
                                                        value={subtitle.style.shadow.offsetY || 2}
                                                        onChange={(e) => updateStyle({
                                                            shadow: { ...subtitle.style.shadow, offsetY: parseInt(e.target.value) }
                                                        })}
                                                        className="border p-1 rounded w-[60px]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

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
                                                        className="border p-1 rounded w-[60px]"
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
                                                        className="border p-1 rounded w-[60px]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}