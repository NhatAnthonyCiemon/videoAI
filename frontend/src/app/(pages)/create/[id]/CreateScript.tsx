"use client";

import { useState, useRef, useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";
import * as Popover from "@radix-ui/react-popover";
import fetchApi from "@/lib/api/fetch";
import APIResponse from "@/types/apiResponse";
import HttpMethod from "@/types/httpMethos";
import LoadingIcon from "@/components/ui/LoadingIcon";
import { ContentGenerate, ContentItem } from "@/types/contentGenerate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useOverlay from "@/hooks/useOverlay";
import { useParams } from "next/navigation";

export default function CreateScript({
    whichStep,
    setWhichStep,
    setWhichActive,
    contentVideo,
    setContentVideo,
}: {
    whichStep: number;
    setWhichStep: (step: number) => void;
    setWhichActive: (Active: number) => void;
    contentVideo: ContentGenerate;
    setContentVideo: (content: ContentGenerate) => void;
}) {
    const { id } = useParams();
    const [inputValue, setInputValue] = useState(contentVideo.keyword);
    const [disabled, setDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerate, setIsGenerate] = useState(false);
    const [isShowSuggestions, setIsShowSuggestions] = useState(false);
    const debouncedValue = useDebounce(inputValue, 500);
    const inputRef = useRef<HTMLInputElement>(null);
    const generateScriptRef = useRef<HTMLButtonElement>(null);
    const [suggestions, setSuggestions] = useState([] as string[]);
    const [flatformActive, setFlatformActive] = useState("Tiktok");
    const { isModalOpen, openModal, closeModal } = useOverlay();
    const [name, setName] = useState("Draft");
    const [isStatusSave, setStatusSave] = useState(0);
    const [isSavedDraft, setIsSavedDraft] = useState(false);
    const [isSave, setIsSave] = useState(false);

    if (!isModalOpen) {
        document.body.style.overflow = "auto";
    }
    useEffect(() => {
        if (debouncedValue.length > 0) {
            setIsLoading(true);
            fetchApi<string[]>(`http://localhost:4000/trend`, HttpMethod.POST, {
                keyword: debouncedValue,
                flatform: flatformActive,
            })
                .then((res: APIResponse<string[]>) => {
                    if ((res.mes = "success")) {
                        //chỉ lấy tối đa 8 gợi ý
                        setSuggestions(res.data.slice(0, 8));
                        if (!isGenerate) setIsLoading(false);
                    } else {
                        throw new Error("Invalid response format");
                    }
                })
                .catch(() => {
                    setSuggestions([]);
                });
        } else {
            setIsShowSuggestions(false);
        }
    }, [debouncedValue]);
    const handleGenerateScript = () => {
        if (inputValue.length === 0) return;
        setIsLoading(true);
        setIsGenerate(true);
        setDisabled(true);
        fetchApi<string>(`http://localhost:4000/content`, HttpMethod.POST, {
            topic: inputValue,
        })
            .then((res: APIResponse<string>) => {
                if (res.mes === "success") {
                    setContentVideo({
                        ...contentVideo,
                        fullContent: res.data,
                        keyword: inputValue,
                    });
                    setIsLoading(false);
                    setDisabled(false);
                    setIsGenerate(false);
                } else {
                    throw new Error("Invalid response format");
                }
            })
            .catch(() => {
                setIsLoading(false);
            })
            .finally(() => {
                if (inputRef.current) {
                    inputRef.current.disabled = false;
                }
                setIsLoading(false);
                setIsGenerate(false);
            });
    };
    const handleSaveDraft = () => {
        if (!isSave) {
            if (!isSavedDraft) {
                setIsSavedDraft(true);
                return;
            }
            if (name.length === 0) return;
        }
        setIsLoading(true);
        fetchApi<string>(
            `http://localhost:4000/store/fullcontent`,
            HttpMethod.POST,
            {
                id: id,
                user_id: 1,
                name: name,
                category: flatformActive,
                step: 0,
                content: contentVideo.fullContent,
            }
        ).then((res: APIResponse<string>) => {
            if (res.mes === "success") {
                setStatusSave(1);
                setIsSave(true);
            } else {
                setStatusSave(2);
                openModal();
                setIsSavedDraft(false);
                setName("Draft");
            }
            setIsLoading(false);
        });
    };
    return (
        <div>
            <div className="flex flex-col mb-[20px] gap-6 mw-[100%] border border-[#AFAFAF] rounded-lg p-8 bg-white">
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                            Xu hướng
                        </h2>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {["Tiktok", "Youtube", "Twitter", "Instagram"].map(
                                (platform) => (
                                    <button
                                        key={platform}
                                        className={`px-4 py-2 rounded-md text-xl font-medium cursor-pointer ${
                                            flatformActive === platform
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-800"
                                        }`}
                                        onClick={() => {
                                            setFlatformActive(platform);
                                        }}
                                    >
                                        {platform}
                                    </button>
                                )
                            )}
                        </div>
                        <div className="mb-6">
                            <label className="block text-2xl font-medium mb-2 text-gray-800">
                                Từ khóa/ Xu hướng (Optional)
                            </label>
                            <div className="flex gap-2 relative">
                                <Popover.Root
                                    open={
                                        inputValue.length > 0 &&
                                        isShowSuggestions &&
                                        !isLoading
                                    }
                                >
                                    <Popover.Trigger asChild>
                                        <Input
                                            type="text"
                                            value={inputValue}
                                            disabled={disabled}
                                            onChange={(e) => {
                                                setInputValue(e.target.value);
                                                if (e.target.value.length > 0) {
                                                    if (
                                                        e.target.value !==
                                                        debouncedValue
                                                    ) {
                                                        setIsLoading(true);
                                                    }
                                                    setIsShowSuggestions(true);
                                                } else {
                                                    setIsLoading(false);
                                                    setIsShowSuggestions(false);
                                                }
                                            }}
                                            onFocus={() =>
                                                setIsShowSuggestions(true)
                                            }
                                            onBlur={() => {
                                                // Trì hoãn đóng dropdown để onClick có thể chạy
                                                setTimeout(() => {
                                                    setIsShowSuggestions(false);
                                                }, 200);
                                            }}
                                            placeholder="Nhập từ khóa, chủ đề hoặc ý tưởng cho video của bạn"
                                            className="none_focus flex-1 !text-xl px-4 h-[35px] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            ref={inputRef}
                                        />
                                    </Popover.Trigger>
                                    <Popover.Portal>
                                        <Popover.Content
                                            side="bottom"
                                            align="start"
                                            style={{
                                                width:
                                                    inputRef.current
                                                        ?.offsetWidth || "auto",
                                            }}
                                            className="bg-white border border-gray-300 rounded-md shadow-lg w-[895px]"
                                            onOpenAutoFocus={(e) =>
                                                e.preventDefault()
                                            }
                                            onCloseAutoFocus={(e) =>
                                                e.preventDefault()
                                            }
                                        >
                                            {suggestions.map((s) => (
                                                <div
                                                    key={s}
                                                    className="w-full px-4 py-4 text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-150 cursor-pointer rounded-md text-2xl"
                                                    onClick={() => {
                                                        setInputValue(s);
                                                        setIsShowSuggestions(
                                                            false
                                                        );
                                                    }}
                                                >
                                                    {s}
                                                </div>
                                            ))}
                                        </Popover.Content>
                                    </Popover.Portal>
                                </Popover.Root>
                                {isLoading && (
                                    <LoadingIcon className="absolute right-[24%] top-1/2 transform -translate-y-1/2" />
                                )}
                                <Button
                                    onClick={handleGenerateScript}
                                    ref={generateScriptRef}
                                    disabled={
                                        inputValue.length === 0 || disabled
                                    }
                                    className="cursor-pointer px-4 h-[35px] bg-purple-600 text-white rounded-md hover:bg-purple-700 text-2xl"
                                >
                                    Sinh kịch bản AI
                                </Button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-2xl mt-6 font-medium mb-2 text-gray-800">
                                Kịch bản video
                            </label>
                            <textarea
                                disabled={disabled}
                                placeholder="Kịch bản ..."
                                className="text-xl none_focus resize-none overflow-auto h-[350px] w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-[#a1a1a1]"
                                rows={4}
                                value={contentVideo.fullContent}
                                onChange={(e) => {
                                    setContentVideo({
                                        ...contentVideo,
                                        fullContent: e.target.value,
                                    });
                                }}
                            ></textarea>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                            Chọn giọng đọc AI (TTS)
                        </h2>
                        <div className="flex flex-col gap-4 mb-4">
                            {[1, 2, 3].map((voice) => (
                                <div
                                    key={voice}
                                    className="flex items-center gap-5 border border-gray-300 p-4 rounded-md hover:shadow-md text-2xl cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="voice"
                                        className="cursor-pointer"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            Name
                                        </p>
                                        <p className="text-xl text-gray-500">
                                            Nữ - Mô tả
                                        </p>
                                    </div>
                                    <button className="ml-auto cursor-pointer px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                                        ▶
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mb-6 mt-6">
                            <label className="block text-2xl font-medium mb-2 text-gray-800">
                                Tốc độ giọng đọc
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                className="w-full"
                            />
                        </div>
                        <div className="mb-9">
                            <label className="block text-2xl font-medium mb-2 text-gray-800">
                                Tone giọng
                            </label>
                            <select className="cursor-pointer w-full text-xl px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                                <option className="cursor-pointer">
                                    Menu Label
                                </option>
                            </select>
                        </div>
                        <button className="w-full text-2xl px-4 py-4 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Nghe thử giọng đọc
                        </button>
                        <div className="mt-4 text-xl text-gray-500">
                            <p>Thời lượng: 00:00:00</p>
                            <p>Số từ: 10 từ</p>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-8">
                    <Button
                        onClick={() => {
                            openModal();
                        }}
                        disabled={contentVideo.fullContent.length === 0}
                        className="cursor-pointer text-2xl h-[40px] py-4 min-w-[100px] bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                    >
                        Lưu bản nháp
                    </Button>

                    <button
                        onClick={() => {
                            setWhichStep(1);
                            setWhichActive(1);

                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            });
                        }}
                        className="cursor-pointer text-2xl px-4 py-4 min-w-[100px] bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        {whichStep === 0 ? "Tiếp theo" : "Tạo lại"}
                    </button>
                </div>
            </div>
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
                    onMouseEnter={() => {
                        document.body.style.overflow = "hidden";
                    }}
                    onMouseLeave={() => {
                        document.body.style.overflow = "auto";
                    }}
                >
                    {!isSave ? (
                        <>
                            {isStatusSave === 0 && (
                                <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                                        {!isSavedDraft
                                            ? "Lưu bản nháp"
                                            : "Nhập tên bản nháp"}
                                    </h2>
                                    {!isSavedDraft ? (
                                        <div className="flex justify-end gap-4">
                                            <button
                                                onClick={handleSaveDraft}
                                                className="cursor-pointer text-xl px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                            >
                                                Lưu
                                            </button>
                                            <button
                                                onClick={() => {
                                                    closeModal();
                                                    setIsSavedDraft(false);
                                                    setStatusSave(0);
                                                    setName("Draft");
                                                }}
                                                className="cursor-pointer text-xl px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Input
                                                type="text"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                                placeholder="Nhập tên bản nháp"
                                                className="w-full text-xl px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            />
                                            <div className="flex justify-end gap-4 mt-4">
                                                <Button
                                                    onClick={handleSaveDraft}
                                                    disabled={isLoading}
                                                    className="cursor-pointer text-xl px-4 h-[35px] bg-green-600 text-white rounded-md hover:bg-green-700"
                                                >
                                                    Lưu
                                                </Button>
                                                <Button
                                                    disabled={isLoading}
                                                    onClick={() => {
                                                        closeModal();
                                                        setName("Draft");
                                                        setIsSavedDraft(false);
                                                        closeModal();
                                                    }}
                                                    className="cursor-pointer text-xl px-4 h-[35px] bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                                >
                                                    Hủy
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {isStatusSave === 1 && (
                                <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                                    <h2 className="text-2xl font-semibold mb-4 text-green-800">
                                        Đã lưu bản nháp thành công
                                    </h2>
                                    <div className="flex justify-end gap-4">
                                        <button
                                            onClick={() => {
                                                closeModal();
                                                setIsSavedDraft(false);
                                                setStatusSave(0);
                                                setName("Draft");
                                            }}
                                            className="cursor-pointer text-xl px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            Xong
                                        </button>
                                    </div>
                                </div>
                            )}
                            {isStatusSave === 2 && (
                                <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                                    <h2 className="text-2xl font-semibold mb-4 text-red-800">
                                        Lưu bản nháp thất bại
                                    </h2>
                                    <div className="flex justify-end gap-4">
                                        <button
                                            onClick={() => {
                                                closeModal();
                                                setIsSavedDraft(false);
                                                setStatusSave(0);
                                                setName("Draft");
                                                setIsLoading(false);
                                            }}
                                            className="cursor-pointer text-xl px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            Xong
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {isStatusSave === 0 && (
                                <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                                        Lưu bản nháp
                                    </h2>
                                    <div className="flex justify-end gap-4">
                                        <button
                                            onClick={handleSaveDraft}
                                            className="cursor-pointer text-xl px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            Lưu
                                        </button>
                                        <button
                                            onClick={() => {
                                                closeModal();
                                            }}
                                            className="cursor-pointer text-xl px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            )}
                            {isStatusSave === 1 && (
                                <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                                    <h2 className="text-2xl font-semibold mb-4 text-green-800">
                                        Đã lưu bản nháp thành công
                                    </h2>
                                    <div className="flex justify-end gap-4">
                                        <button
                                            onClick={() => {
                                                closeModal();
                                                setStatusSave(0);
                                            }}
                                            className="cursor-pointer text-xl px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            Xong
                                        </button>
                                    </div>
                                </div>
                            )}
                            {isStatusSave === 2 && (
                                <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                                    <h2 className="text-2xl font-semibold mb-4 text-red-800">
                                        Lưu bản nháp thất bại
                                    </h2>
                                    <div className="flex justify-end gap-4">
                                        <button
                                            onClick={() => {
                                                closeModal();
                                                setStatusSave(0);
                                            }}
                                            className="cursor-pointer text-xl px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            Xong
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
