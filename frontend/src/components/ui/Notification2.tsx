import React from "react";

interface Notification2Props {
    isOpen: boolean;
    message: string;
    onClose: () => void;
}

const Notification2 = ({ isOpen, message, onClose }: Notification2Props) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1000] transition-opacity duration-300"
            onClick={handleOverlayClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="dialog"
            aria-labelledby="notification-dialog-title"
        >
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl w-full max-w-lg sm:max-w-3xl mx-auto transform transition-all duration-300 scale-100 flex flex-col justify-between">
                <h2
                    id="notification-dialog-title"
                    className="text-4xl sm:text-4xl font-bold text-gray-900 mb-8 text-center max-w-[90%] mx-auto break-words"
                >
                    {message}
                </h2>
                <div className="flex justify-center">
                    <button
                        className="px-10 py-5 text-3xl font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400"
                        onClick={onClose}
                        aria-label="Đóng thông báo"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Notification2;