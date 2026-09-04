
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
  Settings,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "firebase/auth"
import Link from "next/link"
import { Card } from "@/components/ui/card"
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
    <div className="min-h-screen bg-black flex flex-col font-body pb-20">
      {/* App Header */}
      <div className="px-6 pt-8 pb-6 flex items-center justify-between bg-card border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-accent/20 shadow-sm">
            <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
            <AvatarFallback className="bg-accent/10 text-accent font-bold">
              {user.displayName?.charAt(0) || <User className="w-5 h-5" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Namaste,</span>
              {isAdmin && <Badge className="h-4 px-1.5 text-[8px] bg-accent text-white border-none font-black">ADMIN</Badge>}
            </div>
            <h1 className="text-base font-black text-white tracking-tight leading-none mt-1">
              {user.displayName?.split(' ')[0] || "Dost"}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="rounded-full bg-accent/5 text-accent relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full text-muted-foreground">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Admin Quick View */}
        {isAdmin && (
          <Card 
            onClick={() => router.push("/site-visits")}
            className="p-6 rounded-[2.5rem] bg-accent text-white border-none shadow-xl shadow-accent/10 flex items-center justify-between cursor-pointer active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
                <ClipboardList className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-black text-lg uppercase leading-none">Visitor Manager</h3>
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-1">Track Daily Measurements</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 opacity-30" />
          </Card>
        )}

        {/* Round Icons Grid */}
        <div className="grid grid-cols-4 gap-y-10 gap-x-4 px-2">
          {mainTools.map((tool) => (
            <button
              key={tool.label}
              onClick={() => router.push(tool.href)}
              className="flex flex-col items-center gap-3 group"
            >
              <div className={`w-14 h-14 rounded-full ${tool.color} flex items-center justify-center shadow-lg border border-white/5 group-active:scale-90 transition-all`}>
                <tool.icon className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tight text-center">
                {tool.label}
              </span>
            </button>
          ))}
        </div>

        {/* Branding Footer */}
        <div className="pt-12 flex flex-col items-center gap-2 opacity-20">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent rounded-lg flex items-center justify-center p-1">
              <span className="text-white text-[10px] font-black">AS</span>
            </div>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white">Aravalli Steel</span>
          </div>
          <p className="text-[8px] font-bold uppercase tracking-widest text-white">Premium Modular Solutions • Since 1998</p>
        </div>
      </div>
    </div>
  )
}
