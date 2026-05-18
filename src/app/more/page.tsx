
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useUser, useAuth } from "@/firebase"
import { signOut } from "firebase/auth"
import { 
  User, 
  LogOut, 
  ShoppingBag, 
  Sparkles, 
  Calculator, 
  LayoutGrid, 
  Calendar, 
  ClipboardList, 
  Bell, 
  ChevronRight, 
  ShieldCheck,
  Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function MorePage() {
  const { user, isUserLoading } = useUser()
  const auth = useAuth()
  const router = useRouter()

  const isAdmin = React.useMemo(() => {
    if (!user) return false;
    return user.email === "aravallisteelpvcfurniture@gmail.com" || user.uid === "Qmcch2NXxmg47Zf28Wh0KTp9Njt1";
  }, [user]);

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

  if (isUserLoading) return null
  if (!user) {
    router.push("/login")
    return null
  }

  const toolItems = [
    { label: "Shop Products", icon: ShoppingBag, href: "/shop", color: "text-orange-500", bg: "bg-orange-50" },
    { label: "AI Design Studio", icon: Sparkles, href: "/ai-designer", color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Budget Estimator", icon: Calculator, href: "/estimator", color: "text-green-500", bg: "bg-green-50" },
    { label: "Categories", icon: LayoutGrid, href: "/categories", color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Book Consultation", icon: Calendar, href: "/book-consultation", color: "text-accent", bg: "bg-accent/5" },
  ]

  const adminItems = [
    { label: "Visitor Manager", icon: ClipboardList, href: "/site-visits", color: "text-accent", bg: "bg-accent/10" },
    { label: "Inquiry Manager", icon: Bell, href: "/notifications", color: "text-blue-600", bg: "bg-blue-50" },
  ]

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-body pb-24">
      <div className="p-6 bg-white border-b sticky top-0 z-50">
        <h1 className="text-xl font-black text-primary uppercase tracking-tight">More & Settings</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Account Profile Section */}
          <Card className="p-6 rounded-[2.5rem] border-none shadow-sm bg-white">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-accent/10">
                <AvatarImage src={user.photoURL || ""} />
                <AvatarFallback className="bg-accent/10 text-accent font-black text-xl">
                  {user.displayName?.charAt(0) || <User />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-primary leading-tight">{user.displayName || "User Account"}</h2>
                  {isAdmin && <Badge className="bg-accent text-white border-none text-[8px] font-black h-4">ADMIN</Badge>}
                </div>
                <p className="text-xs text-muted-foreground font-medium truncate max-w-[180px]">{user.email}</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-3">
              <Button variant="outline" className="rounded-xl h-12 font-bold text-xs gap-2">
                <Settings className="w-4 h-4" /> Profile
              </Button>
              <Button onClick={handleLogout} variant="ghost" className="rounded-xl h-12 font-bold text-xs gap-2 text-destructive hover:bg-destructive/5">
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </div>
          </Card>

          {/* Tools Section */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">All Tools & Services</h3>
            <div className="grid gap-2">
              {toolItems.map((item) => (
                <button 
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className="w-full bg-white p-4 rounded-2xl flex items-center justify-between active:scale-[0.98] transition-all border border-gray-100/50"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <span className="font-bold text-primary text-sm">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                </button>
              ))}
            </div>
          </div>

          {/* Admin Tools Section */}
          {isAdmin && (
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] ml-2">Admin Dashboard</h3>
              <div className="grid gap-2">
                {adminItems.map((item) => (
                  <button 
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className="w-full bg-white p-4 rounded-2xl flex items-center justify-between active:scale-[0.98] transition-all border border-gray-100/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center`}>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <span className="font-bold text-primary text-sm">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Business Info */}
          <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-[10px] font-black">AS</span>
              </div>
              <div>
                <h4 className="text-xs font-black text-primary uppercase">Aravalli Steel</h4>
                <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest leading-none">Since 1998</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[9px] font-bold text-primary/60">
                <ShieldCheck className="w-3 h-3" /> 10 Years Warranty Guaranteed
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
