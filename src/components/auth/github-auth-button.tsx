"use client"

import Image from "next/image";
import { signIn } from "next-auth/react"

export default function GithubAuthButton() {
    return ( 
        <button onClick={() => signIn("github", { redirectTo: "/onboard" })} className="cursor-pointer w-full bg-blue-600/10 border-blue-600/40 border hover:bg-blue-600 text-white rounded-md px-2 py-1 text-center font-medium font-sans flex justify-center items-center gap-2">
            <Image
                src="\icons\github.svg"
                alt="github logo"
                width={16}
                height={16}
            />
            Continue with Github
        </button>
     );
}
 
