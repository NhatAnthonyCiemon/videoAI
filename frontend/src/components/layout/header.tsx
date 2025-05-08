"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <header className="border-b-[1px] border-gray-300 bg-white text-black fixed top-0 left-0 right-0 z-50 w-full">
            <div className="w-full mx-auto px-4 sm:px-20 py-4 flex items-center justify-between gap-y-4">
                {/* Left: Sidebar toggle + Logo */}
                <div className="flex items-center gap-3">
                    {/* Sidebar Toggle Button */}
                    <button
                        className="md:hidden text-indigo-700"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="hidden md:inline w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#4F46E5"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="2" y="6" width="16" height="12" rx="2" ry="2"></rect>
                            <path d="M22 8.5v7L18 12l4-3.5z"></path>
                        </svg>
                        <span className="flex flex-col md:flex-row leading-tight md:leading-normal font-bold text-indigo-700 text-lg sm:text-xl md:text-3xl lg:text-4xl">
                            <span>AI Short Video Creator</span>
                        </span>
                    </Link>
                </div>

                {/* Center: Navigation */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-12 text-base md:text-xl">
                    <Link href="#" className="hover:text-fuchsia-600 hover:scale-105 transition-all duration-300 ease-in-out">
                        Trang chủ
                    </Link>
                    <Link href="#" className="hover:text-fuchsia-600 hover:scale-105 transition-all duration-300 ease-in-out">
                        Tạo video
                    </Link>
                    <Link href="#" className="hover:text-fuchsia-600 hover:scale-105 transition-all duration-300 ease-in-out">
                        Video của tôi
                    </Link>
                    <Link href="#" className="hover:text-fuchsia-600 hover:scale-105 transition-all duration-300 ease-in-out">
                        Hướng dẫn
                    </Link>
                </nav>

                {/* Right: Login/Register */}
                <div className="flex items-center justify-center px-4">
                    <div className="flex flex-row items-center gap-4 sm:gap-6 w-full max-w-md">
                        {/* Nút Đăng nhập */}
                        <Link href="/SignIn" className="flex-1">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full text-base sm:text-lg md:text-xl px-8 py-4 sm:py-5 border-2 border-fuchsia-600 text-fuchsia-600 hover:bg-fuchsia-50 hover:text-fuchsia-700 rounded-2xl font-semibold transition-all duration-200"
                            >
                                Đăng nhập
                            </Button>
                        </Link>

                        {/* Nút Đăng ký */}
                        <Link href="/SignIn?mode=signup" className="flex-1">
                            <Button
                                size="lg"
                                className="w-full text-base sm:text-lg md:text-xl px-8 py-4 sm:py-5 bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-700 hover:to-pink-600 text-white rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                Đăng ký
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black opacity-50 z-40 transition-opacity duration-300 ${isSidebarOpen ? "block" : "hidden"
                    }`}
                onClick={closeSidebar}
            ></div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 md:hidden rounded-r-3xl transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex justify-center items-center p-4">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="flex flex-col text-indigo-700 text-lg font-bold">
                            <span>AI Short</span>
                            <span>Video Creator</span>
                        </span>
                    </Link>
                </div>
                <nav className="flex flex-col items-start p-4 space-y-4">
                    <Link href="#" className="text-xl text-indigo-700 hover:text-fuchsia-600">
                        Trang chủ
                    </Link>
                    <Link href="#" className="text-xl text-indigo-700 hover:text-fuchsia-600">
                        Tạo video
                    </Link>
                    <Link href="#" className="text-xl text-indigo-700 hover:text-fuchsia-600">
                        Video của tôi
                    </Link>
                    <Link href="#" className="text-xl text-indigo-700 hover:text-fuchsia-600">
                        Hướng dẫn
                    </Link>
                </nav>
            </div>
        </header>
    );
}
