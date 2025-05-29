import React from "react";

interface RenameDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    newName: string;
    onNameChange: (name: string) => void;
    onRename: () => void;
    onCancel: () => void;
}

const RenameDialog = ({
    isOpen,
    onOpenChange,
    newName,
    onNameChange,
    onRename,
    onCancel,
}: RenameDialogProps) => {
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
            aria-labelledby="rename-dialog-title"
            aria-describedby="rename-dialog-description"
        >
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-12 shadow-2xl w-full max-w-lg sm:max-w-xl mx-auto transform transition-all duration-300 scale-100">
                <h2
                    id="rename-dialog-title"
                    className="text-5xl sm:text-5xl font-bold text-gray-900 mb-8 text-center"
                >
                    Đặt lại tên video
                </h2>
                <input
                    id="rename-dialog-description"
                    type="text"
                    value={newName}
                    onChange={(e) => onNameChange(e.target.value)}
                    className="w-full p-5 text-3xl text-gray-700 border border-gray-300 rounded-full mb-12 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-200"
                    placeholder="Nhập tên mới"
                    autoFocus
                    aria-label="Tên video mới"
                />
                <div className="flex justify-center gap-8">
                    <button
                        className="px-10 py-5 text-3xl font-semibold text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-400"
                        onClick={onCancel}
                        aria-label="Hủy đổi tên video"
                    >
                        Hủy
                    </button>
                    <button
                        className="px-10 py-5 text-3xl font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400"
                        onClick={onRename}
                        aria-label="Xác nhận đổi tên video"
                    >
                        Đổi tên
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RenameDialog;