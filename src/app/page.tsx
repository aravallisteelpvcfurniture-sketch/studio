
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useUser, useAuth } from "@/firebase"
import { Loader2, LogOut, ShoppingBag, LayoutGrid, Sparkles, MapPin, Bell, Download, Calculator, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "firebase/auth"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function Home() {
  const { user, isUserLoading } = useUser()
  const { auth } = useAuth()
  const router = useRouter()
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null)

  const logoImg = PlaceHolderImages.find(i => i.id === "company-logo")

  // Admin Check
  const isAdmin = React.useMemo(() => {
    if (!user) return false;
    return user.email === "aravallisteelpvcfurniture@gmail.com" || user.uid === "Qmcch2NXxmg47Zf28Wh0KTp9Njt1";
  }, [user]);

  // PWA Install Logic
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

  const handleLogout = () => {
    if (auth) signOut(auth)
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-body pb-10">
      {/* Dynamic Header */}
      <div className="p-6 pb-2 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm p-1 border border-gray-100">
            {logoImg ? (
              <Image src={logoImg.imageUrl} alt="Logo" width={32} height={32} className="object-contain" />
            ) : (
              <Sparkles className="w-6 h-6 text-accent" />
            )}
          </div>
          <div>
            <h1 className="text-sm font-black text-primary tracking-tighter leading-none uppercase">
              ARAVALLI<span className="text-accent">STEEL</span>
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">Premium Solutions</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {deferredPrompt && (
            <Button variant="ghost" size="icon" onClick={handleInstallClick} className="rounded-full text-accent hover:bg-accent/10">
              <Download className="w-5 h-5" />
            </Button>
          )}
          {isAdmin && (
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="rounded-full text-primary hover:bg-primary/5 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* Welcome Text */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-accent uppercase tracking-widest">Namaste,</p>
          <h2 className="text-3xl font-black text-primary tracking-tight">
            {user.displayName?.split(' ')[0] || "Dost"}!
          </h2>
        </div>

        {/* Featured Card: AI Design Studio */}
        <Card 
          onClick={() => router.push("/ai-designer")}
          className="group relative overflow-hidden p-8 rounded-[2.5rem] border-none bg-primary text-white shadow-2xl shadow-primary/20 active:scale-[0.98] transition-all cursor-pointer"
        >
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-accent/20 rounded-full blur-3xl group-hover:bg-accent/30 transition-colors" />
          <div className="relative z-10 space-y-6">
            <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black tracking-tight">AI Design Studio</h3>
              <p className="text-white/60 text-sm font-medium leading-relaxed">Apne ghar ke liye automatic modular designs banayein.</p>
            </div>
            <div className="flex items-center gap-2 text-accent font-black text-xs uppercase tracking-widest pt-2">
              Try It Now <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </Card>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => router.push("/shop")}
            className="group bg-white p-6 rounded-[2.5rem] shadow-sm border border-transparent hover:border-accent/20 active:scale-95 transition-all text-left space-y-4"
          >
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
              <ShoppingBag className="w-6 h-6 text-accent group-hover:text-white" />
            </div>
            <div>
              <span className="block font-black text-primary text-sm uppercase tracking-tight">Shop Now</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Modular Items</span>
            </div>
          </button>

          <button 
            onClick={() => router.push("/categories")}
            className="group bg-white p-6 rounded-[2.5rem] shadow-sm border border-transparent hover:border-blue-200 active:scale-95 transition-all text-left space-y-4"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <LayoutGrid className="w-6 h-6 text-blue-500 group-hover:text-white" />
            </div>
            <div>
              <span className="block font-black text-primary text-sm uppercase tracking-tight">Categories</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Explore All</span>
            </div>
          </button>

          <button 
            onClick={() => router.push("/estimator")}
            className="group bg-white p-6 rounded-[2.5rem] shadow-sm border border-transparent hover:border-green-200 active:scale-95 transition-all text-left space-y-4"
          >
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
              <Calculator className="w-6 h-6 text-green-500 group-hover:text-white" />
            </div>
            <div>
              <span className="block font-black text-primary text-sm uppercase tracking-tight">Price Estimator</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Quick Budget</span>
            </div>
          </button>

          {deferredPrompt ? (
            <button 
              onClick={handleInstallClick}
              className="group bg-accent/5 p-6 rounded-[2.5rem] border-2 border-dashed border-accent/30 active:scale-95 transition-all text-left space-y-4 animate-pulse"
            >
              <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="block font-black text-accent text-sm uppercase tracking-tight">Install App</span>
                <span className="text-[10px] font-bold text-accent/60 uppercase">Better Experience</span>
              </div>
            </button>
          ) : (
            <div className="bg-gray-100/50 p-6 rounded-[2.5rem] border border-gray-100 flex flex-col justify-end">
              <span className="block font-black text-gray-400 text-sm uppercase tracking-tight">Coming Soon</span>
              <span className="text-[10px] font-bold text-gray-300 uppercase">New Features</span>
            </div>
          )}
        </div>

        {/* Site Visit Card - Large Bottom Action */}
        <button 
          onClick={() => router.push("/book-consultation")}
          className="w-full bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between hover:border-accent/20 active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-green-50 rounded-3xl flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
              <MapPin className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-left">
              <h4 className="font-black text-primary text-lg leading-tight uppercase tracking-tight">Free Site Visit</h4>
              <p className="text-xs text-muted-foreground font-bold uppercase opacity-60">Book Expert Consultation</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* Subtle Footer Branding */}
      <p className="mt-4 text-[9px] text-muted-foreground/40 font-black uppercase tracking-[0.3em] text-center">
        Aravalli Steel - Since 1998
      </p>
    </div>
  )
}
