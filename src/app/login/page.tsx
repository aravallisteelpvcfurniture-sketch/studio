
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult,
} from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useAuth, useFirestore, useUser } from "@/firebase"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
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
  const [redirectChecking, setRedirectChecking] = React.useState(true)

  const logoImg = PlaceHolderImages.find(i => i.id === "company-logo")

  React.useEffect(() => {
    if (!auth || !db) return

    getRedirectResult(auth)
      .then(async (result) => {
        setRedirectChecking(false)
        if (result?.user) {
          const loggedUser = result.user
          const userRef = doc(db, "users", loggedUser.uid)
          await setDoc(userRef, {
            displayName: loggedUser.displayName,
            email: loggedUser.email,
            photoURL: loggedUser.photoURL,
            lastLogin: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }, { merge: true })

          toast({ title: "Namaste!", description: "Aap login ho gaye hain!" })
          router.push("/")
        }
      })
      .catch((error) => {
        setRedirectChecking(false)
        console.error("Auth redirect error", error)
      })
  }, [auth, db, router, toast])

  React.useEffect(() => {
    if (user && !isUserLoading) {
      router.push("/")
    }
  }, [user, isUserLoading, router])

  const handleGoogleLogin = async () => {
    if (!auth) return
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      await signInWithRedirect(auth, provider)
    } catch (error: any) {
      setLoading(false)
      toast({ variant: "destructive", title: "Login Error", description: error.message })
    }
  }

  if (redirectChecking && isUserLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 relative font-body text-white">
      <div className="w-full max-w-md flex flex-col items-center space-y-12 animate-in zoom-in duration-500">
        
        {/* Logo at Top */}
        <div className="w-48 h-48 relative flex items-center justify-center">
          {logoImg ? (
            <Image 
              src={logoImg.imageUrl} 
              alt="Aravalli Steel Logo" 
              width={200} 
              height={200} 
              className="object-contain" 
            />
          ) : (
            <div className="w-32 h-32 bg-accent rounded-[3rem] shadow-2xl flex items-center justify-center">
              <span className="text-white text-4xl font-black">AS</span>
            </div>
          )}
        </div>

        {/* Login Controls */}
        <div className="w-full space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black uppercase tracking-widest text-white/90">Authentication</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Secure Access Portal</p>
          </div>

          <Button 
            onClick={handleGoogleLogin} 
            disabled={loading}
            className="w-full h-16 bg-white text-black hover:bg-white/90 rounded-full font-black flex items-center justify-center gap-4 active:scale-95 transition-all shadow-[0_15px_30px_-10px_rgba(255,255,255,0.2)]"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span className="text-lg">Google Login</span>
          </Button>
        </div>

        <div className="opacity-20 text-[8px] font-black uppercase tracking-[0.5em] text-center pt-8">
          Aravalli Steel Industry
        </div>
      </div>
    </div>
  )
}
