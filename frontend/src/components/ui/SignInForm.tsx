"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import fetchApi from "@/lib/api/fetch";
import HttpMethod from "@/types/httpMethos";
import { setToken, getToken } from "@/lib/Token";
import User from "@/types/User";
import { jwtDecode } from "jwt-decode";
import { useUser } from "@/app/UserProvider";
import { FaEye, FaEyeSlash, FaGoogle, FaGithub } from "react-icons/fa";

import "@/app/signin_style.css";

function showErrorToast(message: string) {
    toast.error(message, {
        duration: 4000,
        position: "bottom-right",
    });
}
function showSuccessToast(message: string) {
    toast.success(message, {
        duration: 3000,
        position: "bottom-right",
    });
}

// Hàm validate
function validateEmail(email: string) {
    // Regex đơn giản cho email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password: string) {
    // Ví dụ: ít nhất 6 ký tự
    return password.length >= 6;
}

const SignInForm = () => {
    const router = useRouter();
    const { setUser } = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);

    // State cho lỗi
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Forgot password modal state
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotError, setForgotError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailModal, setShowFailModal] = useState(false);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== "http://localhost:3000") return;

            const { token } = event.data;
            if (token) {
                fetchApi<{ token: string; user: User }>(
                    "/api/signin",
                    HttpMethod.POST,
                    {
                        token: token,
                        user: jwtDecode<User>(token),
                        remember: true,
                    }
                ).then((res) => {
                    if (res.status === 200) {
                        showSuccessToast("Đăng nhập thành công");
                        setToken(res.data!!.token);
                        setUser(res.data!!.user);
                        router.push("/");
                    } else {
                        if (res.mes === "Email not verified") {
                            showErrorToast("Email chưa được xác thực");
                            setEmailError("Email chưa được xác thực");
                        } else showErrorToast("Đăng nhập thất bại");
                    }
                });
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    const handleSubmitLogin = async () => {
        let valid = true;

        // Validate email
        if (!validateEmail(email)) {
            setEmailError("Email không hợp lệ.");
            valid = false;
        } else {
            setEmailError("");
        }

        // Validate password
        if (!validatePassword(password)) {
            setPasswordError("Mật khẩu phải có ít nhất 6 ký tự.");
            valid = false;
        } else {
            setPasswordError("");
        }

        if (!valid) return;

        fetchApi<{ token: string; user: User }>(
            "http://localhost:4000/auth/login",
            HttpMethod.POST,
            {
                email,
                password,
            }
        ).then((res) => {
            if (res.mes === "success") {
                fetchApi<{ token: string; user: User }>(
                    "/api/signin",
                    HttpMethod.POST,
                    {
                        token: res.data!!.token,
                        user: res.data!!.user,
                        remember,
                    }
                ).then((res) => {
                    if (res.status === 200) {
                        showSuccessToast("Đăng nhập thành công");
                        setToken(res.data!!.token);
                        setUser(res.data!!.user);
                        router.push("/");
                    } else {
                        showErrorToast("Đăng nhập thất bại");
                    }
                });
            } else {
                showErrorToast("Đăng nhập thất bại ");
                setEmailError("Email hoặc mật khẩu không đúng.");
                setPasswordError("Email hoặc mật khẩu không đúng.");
            }
        });
    };

    const handleGoogleLogin = () => {
        window.open(
            "http://localhost:4000/auth/google",
            "_blank",
            "width=500,height=600"
        );
    };

    const handleGithubLogin = () => {
        window.open(
            "http://localhost:4000/auth/github",
            "_blank",
            "width=500,height=600"
        );
    };

    // Forgot password submit
    const handleForgotSubmit = async () => {
        if (!validateEmail(forgotEmail)) {
            setForgotError("Email không hợp lệ.");
            return;
        }

        const res = await fetchApi<string>(
            "http://localhost:4000/auth/sendreset",
            HttpMethod.POST,
            {
                email: forgotEmail,
            }
        );
        if (res.status === 200) {
            showSuccessToast("Email sent successfully");
            setShowForgotModal(false);
            setShowSuccessModal(true);
            setForgotEmail("");
            setForgotError("");
        } else {
            showErrorToast("Failed to send email");
            setShowForgotModal(false);
            setShowFailModal(true);
            setForgotEmail("");
            setForgotError("");
        }
    };

    return (
        <div className="w-full max-w-[90%] md:max-w-[70%] space-y-10 text-base md:text-[17px]">
            <div className="space-y-3">
                <h1 className="text-5xl font-bold">Sign in</h1>
                <p className="text-gray-400">
                    If you don't have an account register
                </p>
                <p>
                    You can{" "}
                    <button
                        onClick={() => {
                            router.push("/signup");
                        }}
                        className="text-fuchsia-500 hover:underline cursor-pointer"
                    >
                        Register here!
                    </button>
                </p>
            </div>

            <div className="space-y-8">
                {/* Email input */}
                <div className="space-y-3">
                    <label htmlFor="email" className="text-white">
                        Email
                    </label>
                    <div className="relative py-1">
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
                                <rect
                                    width="20"
                                    height="16"
                                    x="2"
                                    y="4"
                                    rx="2"
                                />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                        </div>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError("");
                            }}
                            placeholder="Enter your email address"
                            className={`custom-input pl-12 pr-10 py-5 md:py-6 text-xl md:text-[16px] text-white ${
                                emailError ? "border-red-500" : ""
                            }`}
                        />
                    </div>
                    {emailError && (
                        <p className="text-red-500 text-xl mt-1">
                            {emailError}
                        </p>
                    )}
                </div>

                {/* Password input */}
                <PasswordInput
                    password={password}
                    setPassword={setPassword}
                    error={passwordError}
                    setError={setPasswordError}
                />

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            checked={remember}
                            onClick={() => setRemember(!remember)}
                            className="w-5 h-5 bg-white border-2 border-gray-600 rounded-sm 
                                    data-[state=checked]:bg-fuchsia-500 
                                    data-[state=checked]:border-fuchsia-500 
                                    cursor-pointer"
                        />
                        <label
                            htmlFor="remember"
                            className="cursor-pointer text-gray-300"
                        >
                            Remember me
                        </label>
                    </div>
                    <Link
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowForgotModal(true);
                        }}
                        className="text-gray-300 hover:text-fuchsia-500"
                    >
                        Forgot Password?
                    </Link>
                </div>

                {/* Login button */}
                <Button
                    onClick={handleSubmitLogin}
                    className="cursor-pointer w-full py-5 md:py-7 text-lg md:text-2xl font-semibold bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full"
                >
                    Login
                </Button>

                {/* Social login */}
                <div className="text-center space-y-4">
                    <p className="text-gray-400">or continue with</p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={handleGoogleLogin}
                            className="cursor-pointer w-15 h-15 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                        >
                            <FaGoogle className="text-[#DB4437] w-8 h-8" />
                        </button>
                        <button
                            onClick={handleGithubLogin}
                            className="cursor-pointer w-15 h-15 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                        >
                            <FaGithub className="text-[#179c46] w-8 h-8" />
                        </button>
                    </div>
                </div>
            </div>

            {showForgotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-gray-900 rounded-xl shadow-2xl p-10 w-full max-w-[40%] md:max-w-[40%] transform transition-all duration-300 scale-100 hover:scale-[1.02]">
                        <button
                            className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-fuchsia-500 transition-colors duration-200"
                            onClick={() => {
                                setShowForgotModal(false);
                                setForgotEmail("");
                                setForgotError("");
                            }}
                        >
                            ×
                        </button>
                        <h2 className="text-5xl font-bold mb-6 text-center text-white">
                            Quên mật khẩu
                        </h2>
                        <p className="mb-6 text-gray-300 text-center text-base md:text-[17px]">
                            Nhập email để nhận link đặt lại mật khẩu
                        </p>
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
                                    <rect
                                        width="20"
                                        height="16"
                                        x="2"
                                        y="4"
                                        rx="2"
                                    />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                            </div>
                            <Input
                                type="email"
                                value={forgotEmail}
                                onChange={(e) => {
                                    setForgotEmail(e.target.value);
                                    setForgotError("");
                                }}
                                placeholder="Nhập email của bạn"
                                className={`custom-input pl-12 pr-10 py-5 md:py-6 text-xl md:text-[16px] text-white bg-gray-800 border-0 border-b-2 border-gray-600 focus:border-fuchsia-500 placeholder-gray-400 transition-all duration-200 ${
                                    forgotError ? "border-red-500" : ""
                                }`}
                            />
                        </div>
                        {forgotError && (
                            <p className="text-red-500 text-xl mt-3">
                                {forgotError}
                            </p>
                        )}
                        <Button
                            className="w-full mt-8 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full py-5 md:py-7 text-lg md:text-2xl font-semibold transition-all duration-200 transform hover:scale-105"
                            onClick={handleForgotSubmit}
                        >
                            Gửi yêu cầu
                        </Button>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-gray-900 rounded-xl shadow-2xl p-10 w-full max-w-[40%] md:max-w-[40%] text-center relative transform transition-all duration-300 scale-100 hover:scale-[1.02]">
                        <button
                            className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-fuchsia-500 transition-colors duration-200"
                            onClick={() => setShowSuccessModal(false)}
                        >
                            ×
                        </button>
                        <div className="flex justify-center mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-green-500"
                            >
                                <path d="M20 6 9 17l-5-5" />
                                <circle cx="12" cy="12" r="10" />
                            </svg>
                        </div>
                        <h2 className="text-5xl font-bold mb-6 text-white">
                            Đã gửi email!
                        </h2>
                        <p className="text-gray-300 text-base md:text-[17px] mb-8">
                            Vui lòng kiểm tra email để đặt lại mật khẩu.
                        </p>
                        <Button
                            className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full py-5 md:py-7 text-lg md:text-2xl font-semibold transition-all duration-200 transform hover:scale-105"
                            onClick={() => setShowSuccessModal(false)}
                        >
                            Đóng
                        </Button>
                    </div>
                </div>
            )}

            {/* Fail Modal */}
            {showFailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-gray-900 rounded-xl shadow-2xl p-10 w-full max-w-[40%] md:max-w-[40%] text-center relative transform transition-all duration-300 scale-100 hover:scale-[1.02]">
                        <button
                            className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-fuchsia-500 transition-colors duration-200"
                            onClick={() => setShowFailModal(false)}
                        >
                            ×
                        </button>
                        <div className="flex justify-center mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-red-500"
                            >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                                <circle cx="12" cy="12" r="10" />
                            </svg>
                        </div>
                        <h2 className="text-5xl font-bold mb-6 text-red-500">
                            Gửi thất bại!
                        </h2>
                        <p className="text-gray-300 text-base md:text-[17px] mb-8">
                            Có lỗi xảy ra hoặc email không tồn tại. Vui lòng thử
                            lại.
                        </p>
                        <Button
                            className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full py-5 md:py-7 text-lg md:text-2xl font-semibold transition-all duration-200 transform hover:scale-105"
                            onClick={() => setShowFailModal(false)}
                        >
                            Đóng
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

function PasswordInput({
    password,
    setPassword,
    error,
    setError,
}: {
    password: string;
    setPassword: (password: string) => void;
    error?: string;
    setError: (error: string) => void;
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-2">
            <label htmlFor="password" className="text-white">
                Password
            </label>
            <div className="relative py-1">
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
                    className={`custom-input pl-12 pr-10 py-5 md:py-6 text-xl md:text-[16px] text-white ${
                        error ? "border-red-500" : ""
                    }`}
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) {
                            setError("");
                        }
                    }}
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
            {error && <p className="text-red-500 text-xl mt-1">{error}</p>}
        </div>
    );
}

export default SignInForm;
