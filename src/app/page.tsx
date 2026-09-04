
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
      color: "bg-blue-500"
    },
    {
      title: "Visitors",
      icon: Users,
      href: isAdmin ? "/site-visits" : "/book-consultation",
      color: "bg-green-500"
    },
    {
      title: "Greetings",
      icon: Sparkles,
      href: "/greetings",
      color: "bg-orange-500"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white font-body overflow-x-hidden">
      {/* Header Area */}
      <div className="p-8 pb-4 flex justify-between items-center animate-in fade-in duration-700">
        <h1 className="text-3xl font-black tracking-tighter uppercase text-white">Welcome</h1>
        
        <Link href={isAdmin ? "/notifications" : "/more"}>
          <Button variant="ghost" size="icon" className="rounded-2xl bg-white/5 border border-white/10 relative">
            <Bell className="w-5 h-5 text-white" />
            {isAdmin && <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full border border-black shadow-sm" />}
          </Button>
        </Link>
      </div>

      {/* Horizontal Aadi Line Launchers */}
      <div className="px-8 py-10">
        <div className="flex justify-between items-center gap-4 overflow-x-auto no-scrollbar pb-4">
          {launchers.map((item, idx) => (
            <Link key={idx} href={item.href} className="flex flex-col items-center gap-3 group shrink-0 active:scale-90 transition-all">
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-2xl ${item.color} group-hover:shadow-accent/20`}>
                <item.icon className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Branding Footer */}
      <div className="px-8 mt-auto py-12 opacity-10 text-center">
        <p className="text-[7px] font-black uppercase tracking-[0.4em]">Aravalli Steel Industry</p>
      </div>
    </div>
  )
}
