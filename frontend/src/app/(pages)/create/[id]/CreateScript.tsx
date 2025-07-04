"use client";

import { useState, useRef, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useDebounce from "@/hooks/useDebounce";
import * as Popover from "@radix-ui/react-popover";
import fetchApi from "@/lib/api/fetch";
import APIResponse from "@/types/apiResponse";
import HttpMethod from "@/types/httpMethos";
import LoadingIcon from "@/components/ui/LoadingIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VoiceSelector from "@/components/ui/InputTTS";
import useOverlay from "@/hooks/useOverlay";
import videoClass from "../../../../lib/Video";
import Video from "@/types/Video";
import DraftModal from "@/components/ui/DraftModal";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { Image_video } from "@/types/Video";
import CustomCheckBox from "@/components/ui/CheckBoxCustom";
import VoiceText from "@/components/ui/VoiceText";

const voices = [
    "vi-VN-HoaiMyNeural (vi-VN, Female)",
    "vi-VN-NamMinhNeural (vi-VN, Male)",
    "en-US-BrianNeural (en-US, Male)",
    "en-US-EmmaNeural (en-US, Female)",
];

const styles = [
    "Tự do",
    "Nhà viết truyện chuyên nghiệp",
    "Nghiệp dư",
    "Nhà lí luận chính trị",
];
export default function CreateScript({
    setWhichActive,
    videoData,
    setVideoData,
    isPreparing,
    setIsPreparing,
    isCustomVoice,
    setIsCustomVoice,
}: {
    setWhichActive: (Active: number) => void;
    videoData: Video;
    setVideoData: (video: Video) => void;
    isPreparing: boolean;
    setIsPreparing: (Active: boolean) => void;

    isCustomVoice: boolean;
    setIsCustomVoice: (isCustomVoice: boolean) => void;
}) {
    const [disabled, setDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerate, setIsGenerate] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [isShowSuggestions, setIsShowSuggestions] = useState(false);
    const debouncedValue = useDebounce(videoData.keyword, 500);
    const inputRef = useRef<HTMLInputElement>(null);
    const generateScriptRef = useRef<HTMLButtonElement>(null);
    const [suggestions, setSuggestions] = useState([] as string[]);
    const { isModalOpen, openModal, closeModal } = useOverlay();

    useEffect(() => {
        if (!isModalOpen && typeof window !== "undefined") {
            document.body.style.overflow = "auto";
        }
    }, [isModalOpen]);
    useEffect(() => {
        if (debouncedValue.length > 0) {
            const url =
                isSearch === true
                    ? `http://localhost:4000/trend/google`
                    : `http://localhost:4000/trend/AI`;
            console.log("url", url);
            setIsLoading(true);
            fetchApi<string[]>(url, HttpMethod.POST, {
                keyword: debouncedValue,
                platform: videoData.category,
            })
                .then((res: APIResponse<string[]>) => {
                    if ((res.mes = "success")) {
                        //chỉ lấy tối đa 8 gợi ý
                        setSuggestions(res.data!!.slice(0, 7));
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
    }, [debouncedValue, isSearch, videoData.category]);
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [videoData.keyword]);
    const handleGenerateScript = () => {
        if (videoData.keyword.length === 0) return;
        setIsLoading(true);
        setIsGenerate(true);
        setDisabled(true);
        fetchApi<string>(`http://localhost:4000/content`, HttpMethod.POST, {
            topic: videoData.keyword,
            style: videoData.style_video,
        })
            .then((res: APIResponse<string>) => {
                if (res.mes === "success") {
                    const newVideoData = videoClass.updateVideo(
                        videoData,
                        "content",
                        res.data!!
                    );
                    setVideoData(newVideoData);
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
    const handleNextStep = async () => {
        if (videoData.step !== 0) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
            const newVideoData = videoClass.updateVideo(
                videoData,
                "image_video",
                []
            );
            setVideoData(videoClass.updateVideo(newVideoData, "step", 0));
        }
        setIsPreparing(true);
        setWhichActive(1);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

        const res = await fetchApi<Image_video[]>(
            `http://localhost:4000/content/getcontentimage`,
            HttpMethod.POST,
            videoData
        );
        if (res.mes === "success") {
            const newVideoData = videoClass.updateVideo(
                videoData,
                "image_video",
                res.data!!
            );
            const newVideoData2 = videoClass.updateVideo(
                newVideoData,
                "step",
                1
            );
            setVideoData(newVideoData2);
            setIsPreparing(false);
        } else {
            throw new Error("Invalid response format");
        }
    };

    return (
        <div>
            {!isPreparing && (
                <div className="flex flex-col mb-[20px] gap-6 mw-[100%] border border-[#AFAFAF] rounded-lg p-8 bg-white">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                                Xu hướng
                            </h2>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {[
                                    "Tiktok",
                                    "Youtube",
                                    "Twitter",
                                    "Instagram",
                                ].map((platform) => (
                                    <button
                                        key={platform}
                                        className={`px-4 py-2 rounded-md text-xl font-medium cursor-pointer ${
                                            videoData.category === platform
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-800"
                                        }`}
                                        onClick={() => {
                                            setVideoData(
                                                videoClass.updateVideo(
                                                    videoData,
                                                    "category",
                                                    platform
                                                )
                                            );
                                        }}
                                    >
                                        {platform}
                                    </button>
                                ))}
                            </div>
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                                Chọn phong cách
                            </h2>

                            <div className="mt-4 mb-6">
                                <Select
                                    onValueChange={(value) => {
                                        setVideoData(
                                            videoClass.updateVideo(
                                                videoData,
                                                "style_video",
                                                value
                                            )
                                        );
                                    }}
                                >
                                    <SelectTrigger
                                        className="!w-[100%] !h-[40px] py-5 text-xl focus:outline-none focus-visible:outline-none 
             focus:ring-0 focus-visible:ring-0 
             ring-0 shadow-none"
                                    >
                                        <SelectValue
                                            placeholder={
                                                videoData.style_video ||
                                                "Chọn phong cách"
                                            }
                                        />
                                    </SelectTrigger>

                                    <SelectContent className="p-0">
                                        {styles.map((category) => (
                                            <SelectItem
                                                key={category}
                                                value={category}
                                                className="py-4 px-3 text-2xl"
                                            >
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-2xl font-medium mb-2 text-gray-800">
                                        Từ khóa/ Xu hướng (Optional)
                                    </label>
                                    <CustomCheckBox
                                        isChecked={isSearch}
                                        handleChange={setIsSearch}
                                        label="Tìm kiếm trên mạng"
                                    />
                                </div>
                                <div className="flex gap-2 relative">
                                    <Popover.Root
                                        open={
                                            videoData.keyword.length > 0 &&
                                            isShowSuggestions &&
                                            !isLoading
                                        }
                                    >
                                        <Popover.Trigger asChild>
                                            <Input
                                                type="text"
                                                value={videoData.keyword}
                                                disabled={disabled}
                                                onChange={(e) => {
                                                    setVideoData(
                                                        videoClass.updateVideo(
                                                            videoData,
                                                            "keyword",
                                                            e.target.value
                                                        )
                                                    );
                                                    if (
                                                        e.target.value.length >
                                                        0
                                                    ) {
                                                        if (
                                                            e.target.value !==
                                                            debouncedValue
                                                        ) {
                                                            setIsLoading(true);
                                                        }
                                                        setIsShowSuggestions(
                                                            true
                                                        );
                                                    } else {
                                                        setIsLoading(false);
                                                        setIsShowSuggestions(
                                                            false
                                                        );
                                                    }
                                                }}
                                                onFocus={() =>
                                                    setIsShowSuggestions(true)
                                                }
                                                onBlur={() => {
                                                    // Trì hoãn đóng dropdown để onClick có thể chạy
                                                    setTimeout(() => {
                                                        setIsShowSuggestions(
                                                            false
                                                        );
                                                    }, 200);
                                                }}
                                                placeholder="Nhập từ khóa, chủ đề hoặc ý tưởng cho video của bạn"
                                                className="none_focus flex-1 !text-xl px-4 h-[35px] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                ref={inputRef}
                                            />
                                            {/* <VoiceText className="absolute right-0 top-[50%] transform -translate-y-1/2" /> */}
                                        </Popover.Trigger>
                                        <Popover.Portal>
                                            <Popover.Content
                                                side="bottom"
                                                align="start"
                                                style={{
                                                    width:
                                                        inputRef.current
                                                            ?.offsetWidth ||
                                                        "auto",
                                                }}
                                                className="bg-white border border-gray-300 rounded-md shadow-lg w-[895px]"
                                                onOpenAutoFocus={(e) =>
                                                    e.preventDefault()
                                                }
                                                onCloseAutoFocus={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                {suggestions.map((s, index) => (
                                                    <div
                                                        key={index}
                                                        className="w-full px-4 py-4 text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-150 cursor-pointer rounded-md text-2xl
                                                            "
                                                        onClick={() => {
                                                            setVideoData(
                                                                videoClass.updateVideo(
                                                                    videoData,
                                                                    "keyword",
                                                                    s
                                                                )
                                                            );
                                                            setIsShowSuggestions(
                                                                false
                                                            );
                                                        }}
                                                    >
                                                        <p className="overflow-hidden truncate-2-lines">
                                                            {s}
                                                        </p>
                                                    </div>
                                                ))}
                                            </Popover.Content>
                                        </Popover.Portal>
                                    </Popover.Root>
                                    {isLoading && (
                                        <LoadingIcon className="absolute right-[32%] top-1/2 transform -translate-y-1/2" />
                                    )}
                                    <VoiceText
                                        className="mr-[10px]"
                                        videoData={videoData}
                                        setVideoData={setVideoData}
                                        setDisabled={setDisabled}
                                        setIsLoading={setIsLoading}
                                    />
                                    <Button
                                        onClick={handleGenerateScript}
                                        ref={generateScriptRef}
                                        disabled={
                                            videoData.keyword.length === 0 ||
                                            disabled
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
                                    spellCheck="false"
                                    placeholder="Kịch bản ..."
                                    className="text-xl none_focus resize-none overflow-auto h-[350px] w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-[#a1a1a1]"
                                    rows={4}
                                    value={videoData.content}
                                    onChange={(e) => {
                                        const newVideoData =
                                            videoClass.updateVideo(
                                                videoData,
                                                "content",
                                                e.target.value
                                            );
                                        setVideoData(newVideoData);
                                    }}
                                ></textarea>
                            </div>
                        </div>

                        {/* Right Section */}

                        <div className="border border-gray-300 rounded-3xl p-4">
                            <VoiceSelector
                                voices={voices}
                                videoData={videoData}
                                setVideoData={setVideoData}
                                isCustomVoice={isCustomVoice} // truyền state
                                setIsCustomVoice={setIsCustomVoice} // truyền hàm set
                            />
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-8">
                        <Button
                            onClick={() => {
                                openModal();
                            }}
                            disabled={videoData.content.length === 0}
                            className="cursor-pointer text-2xl h-[40px] py-4 min-w-[100px] bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                        >
                            Lưu bản nháp
                        </Button>

                        <Button
                            onClick={handleNextStep}
                            disabled={videoData.content.length === 0}
                            className="cursor-pointer text-2xl px-4 h-[40px] min-w-[100px] bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            {videoData.step === 0 ? "Tạo ảnh" : "Tạo lại"}
                        </Button>
                    </div>
                </div>
            )}
            <DraftModal
                videoData={videoData}
                setVideoData={setVideoData}
                open={isModalOpen}
                onClose={closeModal}
            />

            <LoadingOverlay isPreparing={isPreparing} />
        </div>
    );
}
