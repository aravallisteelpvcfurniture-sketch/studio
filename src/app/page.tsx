
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
      subtitle: "Calculations",
      icon: Calculator,
      href: "/estimator",
      color: "bg-blue-500"
    },
    {
      title: "Visitors",
      subtitle: "Management",
      icon: Users,
      href: isAdmin ? "/site-visits" : "/book-consultation",
      color: "bg-green-500"
    },
    {
      title: "Greetings",
      subtitle: "Festival Post",
      icon: Sparkles,
      href: "/greetings",
      color: "bg-orange-500"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white font-body">
      {/* Header Area */}
      <div className="p-8 pb-4 flex justify-between items-center animate-in fade-in duration-700">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter uppercase text-white">Welcome</h1>
          <p className="text-[9px] text-accent font-black tracking-[0.2em] uppercase">Aravalli Steel</p>
        </div>
        
        <Link href={isAdmin ? "/notifications" : "/more"}>
          <Button variant="ghost" size="icon" className="rounded-2xl bg-white/5 border border-white/10 relative">
            <Bell className="w-5 h-5 text-white" />
            {isAdmin && <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full border border-black shadow-sm" />}
          </Button>
        </Link>
      </div>

      {/* Ribbon Style Launchers */}
      <div className="px-8 py-8 space-y-4">
        {launchers.map((item, idx) => (
          <Link key={idx} href={item.href} className="block group active:scale-95 transition-all">
            <div className="flex items-center bg-white rounded-full p-1.5 pr-8 shadow-2xl relative overflow-hidden">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="ml-4 flex flex-col justify-center">
                <span className="text-sm font-black text-black uppercase leading-tight tracking-tight">
                  {item.title}
                </span>
                <span className="text-[8px] text-black/40 font-bold uppercase tracking-widest">
                  {item.subtitle}
                </span>
              </div>
              <ChevronRight className="ml-auto w-4 h-4 text-black/20" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Status for Admin */}
      {isAdmin && (
        <div className="px-8 mt-4">
          <Link href="/notifications">
            <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] flex items-center justify-between active:scale-[0.98] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Bell className="w-4 h-4 text-accent" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Recent Alerts</span>
              </div>
              <span className="text-[10px] font-black text-accent uppercase">View All</span>
            </div>
          </Link>
        </div>
      )}

      {/* Branding Footer */}
      <div className="px-8 mt-12 opacity-10 text-center">
        <p className="text-[7px] font-black uppercase tracking-[0.4em]">Excellence Since 1998</p>
      </div>
    </div>
  )
}
