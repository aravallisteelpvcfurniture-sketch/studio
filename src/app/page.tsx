
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      {/* Dashboard saaf kar diya hai. Ab aap naya design bataiye. */}
      <div className="opacity-20 animate-pulse">
        <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Ready for new design</p>
      </div>
    </div>
  )
}
