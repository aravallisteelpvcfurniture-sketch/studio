
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
  const { auth } = useAuth()
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

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    )
  }

  if (!user) return null

  const handleLogout = async () => {
    if (auth) {
      try {
        await signOut(auth)
        // Redirect handled by useEffect
      } catch (error) {
        console.error("Logout failed:", error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-body pb-10">
      {/* Native App Header */}
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
          <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full text-muted-foreground">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Hero Section: AI Design Studio */}
      <div className="px-6 mt-6">
        <Card 
          onClick={() => router.push("/ai-designer")}
          className="group relative overflow-hidden p-6 rounded-[2.5rem] border-none bg-primary text-white shadow-2xl shadow-primary/20 active:scale-[0.97] transition-all cursor-pointer h-48 flex flex-col justify-end"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[60px] -mr-16 -mt-16" />
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
            <Sparkles className="w-40 h-40 text-white" />
          </div>
          
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 bg-accent px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
              <Sparkles className="w-3 h-3" /> AI Powered
            </div>
            <h3 className="text-2xl font-black tracking-tighter leading-none uppercase">AI Design Studio</h3>
            <p className="text-white/60 text-xs font-medium">Automatic modular designs in seconds.</p>
          </div>
        </Card>
      </div>

      {/* Tools Grid - Visitor Manager and Others */}
      <div className="px-6 mt-6 grid grid-cols-2 gap-4">
        {isAdmin && (
          <button 
            onClick={() => router.push("/site-visits")}
            className="bg-accent p-5 rounded-[2.5rem] shadow-lg shadow-accent/20 flex flex-col items-center gap-3 active:scale-95 transition-all border-none text-white col-span-2"
          >
            <div className="w-14 h-14 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md">
              <ClipboardList className="w-7 h-7 text-white" />
            </div>
            <div className="text-center">
              <span className="block font-black text-white text-sm uppercase tracking-tight">Visitor Manager</span>
              <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">Site Visits & Measurements</span>
            </div>
          </button>
        )}

        <button 
          onClick={() => router.push("/shop")}
          className="bg-white p-5 rounded-[2.5rem] shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all border border-gray-100"
        >
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-accent" />
          </div>
          <div className="text-center">
            <span className="block font-black text-primary text-[10px] uppercase tracking-tight">Shop</span>
            <span className="text-[8px] font-bold text-muted-foreground uppercase opacity-60">Products</span>
          </div>
        </button>

        <button 
          onClick={() => router.push("/categories")}
          className="bg-white p-5 rounded-[2.5rem] shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all border border-gray-100"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
            <LayoutGrid className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-center">
            <span className="block font-black text-primary text-[10px] uppercase tracking-tight">Explore</span>
            <span className="text-[8px] font-bold text-muted-foreground uppercase opacity-60">Categories</span>
          </div>
        </button>

        <button 
          onClick={() => router.push("/estimator")}
          className="bg-white p-5 rounded-[2.5rem] shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all border border-gray-100"
        >
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
            <Calculator className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-center">
            <span className="block font-black text-primary text-[10px] uppercase tracking-tight">Estimator</span>
            <span className="text-[8px] font-bold text-muted-foreground uppercase opacity-60">Budget</span>
          </div>
        </button>

        {deferredPrompt && (
          <button 
            onClick={handleInstallClick}
            className="bg-primary p-5 rounded-[2.5rem] shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all border-none text-white"
          >
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <span className="block font-black text-white text-[10px] uppercase tracking-tight">Install</span>
              <span className="text-[8px] font-bold text-white/50 uppercase">Fast App</span>
            </div>
          </button>
        )}
      </div>

      {/* Large Bottom Action Card */}
      <div className="px-6 mt-8">
        <button 
          onClick={() => router.push("/book-consultation")}
          className="w-full bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-50 rounded-[1.5rem] flex items-center justify-center shrink-0">
              <MapPin className="w-7 h-7 text-green-600" />
            </div>
            <div className="text-left">
              <h4 className="font-black text-primary text-base leading-tight uppercase tracking-tight">Free Site Visit</h4>
              <p className="text-[10px] text-muted-foreground font-bold uppercase opacity-60 tracking-wider">Book Expert Today</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* App Branding Footer */}
      <div className="mt-auto pt-10 pb-6 flex flex-col items-center gap-2 opacity-20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center p-1">
             <span className="text-white text-[10px] font-black">AS</span>
          </div>
          <span className="text-[10px] font-black tracking-[0.3em] uppercase">Aravalli Steel</span>
        </div>
        <p className="text-[8px] font-bold uppercase tracking-widest">Premium Modular Solutions • Since 1998</p>
      </div>
    </div>
  )
}
