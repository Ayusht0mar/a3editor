import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { auth } from "@/lib/auth";
import Image from "next/image";
import { SignOutButton } from "../auth/signout-button";

  
const UserProfileMenu = async () => {

    const session = await auth()

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full">
                    <Image
                        src={session?.user?.image || "/placeholder.svg"}
                        alt="Avatar"
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-neutral-950 mr-2 mt-2 border-neutral-700 text-neutral-400 p-2 min-w-[200px]">
                        <p className="text-neutral-200">{session?.user?.username}</p>
                        <p className="text-sm">{session?.user?.email}</p>
                        <DropdownMenuSeparator  className="my-2 bg-neutral-800"/>
                        <SignOutButton/>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      );
}
 
export default UserProfileMenu;