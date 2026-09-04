
"use client"

import * as React from "react"
import { useUser } from "@/firebase"
import { useRouter } from "next/navigation"
import { Bell, Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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

  const isAdmin = user.email === "aravallisteelpvcfurniture@gmail.com" || user.uid === "Qmcch2NXxmg47Zf28Wh0KTp9Njt1";

  return (
    <div className="min-h-screen bg-black text-white font-body">
      {/* Header Area */}
      <div className="p-8 flex justify-between items-center animate-in fade-in duration-700">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter uppercase">Welcome</h1>
          <p className="text-[10px] text-accent font-black tracking-[0.2em] uppercase">Aravalli Steel</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href={isAdmin ? "/notifications" : "/more"}>
            <Button variant="ghost" size="icon" className="rounded-2xl bg-white/5 border border-white/10 relative">
              <Bell className="w-6 h-6 text-white" />
              {isAdmin && <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border border-black shadow-sm" />}
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content (Empty for now as requested) */}
      <div className="flex-1 px-8 py-20 flex flex-col items-center justify-center text-center opacity-20">
        <div className="w-24 h-24 border-2 border-dashed border-white/20 rounded-[2.5rem] flex items-center justify-center mb-4">
          <span className="text-[10px] font-black uppercase">Ready for design</span>
        </div>
      </div>
    </div>
  )
}
