
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useUser, useAuth } from "@/firebase"
import { Loader2, LogOut, ShoppingBag, LayoutGrid, Sparkles, MapPin, Bell, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "firebase/auth"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import Link from "next/link"

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
    <div className="min-h-screen bg-background flex flex-col font-body">
      {/* Header */}
      <div className="p-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm p-1 border">
            {logoImg ? (
              <Image src={logoImg.imageUrl} alt="Logo" width={32} height={32} />
            ) : (
              <Sparkles className="w-6 h-6 text-accent" />
            )}
          </div>
          <div>
            <h1 className="text-lg font-black text-primary tracking-tighter leading-none">
              ARAVALLI<span className="text-accent">STEEL</span>
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Premium Shop</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {deferredPrompt && (
            <Button variant="ghost" size="icon" onClick={handleInstallClick} className="rounded-full text-accent animate-bounce">
              <Download className="w-5 h-5" />
            </Button>
          )}
          {isAdmin && (
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="rounded-full text-accent">
                <Bell className="w-5 h-5" />
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full hover:bg-accent/10 hover:text-accent">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-primary tracking-tight">
            Namaste, {user.displayName?.split(' ')[0]}!
          </h2>
          <p className="text-muted-foreground font-medium">Aapka dashboard taiyar hai.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Main Action Card */}
          <div className="bg-primary text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">AI Design Studio</h3>
                <p className="text-white/60 text-sm font-medium">Apne ghar ke liye automatic design banwayein.</p>
              </div>
              <Button 
                onClick={() => router.push("/ai-designer")}
                className="w-full h-14 bg-white text-primary hover:bg-white/90 rounded-2xl font-black text-lg"
              >
                Try AI Designer
              </Button>
            </div>
          </div>

          {/* Grid Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => router.push("/shop")}
              className="bg-white p-6 rounded-[2.5rem] border shadow-sm flex flex-col items-center gap-3 hover:border-accent transition-all active:scale-95"
            >
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-accent" />
              </div>
              <span className="font-bold text-primary">Shop Now</span>
            </button>

            <button 
              onClick={() => router.push("/categories")}
              className="bg-white p-6 rounded-[2.5rem] border shadow-sm flex flex-col items-center gap-3 hover:border-accent transition-all active:scale-95"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <LayoutGrid className="w-6 h-6 text-blue-500" />
              </div>
              <span className="font-bold text-primary">Categories</span>
            </button>
          </div>

          {/* PWA Install Promo if available */}
          {deferredPrompt && (
            <div className="bg-white p-6 rounded-[2.5rem] border-2 border-dashed border-accent flex flex-col gap-4 text-center items-center animate-in zoom-in">
               <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                 <Download className="w-6 h-6 text-accent" />
               </div>
               <div>
                 <h4 className="font-bold text-primary">Install Mobile App</h4>
                 <p className="text-xs text-muted-foreground">Faster access from your home screen</p>
               </div>
               <Button onClick={handleInstallClick} className="w-full rounded-xl bg-accent text-white font-bold h-12">INSTALL NOW</Button>
            </div>
          )}

          {/* Site Visit Card */}
          <button 
            onClick={() => router.push("/book-consultation")}
            className="bg-white p-6 rounded-[2.5rem] border shadow-sm flex items-center gap-4 hover:border-accent transition-all active:scale-95 text-left"
          >
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
              <MapPin className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h4 className="font-black text-primary">Free Site Visit</h4>
              <p className="text-xs text-muted-foreground font-medium">Expert consultation book karein</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
