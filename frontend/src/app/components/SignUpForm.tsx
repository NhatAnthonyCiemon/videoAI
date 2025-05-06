"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface SignUpFormProps {
    toggleForm: () => void; // Định nghĩa kiểu cho toggleForm là một hàm
}

const SignUpForm: React.FC<SignUpFormProps> = ({ toggleForm }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="w-full max-w-[90%] md:max-w-[70%] space-y-10 text-base md:text-[17px]">
            <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold">Sign up</h1>
                <p className="text-gray-400">If you already have an account register</p>
                <p>
                    You can{" "}
                    <button
                        onClick={toggleForm} // Sử dụng toggleForm để chuyển về form đăng nhập
                        className="text-fuchsia-500 hover:underline"
                    >
                        Login here!
                    </button>
                </p>
            </div>

            <div className="space-y-6">
                {/* Email input */}
                <InputField
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    iconPath="M2 7l9.5 5.7a1.94 1.94 0 0 0 2.06 0L23 7"
                    outerPath="M2 4h20v16H2z"
                    bgColor="bg-white"  // Nền xám sáng
                    textColor="text-black" // Màu chữ đen
                />

                {/* Username input */}
                <InputField
                    label="Username"
                    id="username"
                    type="text"
                    placeholder="Enter your User name"
                    iconPath="M16 21v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                    bgColor="bg-white"  // Nền xám sáng
                    textColor="text-black" // Màu chữ đen
                />

                {/* Password input */}
                <PasswordInput
                    label="Password"
                    id="password"
                    placeholder="Enter your Password"
                    show={showPassword}
                    toggle={() => setShowPassword((prev) => !prev)}
                    bgColor="bg-white"  // Nền xám sáng
                    textColor="text-black" // Màu chữ đen
                />

                {/* Confirm Password input */}
                <PasswordInput
                    label="Confirm Password"
                    id="confirmPassword"
                    placeholder="Confirm your Password"
                    show={showConfirmPassword}
                    toggle={() => setShowConfirmPassword((prev) => !prev)}
                    bgColor="bg-white"  // Nền xám sáng
                    textColor="text-black" // Màu chữ đen
                />

                {/* Register button */}
                <Button className="w-full py-5 md:py-6 text-lg md:text-xl font-semibold bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full">
                    Register
                </Button>
            </div>
        </div>
    );
};

function InputField({
    label,
    id,
    type,
    placeholder,
    iconPath,
    outerPath = "",
    bgColor = "bg-white", // Nền mặc định là xám sáng
    textColor = "text-black", // Chữ mặc định là màu đen
}: any) {
    return (
        <div className="space-y-2">
            <label htmlFor={id}>{label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                    >
                        {outerPath && <path d={outerPath} />}
                        <path d={iconPath} />
                    </svg>
                </div>
                <Input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    className={`pl-12 py-5 md:py-6 text-sm md:text-[16px] ${bgColor} ${textColor} border-gray-800 focus:border-fuchsia-500`}
                />
            </div>
        </div>
    );
}

function PasswordInput({ label, id, placeholder, show, toggle, bgColor, textColor }: any) {
    return (
        <div className="space-y-2">
            <label htmlFor={id}>{label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                    >
                        <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" />
                        <circle cx="16.5" cy="7.5" r=".5" />
                    </svg>
                </div>
                <Input
                    id={id}
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    className={`pl-12 pr-10 py-5 md:py-6 text-sm md:text-[16px] ${bgColor} ${textColor} border-gray-800 focus:border-fuchsia-500`}
                />
                <button
                    type="button"
                    onClick={toggle}
                    className="absolute inset-y-0 right-3 flex items-center"
                >
                    {show ? (
                        <FaEyeSlash className="h-6 w-6 text-gray-400" />
                    ) : (
                        <FaEye className="h-6 w-6 text-gray-400" />
                    )}
                </button>
            </div>
        </div>
    );
}

export default SignUpForm;
