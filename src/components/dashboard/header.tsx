import Image from "next/image";

const Header = () => {
    return (  
        <div className="flex justify-between items-center border border-neutral-800 rounded-lg p-2 gap-4">
            <Image
                src="/brand/logo.svg"
                alt="logo"
                width={32}
                height={32}
            />
        </div>
    );
}
 
export default Header;