
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ChevronLeft, 
  MessageSquareHeart, 
  Send, 
  RotateCcw,
  MapPin,
  Phone,
  Layout
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { ScrollArea } from "@/components/ui/scroll-area"

const FESTIVAL_TEMPLATES = [
  { id: "diwali", title: "Deepawali", url: "https://picsum.photos/seed/diwali/800/800", hint: "diwali celebration" },
  { id: "holi", title: "Holi Festival", url: "https://picsum.photos/seed/holi/800/800", hint: "holi colors" },
  { id: "rakhi", title: "Raksha Bandhan", url: "https://picsum.photos/seed/rakhi/800/800", hint: "rakhi thread" },
  { id: "rama", title: "Ram Navami", url: "https://picsum.photos/seed/rama/800/800", hint: "lord rama" },
  { id: "india", title: "Aazadi Mahotsav", url: "https://picsum.photos/seed/india/800/800", hint: "india flag" },
  { id: "ganesh", title: "Ganesh Utsav", url: "https://picsum.photos/seed/ganesh/800/800", hint: "lord ganesha" },
]

const BOX_STYLES = [
  { id: "glass", name: "Glassmorphism", class: "bg-white/20 backdrop-blur-md text-white border-white/30" },
  { id: "dark", name: "Modern Dark", class: "bg-black/60 backdrop-blur-sm text-white border-black/20" },
  { id: "royal", name: "Royal Gold", class: "bg-orange-500/80 text-white border-orange-300" },
  { id: "white", name: "Minimal White", class: "bg-white text-primary border-gray-200" },
]

export default function GreetingsTool() {
  const db = useFirestore()
  const { user } = useUser()
  const [selectedTemplate, setSelectedTemplate] = React.useState(FESTIVAL_TEMPLATES[0])
  const [selectedStyle, setSelectedStyle] = React.useState(BOX_STYLES[0])
  
  const [logoPos, setLogoPos] = React.useState({ x: 5, y: 5 })
  const [infoPos, setInfoPos] = React.useState({ x: 5, y: 80 })

  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isDraggingLogo, setIsDraggingLogo] = React.useState(false)
  const [isDraggingInfo, setIsDraggingInfo] = React.useState(false)

  const userDocRef = useMemoFirebase(() => (db && user) ? doc(db, "users", user.uid) : null, [db, user])
  const { data: profile } = useDoc(userDocRef)

  const logoImg = PlaceHolderImages.find(i => i.id === "company-logo")?.imageUrl || "https://picsum.photos/seed/aravalli-logo/200/200"

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current || (!isDraggingLogo && !isDraggingInfo)) return

    const rect = containerRef.current.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY

    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100

    const constrainedX = Math.max(0, Math.min(x, 90))
    const constrainedY = Math.max(0, Math.min(y, 90))

    if (isDraggingLogo) {
      setLogoPos({ x: constrainedX, y: constrainedY })
    } else if (isDraggingInfo) {
      setInfoPos({ x: constrainedX, y: constrainedY })
    }
  }

  const stopDragging = () => {
    setIsDraggingLogo(false)
    setIsDraggingInfo(false)
  }

  const sendWhatsApp = () => {
    const message = `Namaste! Aravalli Steel ki taraf se aapko ${selectedTemplate.title} ki hardik shubhkamnayein!\n\nRegards:\n${profile?.displayName || user?.displayName}\n${profile?.shippingAddress || "Main Workshop"}\nPhone: ${profile?.phone || "999-999-9999"}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col select-none pb-24">
      <div className="p-6 flex items-center justify-between bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-black text-primary uppercase tracking-tight">Greeting Tool</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => { setLogoPos({ x: 5, y: 5 }); setInfoPos({ x: 5, y: 80 }); }} className="text-accent">
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          {/* Canvas Section */}
          <div 
            ref={containerRef}
            onMouseMove={handleDrag}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
            onTouchMove={handleDrag}
            onTouchEnd={stopDragging}
            className="relative aspect-square w-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white bg-muted touch-none"
          >
            <Image 
              src={selectedTemplate.url} 
              alt="Festival" 
              fill 
              className="object-cover pointer-events-none"
              data-ai-hint={selectedTemplate.hint}
            />

            {/* Logo Layer */}
            <div 
              onMouseDown={() => setIsDraggingLogo(true)}
              onTouchStart={() => setIsDraggingLogo(true)}
              style={{ left: `${logoPos.x}%`, top: `${logoPos.y}%` }}
              className={`absolute w-16 h-16 bg-white/90 rounded-2xl p-2 shadow-lg flex items-center justify-center cursor-move border border-white/50 z-20 transition-transform ${isDraggingLogo ? 'scale-110' : ''}`}
            >
              <Image src={logoImg} alt="Logo" width={50} height={50} className="object-contain pointer-events-none" />
            </div>

            {/* Info Layer */}
            <div 
              onMouseDown={() => setIsDraggingInfo(true)}
              onTouchStart={() => setIsDraggingInfo(true)}
              style={{ left: `${infoPos.x}%`, top: `${infoPos.y}%` }}
              className={`absolute max-w-[80%] rounded-2xl p-4 shadow-xl border cursor-move z-10 transition-transform ${selectedStyle.class} ${isDraggingInfo ? 'scale-105' : ''}`}
            >
              <h4 className="font-black text-[11px] uppercase tracking-tight truncate">
                {profile?.displayName || user?.displayName || "Aravalli Steel User"}
              </h4>
              <p className="text-[8px] font-bold uppercase opacity-80 flex items-center gap-1 mt-1">
                <MapPin className="w-2.5 h-2.5" /> {profile?.shippingAddress || "Main Site Address"}
              </p>
              <p className="text-[8px] font-bold uppercase opacity-80 flex items-center gap-1 mt-1">
                <Phone className="w-2.5 h-2.5" /> {profile?.phone || "Contact: 999-999-9999"}
              </p>
            </div>
          </div>

          {/* Box Style Selector */}
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-2 flex items-center gap-2">
              <Layout className="w-3 h-3" /> Select Info Box Style
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {BOX_STYLES.map((style) => (
                <Button
                  key={style.id}
                  variant="outline"
                  onClick={() => setSelectedStyle(style)}
                  className={`h-12 rounded-xl text-[10px] font-black uppercase transition-all ${
                    selectedStyle.id === style.id ? "border-accent bg-accent/5 text-accent" : "border-gray-100"
                  }`}
                >
                  {style.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Festival Gallery */}
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-2">Indian Festival Gallery</Label>
            <div className="grid grid-cols-2 gap-4">
              {FESTIVAL_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`relative aspect-square rounded-[2rem] overflow-hidden border-4 transition-all active:scale-95 ${
                    selectedTemplate.id === tpl.id ? "border-accent shadow-lg" : "border-transparent opacity-80"
                  }`}
                >
                  <Image src={tpl.url} alt={tpl.title} fill className="object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/50 p-2 text-center">
                    <span className="text-[8px] font-black text-white uppercase">{tpl.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={sendWhatsApp}
            className="w-full h-16 bg-[#25D366] text-white rounded-[2rem] font-black text-lg flex gap-3 shadow-xl active:scale-95"
          >
            <Send className="w-6 h-6" /> WhatsApp Share
          </Button>
        </div>
      </ScrollArea>
    </div>
  )
}
