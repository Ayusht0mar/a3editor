import { signIn } from "@/lib/auth"
 
export function MagicAuthButton() {
  return (
    <form
      action={async (formData) => {
        "use server"
        await signIn("resend", formData)
      }}
      className="flex flex-col gap-2 items-center justify-center"
    >
      <input type="text" name="email" placeholder="Enter your email" className="cursor-pointer w-full bg-blue-600/10 border border-blue-600/40 focus:outline focus:border-2 focus:border-blue-600/55 text-white rounded-md px-2 py-1 text-center font-medium font-sans flex gap-2 items-center justify-center mt-8"/>
      <button type="submit" className="cursor-pointer w-full bg-blue-600/10 border border-blue-600/40 hover:bg-blue-600 text-white rounded-md px-2 py-1 text-center font-medium font-sans flex gap-2 items-center justify-center">Continue with email</button>
    </form>
  )
}