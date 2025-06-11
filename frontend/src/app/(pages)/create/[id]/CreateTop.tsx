"use client";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import React from "react";
import Video from "@/types/Video";

function CreateTop({
    whichActive,
    setWhichActive,
    videoData,
}: {
    whichActive: number;
    setWhichActive: (index: number) => void;
    videoData: Video;
}) {
    const buttonContent: string[] = [
        "Soạn kịch bản và chọn giọng đọc",
        "Tạo hình ảnh",
        "Tạo video"
    ];
    const classButton: string = "py-[20px] text-xl flex-1 cursor-pointer";
    const classActive: string = clsx(classButton, "text-white ");
    const classNotActive: string = clsx(
        classButton,
        "text-black bg-gray-200 hover:bg-gray-200"
    );
    return (
        <>
            {whichActive <= 2 ? (
                <div className="w-full pt-[50px] pb-[50px] mb-[10px]">
                    <h1 className="text-3xl font-bold mb-[10px]">Tạo video AI</h1>
                    <div className="flex items-center gap-[10px] w-[1280px]">
                        {buttonContent.map((item, index) => (
                            <React.Fragment key={index}>
                                <Button
                                    onClick={() => {
                                        setWhichActive(index);
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth",
                                        });
                                    }}
                                    className={clsx(
                                        index === whichActive
                                            ? classActive
                                            : classNotActive
                                    )}
                                    disabled={
                                        index > videoData.step && whichActive !== index
                                    }
                                >
                                    {item}
                                </Button>
                                {index !== buttonContent.length - 1 && (
                                    <ChevronRightIcon className="w-6 h-6" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default CreateTop;
