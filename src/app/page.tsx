
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useUser, useAuth } from "@/firebase"
import { Loader2, LogOut, ShoppingBag, LayoutGrid, Sparkles, MapPin, Bell, Download, Calculator, ChevronRight, User, ClipboardList } from "lucide-react"
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
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null)

  const isAdmin = React.useMemo(() => {
    if (!user) return false;
    return user.email === "aravallisteelpvcfurniture@gmail.com" || user.uid === "Qmcch2NXxmg47Zf28Wh0KTp9Njt1";
  }, [user]);

  React.useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login")
    }
  }, [user, isUserLoading, router])

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
        // Force redirect to login page and clear state
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/login";
    }
  }

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-body pb-10">
      {/* App Header */}
      <div className="px-6 pt-8 pb-4 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-accent/20">
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
            <h1 className="text-sm font-black text-primary tracking-tight leading-none truncate max-w-[120px] mt-1">
              {user.displayName?.split(' ')[0] || "Dost"}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="rounded-full bg-accent/5 text-accent relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full text-muted-foreground active:scale-90 transition-all">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content Scroll Area */}
      <div className="flex-1 space-y-4 pt-6">
        {/* Hero Section: AI Design Studio */}
        <div className="px-6">
          <Card 
            onClick={() => router.push("/ai-designer")}
            className="group relative overflow-hidden p-6 rounded-[2.5rem] border-none bg-primary text-white shadow-2xl shadow-primary/20 active:scale-[0.97] transition-all cursor-pointer h-48 flex flex-col justify-end"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 rounded-full blur-[60px] -mr-20 -mt-20" />
            <div className="relative z-10 space-y-1">
              <div className="inline-flex items-center gap-2 bg-accent px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-1">
                <Sparkles className="w-3 h-3 text-white" /> AI Powered Studio
              </div>
              <h3 className="text-2xl font-black tracking-tighter leading-none uppercase">AI Design Ideas</h3>
              <p className="text-white/60 text-[10px] font-medium uppercase tracking-wider">Modular Furniture Designs</p>
            </div>
          </Card>
        </div>

        {/* Visitor Manager Tool - Directly Below AI Designer */}
        {isAdmin && (
          <div className="px-6">
            <button 
              onClick={() => router.push("/site-visits")}
              className="w-full bg-accent p-6 rounded-[2.5rem] shadow-xl shadow-accent/20 flex items-center justify-between active:scale-[0.97] transition-all border-none text-white group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <span className="block font-black text-white text-base uppercase tracking-tight">Visitor Manager</span>
                  <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">Tracking & Measurements</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}

        {/* Tools Grid */}
        <div className="px-6 grid grid-cols-3 gap-3">
          <button onClick={() => router.push("/shop")} className="bg-white p-4 rounded-[2rem] shadow-sm flex flex-col items-center gap-2 active:scale-95 border border-gray-100">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-accent" /></div>
            <span className="font-black text-primary text-[9px] uppercase">Shop</span>
          </button>
          <button onClick={() => router.push("/categories")} className="bg-white p-4 rounded-[2rem] shadow-sm flex flex-col items-center gap-2 active:scale-95 border border-gray-100">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><LayoutGrid className="w-5 h-5 text-blue-500" /></div>
            <span className="font-black text-primary text-[9px] uppercase">Explore</span>
          </button>
          <button onClick={() => router.push("/estimator")} className="bg-white p-4 rounded-[2rem] shadow-sm flex flex-col items-center gap-2 active:scale-95 border border-gray-100">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center"><Calculator className="w-5 h-5 text-green-500" /></div>
            <span className="font-black text-primary text-[9px] uppercase">Budget</span>
          </button>
        </div>

        {/* Support Tools */}
        <div className="px-6 space-y-3">
          <button onClick={() => router.push("/book-consultation")} className="w-full bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0"><MapPin className="w-6 h-6 text-green-600" /></div>
              <div className="text-left">
                <h4 className="font-black text-primary text-sm uppercase">Free Site Visit</h4>
                <p className="text-[9px] text-muted-foreground font-bold uppercase opacity-60">Book Expert Today</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>

          {deferredPrompt && (
            <button onClick={handleInstallClick} className="w-full bg-primary/5 p-4 rounded-[2rem] border border-primary/10 flex items-center justify-center gap-3 active:scale-95">
              <Download className="w-5 h-5 text-primary" />
              <span className="font-black text-primary text-[10px] uppercase">Install Fast App</span>
            </button>
          )}
        </div>
      </div>

      {/* App Branding Footer */}
      <div className="mt-10 mb-6 flex flex-col items-center gap-2 opacity-20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center p-1"><span className="text-white text-[10px] font-black">AS</span></div>
          <span className="text-[10px] font-black tracking-[0.3em] uppercase">Aravalli Steel</span>
        </div>
        <p className="text-[8px] font-bold uppercase tracking-widest">Premium Modular Solutions • Since 1998</p>
      </div>
    </div>
  )
}
