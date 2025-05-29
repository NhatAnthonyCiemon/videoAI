"use client";
import React, { useEffect } from "react";

type LoadingOverlayProps = {
    isPreparing: boolean;
    message?: string;
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isPreparing, message = 'Đang chuẩn bị dữ liệu...' }) => {
    if (!isPreparing) return null; // Không hiển thị nếu isPreparing là false
    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="flex flex-col items-center">
                {/* Icon Loading */}
                <svg
                    className="animate-spin h-24 w-24 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                </svg>
                {/* Text */}
                <p className="mt-4 text-xl text-white font-semibold">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
