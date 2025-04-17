import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Check your email",
  description: "We sent you a login link. Be sure to check your spam too.",
}

export default function VerifyRequestPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-muted-foreground">
          We sent you a login link. Be sure to check your spam too.
        </p>
      </div>
    </div>
  )
} 