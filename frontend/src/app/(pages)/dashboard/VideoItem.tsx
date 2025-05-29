"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InforVideo from "@/types/inforVideo";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import RenameDialog from "./RenameDialog"; // Import component mới
import fetchApi from "@/lib/api/fetch";
import HttpMethod from "@/types/httpMethos";

interface VideoItemProps {
    inforVideo: InforVideo;
    onViewClick: () => void;
    onClickVideo: () => void;
}

const VideoItem = ({ inforVideo, onViewClick, onClickVideo }: VideoItemProps) => {
    const { id, url, keyword, name, category, created_at } = inforVideo;
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newName, setNewName] = useState(name);
    const [displayName, setDisplayName] = useState(name);

    const handleRename = async () => {
        try {
            const url = `http://localhost:4000/video/renameVideo/${id}`;
            const res = await fetchApi<{ mes: string; status: number; message: string }>(
                url,
                HttpMethod.POST,
                { name: newName }
            );

            if (res.mes === "success" && res.status === 200) {
                setDisplayName(newName);
                setIsDialogOpen(false);
            } else {
                throw new Error(res.message || "Không thể đổi tên video");
            }
        } catch (error: any) {
            console.error("Error renaming video:", error.message);
            alert(error.message);
            setIsDialogOpen(false); // Đóng dialog ngay cả khi có lỗi
        }
    };

    const handleCancel = () => {
        console.log("Closing dialog via Cancel button");
        setNewName(name); // Đặt lại tên gốc
        setIsDialogOpen(false); // Đóng dialog
    };

    return (
        <div className="rounded-xl overflow-hidden border shadow-sm bg-white">
            <div
                className="relative h-[400px] w-full aspect-[9/16] bg-gray-300"
                onClick={onClickVideo}
            >
                <video
                    src={url}
                    title={keyword}
                    className="absolute top-0 left-0 w-full h-full rounded-xl cursor-pointer"
                />
            </div>

            <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-3xl truncate max-w-[70%]">
                        {displayName}
                    </span>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button
                                className="text-2xl p-2 border border-gray-300 rounded-lg hover:bg-gray-100 bg-gray-50 transition-colors duration-200 cursor-pointer flex items-center shadow-sm"
                                aria-label="Tùy chọn"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-7 h-7"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6v.01M12 12v.01M12 18v.01"
                                    />
                                </svg>
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                className="bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]"
                                sideOffset={5}
                                align="end"
                            >
                                <DropdownMenu.Item
                                    className="px-4 py-2 text-xl text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("Opening rename dialog");
                                        setIsDialogOpen(true);
                                    }}
                                >
                                    Đặt lại tên
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                    className="px-4 py-2 text-xl text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`http://localhost:3000/create/${id}`);
                                    }}
                                >
                                    Chỉnh sửa
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                    className="px-4 py-2 text-xl text-red-600 hover:bg-gray-100 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("Xóa");
                                    }}
                                >
                                    Xóa
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>

                <div className="flex items-center text-xl text-gray-600">
                    <span>{new Date(created_at).toLocaleDateString("vi-VN")}</span>
                    <span className="mx-2">•</span>
                    <span>{category || "Chưa có danh mục"}</span>
                </div>

                <div className="flex justify-end">
                    <button
                        className="text-xl px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 bg-gray-50 transition-colors duration-200 cursor-pointer shadow-sm font-medium"
                        onClick={onViewClick}
                    >
                        Xem
                    </button>
                </div>
            </div>

            <RenameDialog
                isOpen={isDialogOpen}
                onOpenChange={(open) => {
                    console.log("Dialog open state:", open);
                    setIsDialogOpen(open);
                    if (!open) setNewName(name);
                }}
                newName={newName}
                onNameChange={setNewName}
                onRename={handleRename}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default React.memo(VideoItem);