"use client";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";

function Search() {
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestions = [
        "React",
        "Next.js",
        "Node.js",
        "Tailwind",
        "Typescript",
    ];

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <div className="flex mx-auto w-[70%] items-center relative">
            <Popover.Root open={search.length > 0}>
                <Popover.Trigger asChild>
                    <Input
                        type="text"
                        placeholder="Tìm kiếm video ..."
                        value={search}
                        ref={inputRef}
                        onChange={(e) => setSearch(e.target.value)}
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
                    >
                        {suggestions.map((s) => (
                            <div
                                key={s}
                                className="w-full px-4 py-4 text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-150 cursor-pointer rounded-md text-2xl"
                                onClick={() => {
                                    setSearch(s);
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
                    stroke={search ? "#000" : "#A7A7A7"}
                    className="size-10 cursor-pointer"
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
