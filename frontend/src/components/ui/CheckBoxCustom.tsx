import React, { useState } from "react";

export default function AnimatedCheckbox({
    isChecked,
    handleChange,
    label = "",
}: {
    isChecked?: boolean;
    handleChange: any;
    label?: string;
}) {
    return (
        <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
                onClick={() => {
                    handleChange(!isChecked);
                }}
                className={`w-12 h-7 flex items-center bg-gray-300 rounded-full p-1 duration-300 transition-colors ${
                    isChecked ? "bg-green-500" : ""
                }`}
            >
                <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 transition-transform ${
                        isChecked ? "translate-x-5" : ""
                    }`}
                />
            </div>
            {label && (
                <span
                    onClick={() => {
                        handleChange(!isChecked);
                    }}
                    className="text-lg text-gray-800"
                >
                    {label}
                </span>
            )}
        </label>
    );
}
