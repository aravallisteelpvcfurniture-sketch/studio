
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useUser, useAuth } from "@/firebase"
import { signOut } from "firebase/auth"
import { 
  User, 
  LogOut, 
  Bell, 
  ChevronRight, 
  ShieldCheck,
  UserCircle,
  Lock,
  Info
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

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-body pb-24">
      <div className="p-6 bg-white border-b sticky top-0 z-50">
        <h1 className="text-xl font-black text-primary uppercase tracking-tight">Account & Settings</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          {/* Account Profile Section */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Your Profile</h3>
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
                    <h2 className="text-lg font-black text-primary leading-tight">{user.displayName || "Admin User"}</h2>
                    {isAdmin && <Badge className="bg-accent text-white border-none text-[8px] font-black h-4">ADMIN</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium truncate max-w-[180px]">{user.email}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-3">
                <Button variant="outline" className="rounded-xl h-12 font-bold text-xs gap-2 border-gray-100">
                  <UserCircle className="w-4 h-4" /> Profile
                </Button>
                <Button onClick={handleLogout} variant="ghost" className="rounded-xl h-12 font-bold text-xs gap-2 text-destructive hover:bg-destructive/5">
                  <LogOut className="w-4 h-4" /> Logout
                </Button>
              </div>
            </Card>
          </div>

          {/* Business Management Section */}
          {isAdmin && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] ml-2">Business Management</h3>
              <div className="grid gap-2">
                <button 
                  onClick={() => router.push("/notifications")}
                  className="w-full bg-white p-5 rounded-2xl flex items-center justify-between active:scale-[0.98] transition-all border border-gray-100/50 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold text-primary text-sm">Inquiry Manager</span>
                      <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Live Customer Requests</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                </button>
              </div>
            </div>
          )}

          {/* General Settings Section */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">App Settings</h3>
            <div className="grid gap-2">
              <button className="w-full bg-white p-5 rounded-2xl flex items-center justify-between opacity-50 cursor-not-allowed border border-gray-100/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <span className="font-bold text-primary text-sm">Privacy & Security</span>
                </div>
                <Badge variant="outline" className="text-[8px] font-black">LOCKED</Badge>
              </button>
              
              <button className="w-full bg-white p-5 rounded-2xl flex items-center justify-between border border-gray-100/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-bold text-primary text-sm">About Aravalli Steel</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
              </button>
            </div>
          </div>

          {/* Business Info Footer */}
          <div className="p-6 bg-primary text-white rounded-[2.5rem] space-y-4 shadow-xl shadow-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
                <span className="text-white text-[10px] font-black">AS</span>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-tight">Aravalli Steel</h4>
                <p className="text-[8px] text-white/60 font-bold uppercase tracking-widest leading-none">Since 1998</p>
              </div>
            </div>
            <div className="pt-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/80">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" /> 10 Years Warranty
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
