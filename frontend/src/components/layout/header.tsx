"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/UserProvider";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
    const router = useRouter();
    const { user, setUser } = useUser();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <>
            {/* Placeholder giữ chỗ để tránh nội dung bị đè bởi header fixed */}
            <div className="h-24" />

            <header className="border-b border-gray-300 bg-white text-black fixed top-0 left-0 right-0 z-50 w-full shadow">
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
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="hidden md:inline w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                                fill="none"
                                stroke="#4F46E5"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect
                                    x="2"
                                    y="6"
                                    width="16"
                                    height="12"
                                    rx="2"
                                    ry="2"
                                />
                                <path d="M22 8.5v7L18 12l4-3.5z" />
                            </svg>
                            <span className="flex flex-col md:flex-row leading-tight md:leading-normal font-bold text-indigo-700 text-lg sm:text-xl md:text-3xl lg:text-4xl">
                                <span>AI Short Video Creator</span>
                            </span>
                        </Link>
                    </div>
                    {/* Center: Navigation */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-12 text-lg md:text-2xl">
                        <Link
                            href="#"
                            className="hover:text-fuchsia-600 hover:scale-105 transition-all duration-300 ease-in-out"
                        >
                            Trang chủ
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-fuchsia-600 hover:scale-105 transition-all duration-300 ease-in-out"
                        >
                            Tạo video
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-fuchsia-600 hover:scale-105 transition-all duration-300 ease-in-out"
                        >
                            Video của tôi
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-fuchsia-600 hover:scale-105 transition-all duration-300 ease-in-out"
                        >
                            Hướng dẫn
                        </Link>
                    </nav>

                    <div className="flex items-center gap-10">
                        {user ? (
                            // Nếu đã đăng nhập
                            <div className="flex items-center gap-10">
                                <span className="text-2xl font-semibold text-gray-700">
                                    Xin chào, {user.username || user.email}
                                </span>
                                <Button
                                    onClick={async () => {
                                        await fetch("/api/logout", {
                                            method: "GET",
                                        });
                                        setUser(null);
                                        router.push("/");
                                    }}
                                    size="lg"
                                    className="cursor-pointer text-2xl px-10 py-8 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl font-semibold"
                                >
                                    Đăng xuất
                                </Button>
                            </div>
                        ) : (
                            // Nếu chưa đăng nhập
                            <>
                                <Link
                                    href="/signin"
                                    className="text-2xl text-fuchsia-600 hover:text-fuchsia-700 font-semibold"
                                >
                                    Đăng nhập
                                </Link>
                                <Button
                                    onClick={() => {
                                        router.push("/signup");
                                    }}
                                    size="lg"
                                    className="cursor-pointer text-2xl px-10 py-8 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl font-semibold"
                                >
                                    Đăng ký
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}
