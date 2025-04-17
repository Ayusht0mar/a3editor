import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Authentication Error",
  description: "Something went wrong during authentication",
}

export default function AuthErrorPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Authentication Error</h1>
        <p className="text-muted-foreground">
          There was an error during authentication. Please try again.
        </p>
      </div>
      <Link
        href="/get-started"
        className="text-sm text-blue-500 hover:underline"
      >
        Return to login
      </Link>
    </div>
  )
} 