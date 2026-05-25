
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ChevronLeft, 
  MessageSquareHeart, 
  Send, 
  User, 
  Sparkles, 
  Move,
  Layout,
  MapPin,
  Phone,
  Loader2,
  Camera
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const FESTIVAL_TEMPLATES = [
  { id: "diwali", title: "Diwali Special", url: "https://picsum.photos/seed/diwali/800/800", hint: "diwali festival" },
  { id: "holi", title: "Holi Greetings", url: "https://picsum.photos/seed/holi/800/800", hint: "holi festival" },
  { id: "eid", title: "Eid Mubarak", url: "https://picsum.photos/seed/eid/800/800", hint: "eid festival" },
  { id: "newyear", title: "New Year 2025", url: "https://picsum.photos/seed/newyear/800/800", hint: "new year party" },
]

export default function GreetingsTool() {
  const db = useFirestore()
  const { user } = useUser()
  const [selectedTemplate, setSelectedTemplate] = React.useState(FESTIVAL_TEMPLATES[0])
  const [logoPos, setLogoPos] = React.useState("top-left")
  const [infoPos, setInfoPos] = React.useState("bottom-right")

  // Fetch logged in user's full profile for address and phone
  const userDocRef = useMemoFirebase(() => (db && user) ? doc(db, "users", user.uid) : null, [db, user])
  const { data: profile, isLoading } = useDoc(userDocRef)

  const logoImg = PlaceHolderImages.find(i => i.id === "company-logo")?.imageUrl || "https://picsum.photos/seed/aravalli-logo/200/200"

  const sendWhatsApp = () => {
    const message = `Namaste! Aravalli Steel ki taraf se aapko ${selectedTemplate.title} ki hardik shubhkamnayein!\n\nRegards:\n${profile?.displayName || user?.displayName}\n${profile?.shippingAddress || "Aravalli Steel Workshop"}\nPhone: ${profile?.phone || "Contact us"}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  const getPosClass = (pos: string) => {
    switch(pos) {
      case "top-left": return "top-4 left-4";
      case "top-right": return "top-4 right-4";
      case "bottom-left": return "bottom-4 left-4 text-left";
      case "bottom-right": return "bottom-4 right-4 text-right";
      default: return "bottom-4 right-4 text-right";
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-body pb-24">
      <div className="p-6 flex items-center gap-4 bg-white border-b sticky top-0 z-50">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-black text-primary uppercase tracking-tight flex items-center gap-2">
          <MessageSquareHeart className="w-5 h-5 text-accent" />
          Greeting Maker
        </h1>
      </div>

      <div className="flex-1 p-6 space-y-8">
        {/* 1. The Poster Preview Area */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Poster Preview</h3>
          <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-gray-200 group">
            <Image 
              src={selectedTemplate.url} 
              alt="Template" 
              fill 
              className="object-cover"
              data-ai-hint={selectedTemplate.hint}
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all" />

            {/* Aravalli Steel Logo Overlay */}
            <div className={`absolute transition-all duration-300 ${getPosClass(logoPos)} w-16 h-16 bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-lg flex items-center justify-center`}>
              <Image src={logoImg} alt="Logo" width={50} height={50} className="object-contain" />
            </div>

            {/* User Info Overlay */}
            <div className={`absolute transition-all duration-300 ${getPosClass(infoPos)} max-w-[70%] bg-black/40 backdrop-blur-md rounded-2xl p-4 text-white shadow-xl border border-white/20`}>
              <h4 className="font-black text-sm uppercase tracking-tight truncate">
                {profile?.displayName || user?.displayName || "Aravalli Steel User"}
              </h4>
              <p className="text-[8px] font-bold uppercase tracking-wider opacity-80 flex items-center gap-1 mt-1">
                <MapPin className="w-2 h-2" /> {profile?.shippingAddress || "Main Workshop Area"}
              </p>
              <p className="text-[8px] font-bold uppercase tracking-wider opacity-80 flex items-center gap-1">
                <Phone className="w-2 h-2" /> {profile?.phone || "999-999-9999"}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Controls Section */}
        <Card className="p-6 rounded-[2.5rem] border-none shadow-xl bg-white space-y-6">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Layout className="w-3 h-3 text-accent" /> Set Positions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[8px] font-black uppercase text-primary/50 ml-1">Logo Position</span>
                <select 
                  value={logoPos} 
                  onChange={(e) => setLogoPos(e.target.value)}
                  className="w-full h-10 rounded-xl bg-muted/30 border-none px-3 text-[10px] font-bold uppercase"
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                </select>
              </div>
              <div className="space-y-2">
                <span className="text-[8px] font-black uppercase text-primary/50 ml-1">Info Position</span>
                <select 
                  value={infoPos} 
                  onChange={(e) => setInfoPos(e.target.value)}
                  className="w-full h-10 rounded-xl bg-muted/30 border-none px-3 text-[10px] font-bold uppercase"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Camera className="w-3 h-3 text-accent" /> Choose Template
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {FESTIVAL_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedTemplate.id === tpl.id ? "border-accent scale-95 shadow-lg" : "border-transparent"
                  }`}
                >
                  <Image src={tpl.url} alt={tpl.title} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={sendWhatsApp}
            className="w-full h-16 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl font-black text-lg flex gap-3 shadow-xl shadow-[#25D366]/20 active:scale-95 transition-all"
          >
            <Send className="w-6 h-6" />
            Share Greeting
          </Button>
        </Card>
      </div>
    </div>
  )
}
