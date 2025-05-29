import React, { useEffect, useState } from "react";

interface NotificationProps {
    message: string;
    type?: "success" | "error" | "info";
    onClose?: () => void;
    duration?: number; // thời gian hiển thị (ms)
}

const bgColor = {
    success: "bg-green-100 text-green-800 border-green-400",
    error: "bg-red-100 text-red-800 border-red-400",
    info: "bg-blue-100 text-blue-800 border-blue-400",
};

const Notification: React.FC<NotificationProps> = ({
    message,
    type = "info",
    onClose,
    duration = 2000,
}) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose && onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-[#201f1f86] flex items-center justify-center z-50 text-2xl">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] p-6 mx-4 animate-fade-in">
                <h2 className="text-4xl font-bold mb-6 mt-3 text-center text-gray-800">
                    {message}
                </h2>
            </div>
        </div>
    );
};

export default Notification;
