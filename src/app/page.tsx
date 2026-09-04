
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
      subtitle: "Price Calculator",
      icon: Calculator,
      href: "/estimator",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20"
    },
    {
      title: "Visitors",
      subtitle: "Party Manager",
      icon: Users,
      href: isAdmin ? "/site-visits" : "/book-consultation",
      color: "bg-green-500/10 text-green-400 border-green-500/20"
    },
    {
      title: "Greetings",
      subtitle: "Festival Posters",
      icon: Sparkles,
      href: "/greetings",
      color: "bg-orange-500/10 text-orange-400 border-orange-500/20"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white font-body">
      {/* Header Area */}
      <div className="p-8 flex justify-between items-center animate-in fade-in duration-700">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter uppercase">Welcome</h1>
          <p className="text-[10px] text-accent font-black tracking-[0.2em] uppercase">Aravalli Steel Studio</p>
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

      {/* Launcher Grid */}
      <div className="px-8 py-6 grid grid-cols-1 gap-4">
        {launchers.map((item, idx) => (
          <Link key={idx} href={item.href}>
            <div className={`p-6 rounded-[2.5rem] border-2 flex items-center justify-between active:scale-[0.97] transition-all shadow-lg ${item.color}`}>
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center shadow-inner">
                  <item.icon className="w-7 h-7" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black uppercase tracking-tight">{item.title}</span>
                  <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{item.subtitle}</span>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 opacity-30" />
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Footer Info */}
      <div className="px-8 mt-12 opacity-30 text-center">
        <div className="w-12 h-1 bg-white/20 mx-auto rounded-full mb-4" />
        <p className="text-[8px] font-black uppercase tracking-[0.3em]">Excellence Since 1998</p>
      </div>
    </div>
  )
}
