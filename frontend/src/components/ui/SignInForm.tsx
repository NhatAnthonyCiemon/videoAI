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

function showErrorToast(message: string) {
    toast.error(message, {
        duration: 4000,
        position: "top-center",
    });
}
function showSuccessToast(message: string) {
    toast.success(message, {
        duration: 3000,
        position: "top-center",
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
                    <label htmlFor="email">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center">
                            {/* ...icon... */}
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
                            className={`pl-12 py-5 md:py-6 text-sm md:text-[16px] bg-gray-900 border-gray-800 focus:border-fuchsia-500 ${
                                emailError ? "border-red-500" : ""
                            }`}
                        />
                    </div>
                    {emailError && (
                        <p className="text-red-500 text-sm mt-1">
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
                            className="cursor-pointer border-gray-600 data-[state=checked]:bg-fuchsia-500 data-[state=checked]:border-fuchsia-500"
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
                    className="cursor-pointer w-full py-5 md:py-6 text-lg md:text-xl font-semibold bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full"
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

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-[90vw] max-w-md relative">
                        <button
                            className="absolute top-2 right-3 text-xl text-gray-400 hover:text-gray-700"
                            onClick={() => {
                                setShowForgotModal(false);
                                setForgotEmail("");
                                setForgotError("");
                            }}
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-center">
                            Quên mật khẩu
                        </h2>
                        <p className="mb-2 text-gray-600 text-center">
                            Nhập email để nhận link đặt lại mật khẩu
                        </p>
                        <Input
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => {
                                setForgotEmail(e.target.value);
                                setForgotError("");
                            }}
                            placeholder="Nhập email của bạn"
                            className={`mt-2 text-black ${
                                forgotError ? "border-red-500" : ""
                            }`}
                        />
                        {forgotError && (
                            <p className="text-red-500 text-sm mt-1">
                                {forgotError}
                            </p>
                        )}
                        <Button
                            className="w-full mt-4 bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
                            onClick={handleForgotSubmit}
                        >
                            Gửi yêu cầu
                        </Button>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-[90vw] max-w-md text-center relative">
                        <button
                            className="absolute top-2 right-3 text-xl text-gray-400 hover:text-gray-700"
                            onClick={() => setShowSuccessModal(false)}
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-bold mb-4">
                            Đã gửi email!
                        </h2>
                        <p className="text-gray-600">
                            Vui lòng kiểm tra email để đặt lại mật khẩu.
                        </p>
                        <Button
                            className="mt-6 bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
                            onClick={() => setShowSuccessModal(false)}
                        >
                            Đóng
                        </Button>
                    </div>
                </div>
            )}
            {showFailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-[90vw] max-w-md text-center relative">
                        <button
                            className="absolute top-2 right-3 text-xl text-gray-400 hover:text-gray-700"
                            onClick={() => setShowFailModal(false)}
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-red-600">
                            Gửi thất bại!
                        </h2>
                        <p className="text-gray-600">
                            Có lỗi xảy ra hoặc email không tồn tại. Vui lòng thử
                            lại.
                        </p>
                        <Button
                            className="mt-6 bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
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
            <label htmlFor="password">Password</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center">
                    {/* ...icon... */}
                </div>
                <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    className={`pl-12 pr-10 py-5 md:py-6 text-sm md:text-[16px] bg-gray-900 border-gray-800 focus:border-fuchsia-500 ${
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
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

export default SignInForm;
