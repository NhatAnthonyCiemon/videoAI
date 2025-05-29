import React from "react";

interface DeleteDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    onCancel: () => void;
    videoName: string;
}

const DeleteDialog = ({
    isOpen,
    onOpenChange,
    onConfirm,
    onCancel,
    videoName,
}: DeleteDialogProps) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onCancel();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1000] transition-opacity duration-300"
            onClick={handleOverlayClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="dialog"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
        >
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-12 shadow-2xl w-full max-w-lg sm:max-w-3xl mx-auto transform transition-all duration-300 scale-100">
                <h2
                    id="delete-dialog-title"
                    className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 text-center"
                >
                    Xác nhận xóa video
                </h2>
                <p
                    id="delete-dialog-description"
                    className="text-3xl sm:text-4xl text-gray-700 mb-12 text-center leading-relaxed"
                >
                    Bạn có chắc chắn muốn xóa video{" "}
                    <strong className="text-red-600">"{videoName}"</strong>? Hành động này không thể hoàn tác.
                </p>
                <div className="flex justify-center gap-8">
                    <button
                        className="px-10 py-5 text-3xl font-semibold text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-400"
                        onClick={onCancel}
                        aria-label="Hủy xóa video"
                    >
                        Hủy
                    </button>
                    <button
                        className="px-10 py-5 text-3xl font-semibold text-white bg-red-600 rounded-full hover:bg-red-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-400"
                        onClick={onConfirm}
                        aria-label="Xác nhận xóa video"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteDialog;