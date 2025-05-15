"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import fetchApi from "@/lib/api/fetch";
import HttpMethod from "@/types/httpMethos";

const SignUpForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // State cho lỗi
    const [errorEmail, setErrorEmail] = useState("");
    const [errorUsername, setErrorUsername] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorConfirmPassword, setErrorConfirmPassword] = useState("");

    const router = useRouter();

    // Validate hàm
    function validateEmail(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function validateUsername(username: string) {
        return username.length >= 3;
    }
    function validatePassword(password: string) {
        return password.length >= 6;
    }

    const handleRegister = async () => {
        let valid = true;

        if (!validateEmail(email)) {
            setErrorEmail("Email không hợp lệ.");
            valid = false;
        } else {
            setErrorEmail("");
        }

        if (!validateUsername(username)) {
            setErrorUsername("Username phải có ít nhất 3 ký tự.");
            valid = false;
        } else {
            setErrorUsername("");
        }

        if (!validatePassword(password)) {
            setErrorPassword("Mật khẩu phải có ít nhất 6 ký tự.");
            valid = false;
        } else {
            setErrorPassword("");
        }

        if (password !== confirmPassword) {
            setErrorConfirmPassword("Mật khẩu xác nhận không khớp.");
            valid = false;
        } else {
            setErrorConfirmPassword("");
        }

        if (!valid) return;

        const res = await fetchApi<number>(
            "http://localhost:4000/auth/register",
            HttpMethod.POST,
            {
                email,
                username,
                password,
            }
        );
        if (res.mes !== "success") {
            toast.error("Đăng ký không thành công. Vui lòng thử lại.", {
                duration: 4000,
                position: "top-center",
            });
            return;
        }
        console.log(res);
        toast.success(
            "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.",
            { duration: 4000, position: "top-center" }
        );
    };

    return (
        <div className="w-full max-w-[90%] md:max-w-[70%] space-y-10 text-base md:text-[17px]">
            <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold">Sign up</h1>
                <p className="text-gray-400">
                    If you already have an account register
                </p>
                <p>
                    You can{" "}
                    <button
                        onClick={() => router.push("/signin")}
                        className="text-fuchsia-500 hover:underline cursor-pointer"
                    >
                        Login here!
                    </button>
                </p>
            </div>

            <div className="space-y-6">
                <InputField
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    iconPath="M2 7l9.5 5.7a1.94 1.94 0 0 0 2.06 0L23 7"
                    outerPath="M2 4h20v16H2z"
                    value={email}
                    onChange={(e: any) => {
                        setEmail(e.target.value);
                        setErrorEmail("");
                    }}
                    error={errorEmail}
                />

                <InputField
                    label="Username"
                    id="username"
                    type="text"
                    placeholder="Enter your User name"
                    iconPath="M16 21v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                    value={username}
                    onChange={(e: any) => {
                        setUsername(e.target.value);
                        setErrorUsername("");
                    }}
                    error={errorUsername}
                />

                <PasswordInput
                    label="Password"
                    id="password"
                    placeholder="Enter your Password"
                    show={showPassword}
                    toggle={() => setShowPassword(!showPassword)}
                    value={password}
                    onChange={(e: any) => {
                        setPassword(e.target.value);
                        setErrorPassword("");
                    }}
                    error={errorPassword}
                />

                <PasswordInput
                    label="Confirm Password"
                    id="confirmPassword"
                    placeholder="Confirm your Password"
                    show={showConfirmPassword}
                    toggle={() => setShowConfirmPassword(!showConfirmPassword)}
                    value={confirmPassword}
                    onChange={(e: any) => {
                        setConfirmPassword(e.target.value);
                        setErrorConfirmPassword("");
                    }}
                    error={errorConfirmPassword}
                />

                <Button
                    onClick={handleRegister}
                    className="w-full py-5 md:py-6 text-lg md:text-xl font-semibold bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full"
                >
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
    value,
    onChange,
    error,
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
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`pl-12 py-5 md:py-6 text-sm md:text-[16px] bg-white text-black border-gray-800 focus:border-fuchsia-500 ${
                        error ? "border-red-500" : ""
                    }`}
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

function PasswordInput({
    label,
    id,
    placeholder,
    show,
    toggle,
    value,
    onChange,
    error,
}: any) {
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
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`pl-12 pr-10 py-5 md:py-6 text-sm md:text-[16px] bg-white text-black border-gray-800 focus:border-fuchsia-500 ${
                        error ? "border-red-500" : ""
                    }`}
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
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

export default SignUpForm;
