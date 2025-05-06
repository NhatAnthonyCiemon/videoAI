"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FaEye, FaEyeSlash, FaFacebookF, FaApple, FaGoogle } from "react-icons/fa";

interface SignInFormProps {
    toggleForm: () => void; // Hàm chuyển đổi form giữa đăng nhập và đăng ký
}

const SignInForm: React.FC<SignInFormProps> = ({ toggleForm }) => {
    return (
        <div className="w-full max-w-[90%] md:max-w-[70%] space-y-10 text-base md:text-[17px]">
            <div className="space-y-3">
                <h1 className="text-5xl font-bold">Sign in</h1>
                <p className="text-gray-400">If you don't have an account register</p>
                <p>
                    You can{" "}
                    <button
                        onClick={toggleForm} // Sử dụng toggleForm để chuyển sang form đăng ký
                        className="text-fuchsia-500 hover:underline"
                    >
                        Register here!
                    </button>
                </p>
            </div>

            <div className="space-y-8">
                {/* Email input */}
                <div className="space-y-3">
                    <label htmlFor="email">Email</label>
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
                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                        </div>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            className="pl-12 py-5 md:py-6 text-sm md:text-[16px] bg-gray-900 border-gray-800 focus:border-fuchsia-500"
                        />
                    </div>
                </div>

                {/* Password input */}
                <PasswordInput />

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            className="border-gray-600 data-[state=checked]:bg-fuchsia-500 data-[state=checked]:border-fuchsia-500"
                        />
                        <label htmlFor="remember" className="text-gray-300">
                            Remember me
                        </label>
                    </div>
                    <Link href="/forgot-password" className="text-gray-300 hover:text-fuchsia-500">
                        Forgot Password?
                    </Link>
                </div>

                {/* Login button */}
                <Button className="w-full py-5 md:py-6 text-lg md:text-xl font-semibold bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full">
                    Login
                </Button>

                {/* Social login */}
                <div className="text-center space-y-4">
                    <p className="text-gray-400">or continue with</p>
                    <div className="flex justify-center space-x-4">
                        <SocialButton icon="facebook" />
                        <SocialButton icon="apple" />
                        <SocialButton icon="google" />
                    </div>
                </div>
            </div>
        </div>
    );
};

function PasswordInput() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-2">
            <label htmlFor="password">Password</label>
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
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    className="pl-12 pr-10 py-5 md:py-6 text-sm md:text-[16px] bg-gray-900 border-gray-800 focus:border-fuchsia-500"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center"
                >
                    {showPassword ? (
                        <FaEyeSlash className="h-6 w-6 text-gray-400" />
                    ) : (
                        <FaEye className="h-6 w-6 text-gray-400" />
                    )}
                </button>
            </div>
        </div>
    );
}

function SocialButton({ icon }: { icon: "facebook" | "apple" | "google" }) {
    const icons = {
        facebook: <FaFacebookF className="text-[#1877F2] w-8 h-8" />,
        apple: <FaApple className="text-white w-8 h-8" />,
        google: <FaGoogle className="text-[#DB4437] w-8 h-8" />,
    };

    return (
        <button className="w-15 h-15 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
            {icons[icon]}
        </button>
    );
}

export default SignInForm;
