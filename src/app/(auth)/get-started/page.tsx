import GithubAuthButton from "@/components/auth/github-auth-button";
import GoogleAuthButton from "@/components/auth/google-auth-button";
import { MagicAuthButton } from "@/components/auth/resend-magic-auth-button";
import Image from "next/image";
import { GetStartedRedirect } from "@/components/auth/auth-redirect";
import Link from "next/link";

export default function GetStartedPage() {
    return (
        <>
            <GetStartedRedirect />
            <div className="h-screen flex flex-col gap-10 justify-center items-center bg-gradient-to-b from-blue-600 to-black">
                <div className="absolute w-full h-full left-0 bg-[linear-gradient(to_right,#155dfc2e_1px,transparent_2px),linear-gradient(to_bottom,#155dfc2e_1px,transparent_1px)] bg-[size:40px_40px]"/>

                <div className="pt-10 z-10">
                    <h1 className="text-7xl text-center font-sans font-bold text-white z-10">Login to your account</h1>
                    <p className="text-center mt-6 md:text-lg font-medium font-sans">Get Started. Powering Your Every Click.</p>
                </div>
                <div className="z-10">
                    <div className="bg-black p-8 rounded-2xl w-full max-w-md border border-neutral-900 shadow shadow-neutral-900/10">
                        <Image
                            src="/brand/logo.svg"
                            alt="logo"
                            width={100}
                            height={100}
                            className="mx-auto"
                        />
                        <p className="text-center md:text-lg font-medium font-sans">Welcome to your AI powered code editor.</p>
                        <MagicAuthButton/>
            
                        <p className="text-center text-neutral-600 font-sans my-3">or</p>
                        <div className="flex flex-col gap-4">
                            <GithubAuthButton/>
                            <GoogleAuthButton/>
                        </div>
                    </div>
                    <p className="text-neutral-600 font-sans text-balance max-w-md text-center mt-4 text-sm">By continuing, you agree to our <Link className="underline" href="/terms-and-conditions">Terms and Conditions</Link> and <Link className="underline" href="/privacy-policy">Privacy Policy</Link></p>
                </div>
            </div>
        </>
    );
}