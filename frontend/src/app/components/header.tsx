"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
    return (
        <header className="border-b bg-white text-black">
            <div className="w-full max-w-screen-lg xl:max-w-[70%] mx-auto px-4 py-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="6" width="16" height="12" rx="2" ry="2"></rect>
                            <path d="M22 8.5v7L18 12l4-3.5z"></path>
                        </svg>

                        <span className="font-bold text-indigo-700 text-3xl md:text-4xl">AI Short Video Creator</span>
                    </Link>
                </div>
                <nav className="hidden md:flex items-center gap-12 text-xl">
                    <Link href="#" className="text-3xl hover:text-fuchsia-600 hover:scale-110 transition-all duration-300 ease-in-out">Trang chủ</Link>
                    <Link href="#" className="text-3xl hover:text-fuchsia-600 hover:scale-110 transition-all duration-300 ease-in-out">Tạo video</Link>
                    <Link href="#" className="text-3xl hover:text-fuchsia-600 hover:scale-110 transition-all duration-300 ease-in-out">Video của tôi</Link>
                    <Link href="#" className="text-3xl hover:text-fuchsia-600 hover:scale-110 transition-all duration-300 ease-in-out">Hướng dẫn</Link>
                </nav>

                <div className="flex items-center gap-10">
                    {/* Đăng nhập */}
                    <Link href="#" className="text-2xl text-fuchsia-600 hover:text-fuchsia-700 font-semibold">Đăng nhập</Link>

                    {/* Đăng ký */}
                    <Button size="lg" className="text-2xl px-10 py-8 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl font-semibold">
                        Đăng ký
                    </Button>
                </div>
            </div>
        </header>
    );
}
