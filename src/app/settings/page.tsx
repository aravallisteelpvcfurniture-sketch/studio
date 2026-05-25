
"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, User, Phone, MapPin, Save, Loader2, LogOut, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { signOut } from "firebase/auth"
import { useAuth } from "@/firebase"

export default function SettingsPage() {
  const db = useFirestore()
  const { user } = useUser()
  const auth = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    displayName: "",
    phone: "",
    shippingAddress: ""
  })

  const userDocRef = useMemoFirebase(() => (db && user) ? doc(db, "users", user.uid) : null, [db, user])
  const { data: userData, isLoading: isDocLoading } = useDoc(userDocRef)

  React.useEffect(() => {
    if (userData) {
      setFormData({
        displayName: userData.displayName || user?.displayName || "",
        phone: userData.phone || "",
        shippingAddress: userData.shippingAddress || ""
      })
    }
  }, [userData, user])

  const handleSave = async () => {
    if (!db || !user) return
    setLoading(true)
    try {
      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        updatedAt: serverTimestamp()
      }, { merge: true })
      toast({ title: "Settings Updated!", description: "Aapki details save ho gayi hain." })
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed", description: "Kuch galat hua, dobara koshish karein." })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth)
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-6 flex items-center gap-4 bg-white border-b sticky top-0 z-50">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-black text-primary uppercase tracking-tight">Settings Tools</h1>
      </div>

      <div className="p-6 space-y-6 max-w-lg mx-auto w-full">
        {isDocLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" /></div>
        ) : (
          <>
            <Card className="p-8 border-none shadow-xl bg-white rounded-[2.5rem] space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      value={formData.displayName}
                      onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      className="h-12 rounded-xl bg-muted/30 border-none pl-12 font-bold"
                      placeholder="Your Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="h-12 rounded-xl bg-muted/30 border-none pl-12 font-bold"
                      placeholder="9999999999"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Shop/Site Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-4 h-4 text-muted-foreground" />
                    <textarea 
                      value={formData.shippingAddress}
                      onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
                      className="w-full min-h-[100px] rounded-xl bg-muted/30 border-none p-4 pl-12 font-bold text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="Enter full address..."
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSave}
                disabled={loading}
                className="w-full h-14 bg-accent text-white font-black rounded-2xl shadow-xl shadow-accent/20 flex gap-2 active:scale-95 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
                Save Settings
              </Button>
            </Card>

            <div className="space-y-3">
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase text-primary">Data Security</p>
                  <p className="text-[8px] text-muted-foreground font-bold uppercase">All your data is encrypted & secure</p>
                </div>
              </div>

              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full h-14 rounded-2xl text-destructive font-black uppercase tracking-widest hover:bg-destructive/5 flex gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout Account
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
