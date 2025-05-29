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
        // Prevent closing dialog when clicking inside the content
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000]"
            onClick={handleOverlayClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-lg z-[1001]">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Đặt lại tên video
                </h2>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => onNameChange(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl mb-6 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên mới"
                    autoFocus
                />
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-5 py-3 text-lg text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
                        onClick={onCancel}
                    >
                        Hủy
                    </button>
                    <button
                        className="px-5 py-3 text-lg text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition"
                        onClick={onRename}
                    >
                        Đổi tên
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RenameDialog;