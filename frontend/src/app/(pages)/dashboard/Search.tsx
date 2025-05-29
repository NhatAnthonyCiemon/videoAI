"use client";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { useFilter } from "./FilterContext";
import fetchApi from "@/lib/api/fetch";
import HttpMethod from "@/types/httpMethos";

function Search() {
    const { search, setSearch, suggestions, setSuggestions } = useFilter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState(search); // Trạng thái tạm thời cho input
    const [isFocused, setIsFocused] = useState(false); // Theo dõi trạng thái focus
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Tự động focus input khi component mount
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            setIsFocused(true); // Đặt focus ban đầu
        }
    }, []);

    // Cập nhật gợi ý khi inputValue thay đổi
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (inputValue) {
            timeoutRef.current = setTimeout(async () => {
                try {
                    const url = `http://localhost:4000/video/suggestions?q=${encodeURIComponent(inputValue)}`;
                    const res = await fetchApi<{ suggestions: string[] }>(url, HttpMethod.GET);
                    if (res.mes === "success" && res.status === 200 && res.data) {
                        setSuggestions(res.data.suggestions || []);
                    } else {
                        setSuggestions([]);
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy gợi ý:", error);
                    setSuggestions([]);
                }
            }, 300); // Debounce 300ms
        } else {
            setSuggestions([]); // Xóa gợi ý nếu input rỗng
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [inputValue, setSuggestions]);

    // Xử lý khi nhấn Enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim()) {
            setSearch(inputValue.trim()); // Cập nhật search khi nhấn Enter
        }
    };

    // Xử lý khi bấm nút tìm kiếm
    const handleSearchClick = () => {
        if (inputValue.trim()) {
            setSearch(inputValue.trim()); // Cập nhật search khi bấm nút tìm kiếm
        }
    };

    return (
        <div className="flex mx-auto w-[70%] items-center relative">
            <Popover.Root
                open={isFocused && suggestions.length > 0 && inputValue.length > 0}
                onOpenChange={(open) => setIsFocused(open)} // Cập nhật isFocused khi Popover mở/đóng
            >
                <Popover.Trigger asChild>
                    <Input
                        type="text"
                        placeholder="Tìm kiếm video ..."
                        value={inputValue}
                        ref={inputRef}
                        onChange={(e) => setInputValue(e.target.value)}
                        onFocus={() => setIsFocused(true)} // Mở Popover khi focus
                        onKeyDown={handleKeyDown} // Xử lý phím Enter
                        className="p-10 mx-auto !text-2xl border border-gray-300 rounded-md"
                    />
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content
                        side="bottom"
                        align="start"
                        className="bg-white border border-gray-300 rounded-md shadow-lg w-[895px]"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        onCloseAutoFocus={(e) => e.preventDefault()}
                        onInteractOutside={() => setIsFocused(false)} // Đóng khi bấm ra ngoài
                    >
                        {suggestions.map((s) => (
                            <div
                                key={s}
                                className="w-full px-4 py-4 text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-150 cursor-pointer rounded-md text-2xl"
                                onClick={() => {
                                    setInputValue(s);
                                    setSearch(s); // Cập nhật ngay khi chọn gợi ý
                                    setIsFocused(false); // Đóng Popover khi chọn gợi ý
                                    inputRef.current?.focus();
                                }}
                            >
                                {s}
                            </div>
                        ))}
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
            <div className="absolute right-[3%]">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke={inputValue ? "#000" : "#A7A7A7"}
                    className="size-10 cursor-pointer"
                    onClick={handleSearchClick}
                    aria-label="Tìm kiếm"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                </svg>
            </div>
        </div>
    );
}

export default Search;