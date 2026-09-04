
"use client"

import * as React from "react"
import { useUser } from "@/firebase"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { user, isUserLoading } = useUser()
  const router = useRouter()

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login")
    }
  }, [user, isUserLoading, router])

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-black">
      {/* Dashboard is now empty and ready for your new design description */}
    </div>
  )
}
