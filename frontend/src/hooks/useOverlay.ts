"use client";
import { useState } from "react";
function useOverlay() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return {
        isModalOpen,
        openModal,
        closeModal,
    };
}

export default useOverlay;
