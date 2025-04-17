"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const avatars = [
  { id: 1, src: "/avatar/batman.svg?height=80&width=80", alt: "Blue avatar" },
  { id: 2, src: "/avatar/blackpanther.svg?height=80&width=80", alt: "Panda avatar" },
  { id: 3, src: "/avatar/captain.svg?height=80&width=80", alt: "Moana avatar" },
  { id: 4, src: "/avatar/deadpool.svg?height=80&width=80", alt: "Man avatar" },
  { id: 5, src: "/avatar/harrypotter.svg?height=80&width=80", alt: "Lion avatar" },
  { id: 6, src: "/avatar/ironman.svg?height=80&width=80", alt: "Black Panther avatar" },
  { id: 7, src: "/avatar/mcqueen.svg?height=80&width=80", alt: "Iron Man avatar" },
  { id: 8, src: "/avatar/panda.svg?height=80&width=80", alt: "Woman avatar" },
  { id: 9, src: "/avatar/spiderman.svg?height=80&width=80", alt: "Baby Yoda avatar" },
  { id: 10, src: "/avatar/superman.svg?height=80&width=80", alt: "Cartoon character avatar" },
  { id: 11, src: "/placeholder.svg?height=80&width=80", alt: "Girl avatar" },
  { id: 12, src: "/placeholder.svg?height=80&width=80", alt: "Incredibles avatar" },
  { id: 13, src: "/placeholder.svg?height=80&width=80", alt: "Pink avatar" },
  { id: 14, src: "/placeholder.svg?height=80&width=80", alt: "Captain America avatar" },
  { id: 15, src: "/placeholder.svg?height=80&width=80", alt: "Thor avatar" },
  { id: 16, src: "/placeholder.svg?height=80&width=80", alt: "Hulk avatar" },
  { id: 17, src: "/placeholder.svg?height=80&width=80", alt: "Black Widow avatar" },
  { id: 18, src: "/placeholder.svg?height=80&width=80", alt: "Hawkeye avatar" },
  { id: 19, src: "/placeholder.svg?height=80&width=80", alt: "Spider-Man avatar" },
  { id: 20, src: "/placeholder.svg?height=80&width=80", alt: "Doctor Strange avatar" },
  { id: 21, src: "/placeholder.svg?height=80&width=80", alt: "Scarlet Witch avatar" },
  { id: 22, src: "/placeholder.svg?height=80&width=80", alt: "Vision avatar" },
  { id: 23, src: "/placeholder.svg?height=80&width=80", alt: "Ant-Man avatar" },
  { id: 24, src: "/placeholder.svg?height=80&width=80", alt: "Wasp avatar" },
  { id: 25, src: "/placeholder.svg?height=80&width=80", alt: "Star-Lord avatar" },
  { id: 26, src: "/placeholder.svg?height=80&width=80", alt: "Gamora avatar" },
  { id: 27, src: "/placeholder.svg?height=80&width=80", alt: "Rocket avatar" },
  { id: 28, src: "/placeholder.svg?height=80&width=80", alt: "Groot avatar" },
  { id: 29, src: "/placeholder.svg?height=80&width=80", alt: "Drax avatar" },
  { id: 30, src: "/placeholder.svg?height=80&width=80", alt: "Thanos avatar" },
  { id: 31, src: "/placeholder.svg?height=80&width=80", alt: "Loki avatar" },
]

export default function ProfileEditor() {
  const router = useRouter()
  const [selectedAvatar, setSelectedAvatar] = useState(16)
  const [profileName, setProfileName] = useState("")
  const [userName, setUserName] = useState("")
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedAvatarRef = useRef<HTMLDivElement>(null)

  // Center the selected avatar on initial render
  useEffect(() => {
    if (containerRef.current && selectedAvatarRef.current) {
      // Get the container and selected avatar element
      const container = containerRef.current
      const selectedElement = selectedAvatarRef.current

      // Calculate the center position
      const containerWidth = container.offsetWidth
      const selectedElementLeft = selectedElement.offsetLeft
      const selectedElementWidth = selectedElement.offsetWidth

      // Calculate scroll position to center the selected avatar
      const scrollTo = selectedElementLeft - containerWidth / 2 + selectedElementWidth / 2

      // Apply the scroll position
      container.scrollLeft = Math.max(0, scrollTo)
      setScrollPosition(Math.max(0, scrollTo))
    }
  }, [])

  const handleScroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const container = containerRef.current
      // Increase scroll amount for faster navigation with more avatars
      const scrollAmount = 300
      const newPosition =
        direction === "left" ? Math.max(0, scrollPosition - scrollAmount) : scrollPosition + scrollAmount

      container.scrollTo({
        left: newPosition,
        behavior: "smooth",
      })
      setScrollPosition(newPosition)
    }
  }

  const clearProfileName = () => {
    setProfileName("")
  }

  const clearUserName = () => {
    setUserName("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate inputs
      if (!profileName.trim()) {
        setError("Profile name is required")
        return
      }

      if (!userName.trim()) {
        setError("Username is required")
        return
      }

      // Get selected avatar URL
      const selectedAvatarData = avatars.find(avatar => avatar.id === selectedAvatar)
      const avatarUrl = selectedAvatarData?.src || null

      // Update profile
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profileName,
          username: userName.toLowerCase().replace(/\s+/g, ""),
          image: avatarUrl,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update profile")
      }

      setSuccess(true)
      // Redirect to dashboard after successful update
      setTimeout(() => {
        router.push(`/${userName}`)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-16">Create Profile</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500">
          Profile updated successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
        <div className="relative w-full mb-16">
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-1 hover:bg-black/70 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div
            id="avatar-container"
            ref={containerRef}
            className="flex overflow-x-scroll overflow-y-visible scrollbar-hide space-x-6 py-8 px-8 w-full"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {avatars.map((avatar) => (
              <div
                key={avatar.id}
                className="relative flex-shrink-0"
                onClick={() => setSelectedAvatar(avatar.id)}
                ref={avatar.id === selectedAvatar ? selectedAvatarRef : null}
              >
                <div
                  className={cn(
                    "w-24 h-24 rounded-full overflow-hidden cursor-pointer transition-all duration-200 hover:scale-125",
                    selectedAvatar === avatar.id ? "ring-2 ring-white scale-150 mx-6 p-1 hover:scale-[160%]" : "",
                  )}
                >
                  <Image
                    src={avatar.src || "/placeholder.svg"}
                    alt={avatar.alt}
                    width={80}
                    height={80}
                    className="object-cover rounded-full w-full h-full"
                  />
                </div>
                {selectedAvatar === avatar.id && (
                  <div className="absolute -bottom-1 right-0 bg-white rounded-full p-1">
                    <Check className="h-4 w-4 text-black" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => handleScroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-1 hover:bg-black/70 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col gap-6 mb-6 w-full items-center">
          <div className="w-full max-w-md">
            <label htmlFor="profile-name" className="block text-sm text-gray-400 mb-2">
              Profile Name
            </label>
            <div className="relative">
              <input
                id="profile-name"
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Enter your name"
                required
              />
              {profileName && (
                <button
                  type="button"
                  onClick={clearProfileName}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label="Clear input"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="w-full max-w-md">
            <label htmlFor="user-name" className="block text-sm text-gray-400 mb-2">
              Username (lowercase only)
            </label>
            <div className="relative">
              <input
                id="user-name"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value.toLowerCase())}
                className="w-full bg-transparent border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="choose a username (lowercase)"
                pattern="[a-z0-9]+"
                required
              />
              {userName && (
                <button
                  type="button"
                  onClick={clearUserName}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label="Clear input"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            {userName !== userName.toLowerCase() && (
              <p className="text-red-500 text-sm mt-1">Username must be lowercase only</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full max-w-md py-3 px-6 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </div>
  )
}
