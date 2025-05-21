import SignInForm from "@/components/ui/SignInForm";
import Logo from "@/components/ui/Logo";

const SignInPage = () => {
    return (
        <div className="w-full h-screen bg-slate-950 flex overflow-hidden">
            <div className="w-full hidden md:flex">
                <Logo />
            </div>

            <div className="bg-black text-white flex items-center justify-center p-6 w-full md:max-w-[45%]">
                <SignInForm />
            </div>
        </div>
    );
};

export default SignInPage;
