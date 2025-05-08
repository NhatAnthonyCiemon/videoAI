"use client";

import { useState, useEffect  } from "react";
import { useSearchParams } from "next/navigation";
import SignInForm from "../../components/ui/SignInForm";
import SignUpForm from "../../components/ui/SignUpForm";
import Logo from "../../components/ui/Logo";

const SignInPage = () => {
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode");

    const [isSignUp, setIsSignUp] = useState(false); // Trạng thái để thay đổi form hiển thị

    useEffect(() => {
        if (mode === "signup") {
            setIsSignUp(true);
        }
    }, [mode]);

    const toggleForm = () => setIsSignUp(!isSignUp); // Hàm chuyển đổi giữa SignIn và SignUp

    return (
        <div className="w-full h-screen bg-slate-950 flex overflow-hidden">
            <div className="w-full hidden md:flex">
                <Logo />
            </div>

            <div className="bg-black text-white flex items-center justify-center p-6 w-full md:max-w-[50%]">
                {isSignUp ? (
                    <SignUpForm toggleForm={toggleForm} /> // Truyền hàm toggleForm vào SignUpForm
                ) : (
                    <SignInForm toggleForm={toggleForm} /> // Truyền hàm toggleForm vào SignInForm
                )}
            </div>
        </div>
    );
};

export default SignInPage;
