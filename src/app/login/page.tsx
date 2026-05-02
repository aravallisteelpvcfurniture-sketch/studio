
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useAuth, useFirestore, useUser } from "@/firebase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Sparkles } from "lucide-react"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const auth = useAuth()
  const db = useFirestore()
  const { user, isUserLoading } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)

  const logoImg = PlaceHolderImages.find(i => i.id === "company-logo")

  React.useEffect(() => {
    if (user && !isUserLoading) {
      router.push("/")
    }
  }, [user, isUserLoading, router])

  const handleGoogleLogin = async () => {
    if (!auth || !db) {
      toast({
        variant: "destructive",
        title: "System Error",
        description: "Firebase is initializing. Please wait.",
      })
      return
    }
    
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      
      const result = await signInWithPopup(auth, provider)
      const loggedUser = result.user

      const userRef = doc(db, "users", loggedUser.uid)
      await setDoc(userRef, {
        displayName: loggedUser.displayName,
        email: loggedUser.email,
        photoURL: loggedUser.photoURL,
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true })

      toast({
        title: "Namaste!",
        description: `${loggedUser.displayName}, aapka swagat hai!`,
      })
      
      router.push("/")
    } catch (error: any) {
      console.error("Login Error:", error)
      let msg = "Login nahi ho paya. Dobara koshish karein."
      if (error.code === 'auth/popup-closed-by-user') msg = "Aapne login window band kar di thi."
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: msg,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden font-body">
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md p-10 border-none shadow-2xl bg-white/90 backdrop-blur-xl rounded-[3rem] flex flex-col items-center text-center space-y-12 animate-in zoom-in duration-500">
        <div className="space-y-6">
          <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl p-4 border border-accent/10">
            {logoImg ? (
              <Image 
                src={logoImg.imageUrl} 
                alt="Logo" 
                width={80} 
                height={80} 
                className="object-contain"
                data-ai-hint="company logo"
              />
            ) : (
              <Sparkles className="w-10 h-10 text-accent" />
            )}
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-primary tracking-tighter uppercase">
              ARAVALLI <span className="text-accent">STEEL</span>
            </h1>
            <p className="text-muted-foreground text-sm font-bold tracking-widest uppercase opacity-60">
              Premium Modular Solutions
            </p>
          </div>
        </div>

        <div className="w-full space-y-6">
          <Button 
            onClick={handleGoogleLogin} 
            disabled={loading || isUserLoading}
            className="w-full h-16 bg-white hover:bg-gray-50 text-primary border-2 border-gray-100 rounded-2xl font-bold flex items-center justify-center gap-4 transition-all active:scale-95 shadow-sm"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google se Login karein
              </>
            )}
          </Button>

          <p className="text-[10px] text-muted-foreground/60 font-medium tracking-wide">
            Login karke hamare premium designs dekhein
          </p>
        </div>
      </Card>
    </div>
  )
}
