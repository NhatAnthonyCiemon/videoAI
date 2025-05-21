"use client";

import { Button } from "@/components/ui/button";

interface VideoPopupProps {
    url: string;
    subtitle: string;
    onClose: () => void;
}

export default function VideoPopup({ url, subtitle, onClose }: VideoPopupProps) {
    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <div className="flex max-w-[90vw] max-h-[90vh] w-full h-full bg-black rounded-xl shadow-lg gap-6 p-4 relative">
                {/* Nút đóng góc trên cùng bên phải */}
                <Button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white bg-transparent hover:bg-white/20 text-4xl z-50 rounded-full"
                    aria-label="Đóng video"
                >
                    &times;
                </Button>

                {/* Video 70% */}
                <div className="flex-[7] flex items-center justify-center bg-black rounded-lg overflow-hidden">
                    {url.includes("youtube") ? (
                        <iframe
                            src={url}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <video
                            src={url}
                            controls
                            autoPlay
                            className="w-full h-full object-contain bg-black"
                        />
                    )}
                </div>

                {/* Phụ đề 30% */}
                <div className="flex-[3] p-6 overflow-y-auto text-white text-lg leading-relaxed rounded-lg border border-white/20">
                    <h2 className="mb-4 font-semibold text-2xl">Phụ đề:</h2>
                    <p className="whitespace-pre-line">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}