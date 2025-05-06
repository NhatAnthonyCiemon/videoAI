import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import React from "react";

function CreateTop() {
    const buttonContent: string[] = [
        "Soạn kịch bản và chọn giọng đọc",
        "Tạo hình ảnh",
        "Tạo video",
    ];
    const whichActive: number = 0;
    const classButton: string = "px-[40px] py-[20px] text-xl flex-grow";
    const classActive: string = clsx(classButton, "text-white ");
    const classNotActive: string = clsx(
        classButton,
        "text-black bg-gray-200 hover:bg-gray-200"
    );
    return (
        <div className="w-full pt-[50px] pb-[50px] mb-[10px]">
            <h1 className="text-3xl font-bold mb-[10px]">Tạo video AI</h1>
            <div className="flex items-center gap-[10px]">
                {buttonContent.map((item, index) => (
                    <React.Fragment key={index}>
                        <Button
                            className={clsx(
                                index === whichActive
                                    ? classActive
                                    : classNotActive
                            )}
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
    );
}

export default CreateTop;
