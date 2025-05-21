import { FaSpinner } from "react-icons/fa";

export default function LoadingSpinner({ className }: { className?: string }) {
    return (
        <div className={`flex items-center justify-center ${className || ""}`}>
            <FaSpinner className="animate-spin text-gray-500 text-xl" />
        </div>
    );
}
