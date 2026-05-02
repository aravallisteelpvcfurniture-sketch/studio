
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/firebase"
import { Loader2, LogOut, LayoutDashboard, ShoppingCart, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "firebase/auth"
import { useAuth } from "@/firebase"

export default function Home() {
  const { user, loading } = useUser()
  const { auth } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/welcome")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!user) return null

  const handleLogout = () => {
    if (auth) signOut(auth)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-50 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-black">AS</span>
          </div>
          <h1 className="text-xl font-black text-primary tracking-tighter">
            ARAVALLI<span className="text-accent">STEEL</span>
          </h1>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full">
          <LogOut className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>

      {/* Hero Section */}
      <div className="p-8 space-y-8 flex-1">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-primary">Welcome, {user.displayName?.split(' ')[0]}!</h2>
          <p className="text-muted-foreground">App ab bilkul ready hai. Kaam shuru karte hain.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-accent/10 p-6 rounded-[2rem] border border-accent/20 space-y-4">
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary">Dashboard Setup</h3>
              <p className="text-sm text-muted-foreground">Yahan aapke saare orders aur requests dikhenge.</p>
            </div>
            <Button className="w-full rounded-xl bg-accent hover:bg-accent/90">Go to Dashboard</Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border space-y-3">
              <ShoppingCart className="text-primary w-6 h-6" />
              <h3 className="font-bold text-primary">Shop</h3>
              <p className="text-[10px] text-muted-foreground">Order premium steel furniture.</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border space-y-3">
              <Calendar className="text-primary w-6 h-6" />
              <h3 className="font-bold text-primary">Schedule</h3>
              <p className="text-[10px] text-muted-foreground">Book site visits easily.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
