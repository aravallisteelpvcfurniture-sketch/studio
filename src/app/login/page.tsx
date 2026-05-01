
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useAuth, useFirestore, useUser } from "@/firebase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const { auth } = useAuth()
  const { db } = useFirestore()
  const { user, loading: userLoading } = useUser()
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

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
      const user = result.user

      // Initialize user profile in Firestore if it doesn't exist
      const userRef = doc(db, "users", user.uid)
      setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        updatedAt: serverTimestamp(),
      }, { merge: true })

      router.push("/")
    } catch (error) {
      console.error("Login failed", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -z-10" />

      <Link href="/" className="absolute top-8 left-8">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </Link>

      <Card className="w-full max-w-md p-8 border-none shadow-2xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] flex flex-col items-center text-center space-y-8">
        <div className="space-y-2">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tight">
            ARAVALLI<span className="text-accent">STEEL</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Login to access personalized modular designs and quotes.
          </p>
        </div>

        <div className="w-full space-y-4 pt-4">
          <Button 
            onClick={handleGoogleLogin} 
            disabled={loading}
            className="w-full h-14 bg-white hover:bg-gray-50 text-primary border-2 border-gray-100 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-sm"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>
          
          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-gray-100 flex-1" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">or</span>
            <div className="h-px bg-gray-100 flex-1" />
          </div>

          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our <Link href="#" className="text-accent underline font-bold">Terms of Service</Link> and <Link href="#" className="text-accent underline font-bold">Privacy Policy</Link>.
          </p>
        </div>
      </Card>
    </div>
  )
}
