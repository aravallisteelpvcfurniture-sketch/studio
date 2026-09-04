
"use client"

import * as React from "react"
import { useUser } from "@/firebase"
import { useRouter } from "next/navigation"
import { 
  Bell, 
  Loader2, 
  Calculator, 
  Users, 
  Sparkles,
  ChevronRight
} from "lucide-react"
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

  const launchers = [
    {
      title: "Estimate",
      icon: Calculator,
      href: "/estimator",
      color: "text-blue-400 bg-blue-400/10"
    },
    {
      title: "Visitors",
      icon: Users,
      href: isAdmin ? "/site-visits" : "/book-consultation",
      color: "text-green-400 bg-green-400/10"
    },
    {
      title: "Greetings",
      icon: Sparkles,
      href: "/greetings",
      color: "text-orange-400 bg-orange-400/10"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white font-body">
      {/* Header Area */}
      <div className="p-8 pb-4 flex justify-between items-center animate-in fade-in duration-700">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Welcome</h1>
          <p className="text-[9px] text-accent font-black tracking-[0.2em] uppercase">Aravalli Steel</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href={isAdmin ? "/notifications" : "/more"}>
            <Button variant="ghost" size="icon" className="rounded-2xl bg-white/5 border border-white/10 relative">
              <Bell className="w-5 h-5 text-white" />
              {isAdmin && <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full border border-black shadow-sm" />}
            </Button>
          </Link>
        </div>
      </div>

      {/* Horizontal Launcher Grid */}
      <div className="px-8 py-6 flex justify-between gap-4">
        {launchers.map((item, idx) => (
          <Link key={idx} href={item.href} className="flex-1">
            <div className="flex flex-col items-center gap-3 group">
              <div className={`w-16 h-16 rounded-[1.5rem] border border-white/10 flex items-center justify-center shadow-lg active:scale-90 transition-all ${item.color}`}>
                <item.icon className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/70 group-active:text-accent">
                {item.title}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Status Card for Admin */}
      {isAdmin && (
        <div className="px-8 mt-4">
          <Link href="/notifications">
            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest">Inquiry Updates</h3>
                  <p className="text-[9px] font-bold text-white/40 uppercase">Check latest party requests</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/20" />
            </div>
          </Link>
        </div>
      )}

      {/* Bottom Footer Info */}
      <div className="px-8 mt-12 opacity-20 text-center">
        <div className="w-8 h-1 bg-white/20 mx-auto rounded-full mb-4" />
        <p className="text-[7px] font-black uppercase tracking-[0.3em]">Excellence Since 1998</p>
      </div>
    </div>
  )
}
