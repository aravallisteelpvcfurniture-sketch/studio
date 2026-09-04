
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useAuth, useFirestore, useUser } from "@/firebase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, LogIn, AlertCircle, Info, Copy, Check } from "lucide-react"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const auth = useAuth()
  const db = useFirestore()
  const { user, isUserLoading } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  
  const [loading, setLoading] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [displayName, setDisplayName] = React.useState("")
  const [redirectChecking, setRedirectChecking] = React.useState(true)
  const [authError, setAuthError] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

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
        if (error.code === 'auth/unauthorized-domain') {
          setAuthError(`Domain Error: Google Login allow karne ke liye domain add karein.`)
        }
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
    setAuthError(null)
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      await signInWithRedirect(auth, provider)
    } catch (error: any) {
      setLoading(false)
      if (error.code === 'auth/unauthorized-domain') {
        setAuthError(`Domain Error: Firebase Console mein domain whitelist karein.`)
      } else {
        setAuthError(error.message)
      }
    }
  }

  const copyDomain = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.hostname)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({ title: "Domain Copied!", description: "Ab ise Firebase Console mein paste karein." })
    }
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth || !db) return
    if (!email || !password || !displayName) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Saari details bhariye." })
      return
    }

    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const newUser = userCredential.user
      await updateProfile(newUser, { displayName })
      const userRef = doc(db, "users", newUser.uid)
      await setDoc(userRef, {
        displayName,
        email: newUser.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      toast({ title: "Account Created", description: "Aapka account ban gaya hai!" })
      router.push("/")
    } catch (error: any) {
      setLoading(false)
      toast({ variant: "destructive", title: "Signup Error", description: error.message })
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth) return
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast({ title: "Success", description: "Aap login ho gaye hain!" })
      router.push("/")
    } catch (error: any) {
      setLoading(false)
      toast({ variant: "destructive", title: "Error", description: "Invalid email or password." })
    }
  }

  if (redirectChecking && isUserLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
        <p className="mt-4 text-sm font-bold text-muted-foreground">Checking Session...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative font-body">
      <Card className="w-full max-w-md p-8 border-none shadow-none bg-black flex flex-col space-y-8 animate-in zoom-in duration-500">
        <div className="text-center">
          <div className="w-32 h-32 bg-white/5 rounded-3xl flex items-center justify-center mx-auto shadow-xl p-4 border border-white/5">
            {logoImg ? (
              <Image src={logoImg.imageUrl} alt="Logo" width={120} height={120} className="object-contain" />
            ) : (
              <Sparkles className="w-16 h-16 text-accent" />
            )}
          </div>
        </div>

        {authError && (
          <div className="space-y-4">
            <Alert variant="destructive" className="rounded-2xl border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-xs font-black uppercase">Setup Required</AlertTitle>
              <AlertDescription className="text-[10px] leading-tight text-white/90">
                Google Login ke liye niche diye gaye Domain ko Firebase Console mein add karein.
              </AlertDescription>
            </Alert>
            <div className="bg-blue-500/10 p-4 rounded-2xl flex flex-col gap-2 border border-blue-500/20">
              <div className="flex gap-2 items-center">
                <Info className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Firebase Step</span>
              </div>
              <p className="text-[10px] text-blue-200 font-medium leading-relaxed">
                Authentication &gt; Settings &gt; Authorized Domains mein ye domain add karein:
              </p>
              <div className="flex gap-2">
                <code className="flex-1 bg-black/40 p-2 rounded-xl text-[10px] font-black text-white border border-blue-500/20 select-all truncate">
                  {typeof window !== 'undefined' ? window.location.hostname : 'loading...'}
                </code>
                <Button size="icon" variant="ghost" className="h-10 w-10 bg-black/40 border border-blue-500/20" onClick={copyDomain}>
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-blue-400" />}
                </Button>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl h-12 mb-6 bg-white/5 p-1 border border-white/5">
            <TabsTrigger value="login" className="rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black">Login</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-2">Email Address</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-14 rounded-2xl bg-white/5 border-white/10 px-6 text-white" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-2">Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-14 rounded-2xl bg-white/5 border-white/10 px-6 text-white" />
              </div>
              <Button disabled={loading} className="w-full h-14 rounded-2xl bg-white text-black font-black text-lg shadow-xl flex gap-3 active:scale-95 transition-all">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <LogIn className="w-6 h-6" />}
                SIGN IN
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-2">Full Name</Label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="h-14 rounded-2xl bg-white/5 border-white/10 px-6 text-white" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-2">Email Address</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-14 rounded-2xl bg-white/5 border-white/10 px-6 text-white" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-2">Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-14 rounded-2xl bg-white/5 border-white/10 px-6 text-white" />
              </div>
              <Button disabled={loading} className="w-full h-14 rounded-2xl bg-accent text-white font-black text-lg shadow-xl active:scale-95 transition-all">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "CREATE ACCOUNT"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
          <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-black px-4 text-muted-foreground font-black tracking-widest">Secure Access</span></div>
        </div>

        <Button 
          variant="outline"
          onClick={handleGoogleLogin} 
          disabled={loading}
          className="w-full h-16 border-2 border-white/10 hover:bg-white/5 rounded-[2rem] font-black flex items-center justify-center gap-3 active:scale-95 text-white"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google Login
        </Button>
      </Card>
    </div>
  )
}
