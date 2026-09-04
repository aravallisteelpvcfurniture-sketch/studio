
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useUser, useAuth } from "@/firebase"
import { 
  Loader2, 
  LogOut, 
  ShoppingBag, 
  LayoutGrid, 
  Sparkles, 
  MapPin, 
  Bell, 
  Calculator, 
  User, 
  ClipboardList, 
  PenTool, 
  MessageSquareHeart,
  Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "firebase/auth"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  const { user, isUserLoading } = useUser()
  const auth = useAuth()
  const router = useRouter()

  const isAdmin = React.useMemo(() => {
    if (!user) return false;
    return user.email === "aravallisteelpvcfurniture@gmail.com" || user.uid === "Qmcch2NXxmg47Zf28Wh0KTp9Njt1";
  }, [user]);

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login")
    }
  }, [user, isUserLoading, router])

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/login";
    }
  }

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    )
  }

  if (!user) return null

  const mainTools = [
    { label: "Greetings", icon: MessageSquareHeart, color: "bg-pink-500/10 text-pink-500", href: "/greetings" },
    { label: "Draw Tool", icon: PenTool, color: "bg-blue-500/10 text-blue-500", href: "/drawing-tool" },
    { label: "AI Ideas", icon: Sparkles, color: "bg-orange-500/10 text-orange-500", href: "/ai-designer" },
    { label: "Estimate", icon: Calculator, color: "bg-green-500/10 text-green-500", href: "/estimator" },
    { label: "Shop", icon: ShoppingBag, color: "bg-purple-500/10 text-purple-500", href: "/shop" },
    { label: "Explore", icon: LayoutGrid, color: "bg-indigo-500/10 text-indigo-500", href: "/categories" },
    { label: "Visit", icon: MapPin, color: "bg-emerald-500/10 text-emerald-500", href: "/book-consultation" },
    { label: "Settings", icon: Settings, color: "bg-slate-500/10 text-slate-400", href: "/settings" },
  ]

  return (
    <div className="min-h-screen bg-black flex flex-col font-body pb-20 selection:bg-accent/30">
      {/* Minimal Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 z-50 bg-black/80 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-white/10">
            <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
            <AvatarFallback className="bg-white/5 text-white text-xs font-black">
              {user.displayName?.charAt(0) || <User className="w-4 h-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h1 className="text-sm font-black text-white uppercase tracking-tighter">
              {user.displayName || "Aravalli User"}
            </h1>
            {isAdmin && <span className="text-[8px] font-black text-accent uppercase tracking-[0.2em]">Administrator</span>}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="rounded-full bg-white/5 text-white relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full"></span>
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full text-white/40">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 px-6 pt-8">
        {/* Simple Round Grid */}
        <div className="grid grid-cols-4 gap-y-10 gap-x-4">
          {mainTools.map((tool) => (
            <button
              key={tool.label}
              onClick={() => router.push(tool.href)}
              className="flex flex-col items-center gap-3 group"
            >
              <div className={`w-14 h-14 rounded-full ${tool.color} flex items-center justify-center border border-white/5 shadow-2xl active:scale-90 transition-all`}>
                <tool.icon className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-black text-white/50 uppercase tracking-tighter text-center">
                {tool.label}
              </span>
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => router.push("/site-visits")}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-14 h-14 rounded-full bg-accent/20 text-accent flex items-center justify-center border border-accent/10 shadow-2xl active:scale-90 transition-all">
                <ClipboardList className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-black text-accent uppercase tracking-tighter text-center">
                Visitors
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-auto py-12 flex flex-col items-center gap-2 opacity-10">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center">
            <span className="text-black text-[8px] font-black">AS</span>
          </div>
          <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white">Aravalli Steel</span>
        </div>
      </div>
    </div>
  )
}
