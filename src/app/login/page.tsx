
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useAuth, useFirestore, useUser } from "@/firebase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"

export default function LoginPage() {
  const { auth } = useAuth()
  const { db } = useFirestore()
  const { user, loading: userLoading } = useUser()
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  const logoImg = PlaceHolderImages.find(i => i.id === "company-logo")

  React.useEffect(() => {
    if (user && !userLoading) {
      router.push("/")
    }
  }, [user, userLoading, router])

  const handleGoogleLogin = async () => {
    if (!auth || !db) return
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const loggedUser = result.user

      const userRef = doc(db, "users", loggedUser.uid)
      await setDoc(userRef, {
        displayName: loggedUser.displayName,
        email: loggedUser.email,
        photoURL: loggedUser.photoURL,
        updatedAt: serverTimestamp(),
      }, { merge: true })

      router.push("/")
    } catch (error) {
      console.error("Login failed", error)
    } finally {
      setLoading(false)
    }
  }

  if (userLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-5%] left-[-5%] w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />

      <Card className="w-full max-w-md p-10 border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] bg-white/90 backdrop-blur-xl rounded-[3rem] flex flex-col items-center text-center space-y-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="space-y-6">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-xl overflow-hidden p-2 border border-gray-100">
            {logoImg && (
              <Image 
                src={logoImg.imageUrl} 
                alt="Aravalli Steel Logo" 
                width={80} 
                height={80} 
                className="object-contain"
                data-ai-hint={logoImg.imageHint}
              />
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-primary tracking-tighter">
              WELCOME<span className="text-accent"> BACK</span>
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Aravalli Steel mein aapka swagat hai.
            </p>
          </div>
        </div>

        <div className="w-full space-y-4">
          <Button 
            onClick={handleGoogleLogin} 
            disabled={loading}
            className="w-full h-16 bg-white hover:bg-gray-50 text-primary border-2 border-gray-100 rounded-2xl font-bold flex items-center justify-center gap-4 transition-all shadow-sm group"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            ) : (
              <>
                <div className="bg-white p-1 rounded-md group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                Continue with Google
              </>
            )}
          </Button>

          <div className="flex items-center gap-4 py-4">
            <div className="h-px bg-gray-100 flex-1" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Premium Steel Solutions</span>
            <div className="h-px bg-gray-100 flex-1" />
          </div>
        </div>
      </Card>
    </div>
  )
}
