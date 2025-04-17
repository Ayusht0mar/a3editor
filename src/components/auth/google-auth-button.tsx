"use client"

import Image from "next/image";
import { signIn } from "next-auth/react"

const GoogleAuthButton = () => {
    return ( 
        <button onClick={() => signIn("google")} className="cursor-pointer w-full bg-blue-600/10 border border-blue-600/40 hover:bg-blue-600 text-white rounded-md px-2 py-1 text-center font-medium font-sans flex gap-2 items-center justify-center">
            
             <Image
                src="\icons\google.svg"
                alt="github logo"
                width={14}
                height={14}
            />
            <p>Continue with Google</p>
        </button>
     );
} 
export default GoogleAuthButton;
