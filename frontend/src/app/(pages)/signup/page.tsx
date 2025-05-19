import SignUpForm from "@/components/ui/SignUpForm";
import Logo from "@/components/ui/Logo";

const SignUpPage = () => {
    return (
        <div className="w-full h-screen bg-slate-950 flex overflow-hidden">
            <div className="w-full hidden md:flex">
                <Logo />
            </div>

            <div className="bg-black text-white flex items-center justify-center p-6 w-full md:max-w-[45%]">
                <SignUpForm />
            </div>
        </div>
    );
};

export default SignUpPage;
