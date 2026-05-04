
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
import { Loader2, Sparkles, Mail, Lock, User as UserIcon, LogIn } from "lucide-react"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

  const logoImg = PlaceHolderImages.find(i => i.id === "company-logo")

  // Handle Redirect Result on mount (Crucial for Installed PWA)
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
        console.error("Login Error:", error)
      })
  }, [auth, db, router, toast])

  // Redirect if already logged in
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
      // Redirect is much more reliable on mobile/installed apps than popups
      await signInWithRedirect(auth, provider)
    } catch (error: any) {
      setLoading(false)
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Google login nahi ho paya. Dobara koshish karein.",
      })
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
      let msg = "Signup nahi ho paya."
      if (error.code === 'auth/email-already-in-use') msg = "Ye email pehle se register hai."
      toast({ variant: "destructive", title: "Error", description: msg })
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth) return
    if (!email || !password) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Email aur password daaliye." })
      return
    }

    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast({ title: "Success", description: "Aap login ho gaye hain!" })
      router.push("/")
    } catch (error: any) {
      setLoading(false)
      let msg = "Invalid credentials."
      if (error.code === 'auth/user-not-found') msg = "Account nahi mila. Signup karein."
      if (error.code === 'auth/wrong-password') msg = "Galat password."
      toast({ variant: "destructive", title: "Error", description: msg })
    }
  }

  if (redirectChecking && isUserLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
        <p className="mt-4 text-sm font-bold text-muted-foreground animate-pulse">Checking Login Status...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden font-body">
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md p-8 border-none shadow-2xl bg-white/95 backdrop-blur-xl rounded-[3rem] flex flex-col space-y-8 animate-in zoom-in duration-500">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-lg p-3 border border-accent/10">
            {logoImg ? (
              <Image 
                src={logoImg.imageUrl} 
                alt="Logo" 
                width={60} 
                height={60} 
                className="object-contain"
                data-ai-hint="company logo"
              />
            ) : (
              <Sparkles className="w-8 h-8 text-accent" />
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-primary tracking-tighter uppercase leading-none">
              ARAVALLI <span className="text-accent">STEEL</span>
            </h1>
            <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase opacity-60">
              Premium Modular Solutions
            </p>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl h-12 mb-6 bg-muted/50 p-1">
            <TabsTrigger value="login" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Login</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1 tracking-widest">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="example@mail.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 pl-11 rounded-2xl bg-muted/30 border-none focus-visible:ring-accent font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1 tracking-widest">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 pl-11 rounded-2xl bg-muted/30 border-none focus-visible:ring-accent font-medium"
                  />
                </div>
              </div>
              <Button disabled={loading} className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/10 flex gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                Login Karein
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1 tracking-widest">Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Aapka Naam" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="h-14 pl-11 rounded-2xl bg-muted/30 border-none focus-visible:ring-accent font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1 tracking-widest">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="example@mail.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 pl-11 rounded-2xl bg-muted/30 border-none focus-visible:ring-accent font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1 tracking-widest">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="password" 
                    placeholder="At least 6 characters" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 pl-11 rounded-2xl bg-muted/30 border-none focus-visible:ring-accent font-medium"
                  />
                </div>
              </div>
              <Button disabled={loading} className="w-full h-14 rounded-2xl bg-accent text-white font-black text-lg hover:bg-accent/90 transition-all shadow-xl shadow-accent/10">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up Karein"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white px-3 text-muted-foreground font-black tracking-widest">Ya Phir</span>
          </div>
        </div>

        <Button 
          variant="outline"
          onClick={handleGoogleLogin} 
          disabled={loading}
          className="w-full h-16 border-2 border-muted hover:bg-muted/30 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-sm"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google se Login Karein
        </Button>
      </Card>
      
      <p className="mt-8 text-[10px] text-muted-foreground/60 font-black uppercase tracking-[0.2em] text-center">
        Aravalli Steel - Trusted Modular Solutions
      </p>
    </div>
  )
}
