import React from "react";

interface IncompleteVideoDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onOk: () => void;
}

const IncompleteVideoDialog = ({
    isOpen,
    onOpenChange,
    onOk,
}: IncompleteVideoDialogProps) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onOk();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onOk();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1000] transition-opacity duration-300"
            onClick={handleOverlayClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="dialog"
            aria-labelledby="incomplete-dialog-title"
            aria-describedby="incomplete-dialog-description"
        >
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-12 shadow-2xl w-full max-w-lg sm:max-w-2xl mx-auto transform transition-all duration-300 scale-100">
                <h2
                    id="incomplete-dialog-title"
                    className="text-5xl sm:text-5xl font-bold text-gray-900 mb-8 text-center"
                >
                    Video chưa hoàn thành
                </h2>
                <p
                    id="incomplete-dialog-description"
                    className="text-3xl text-gray-700 mb-12 text-center"
                >
                    Video chưa hoàn thành, vui lòng tiếp tục tạo video.
                </p>
                <div className="flex justify-center">
                    <button
                        className="px-10 py-5 text-3xl font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400"
                        onClick={onOk}
                        aria-label="Đóng thông báo"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IncompleteVideoDialog;