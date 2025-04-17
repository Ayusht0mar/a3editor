"use client"

import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { redirect } from 'next/navigation'



export function GetStartedRedirect() {
    const router = useRouter()
    const { data: session, status } = useSession()

    useEffect(() => {
        if (status === "authenticated") {
            if (!session?.user?.username) {
                redirect("/onboard")
            } else {
                redirect(`/${session.user.username}`)
            }
        }
    }, [status, session, router])

    if (status === "loading") {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        )
    }

    return null
} 

export function DashboardRedirect() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const username = useParams()

    useEffect(() => {

        

        if (status === "unauthenticated") {
            redirect("/get-started")
        }

        if (status === "authenticated" && session?.user?.username !== username.username) {
            redirect(`/${session.user.username}`)
        }
    }, [status, router, username, session])

    return null
}

