
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ChevronLeft, 
  MessageSquareHeart, 
  Send, 
  Move,
  MapPin,
  Phone,
  Camera,
  RotateCcw,
  Palette
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

const FESTIVAL_TEMPLATES = [
  { id: "diwali", title: "Diwali Special", url: "https://picsum.photos/seed/diwali/800/800", hint: "diwali festival" },
  { id: "holi", title: "Holi Greetings", url: "https://picsum.photos/seed/holi/800/800", hint: "holi festival" },
  { id: "eid", title: "Eid Mubarak", url: "https://picsum.photos/seed/eid/800/800", hint: "eid festival" },
  { id: "newyear", title: "New Year 2025", url: "https://picsum.photos/seed/newyear/800/800", hint: "new year party" },
]

const INFO_STYLES = [
  { id: "glass", name: "Glassmorphism", classes: "bg-black/40 backdrop-blur-md text-white border-white/20" },
  { id: "dark", name: "Modern Dark", classes: "bg-black text-white border-white/10" },
  { id: "gold", name: "Royal Gold", classes: "bg-amber-900/80 text-amber-100 border-amber-500/50" },
  { id: "white", name: "Minimal White", classes: "bg-white/90 text-primary border-primary/10 shadow-xl" },
]

export default function GreetingsTool() {
  const db = useFirestore()
  const { user } = useUser()
  const [selectedTemplate, setSelectedTemplate] = React.useState(FESTIVAL_TEMPLATES[0])
  const [selectedStyle, setSelectedStyle] = React.useState(INFO_STYLES[0])
  
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
    const message = `Namaste! Aravalli Steel ki taraf se aapko ${selectedTemplate.title} ki hardik shubhkamnayein!\n\nRegards:\n${profile?.displayName || user?.displayName}\n${profile?.shippingAddress || "Aravalli Steel Workshop"}\nPhone: ${profile?.phone || "Contact us"}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  const resetPositions = () => {
    setLogoPos({ x: 5, y: 5 })
    setInfoPos({ x: 5, y: 80 })
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-body pb-24 select-none">
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

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ungli se drag karke set karein</h3>
              <Button variant="ghost" size="sm" onClick={resetPositions} className="text-[10px] font-bold text-accent h-6 gap-1">
                <RotateCcw className="w-3 h-3" /> Reset
              </Button>
            </div>
            
            <div 
              ref={containerRef}
              onMouseMove={handleDrag}
              onMouseUp={stopDragging}
              onMouseLeave={stopDragging}
              onTouchMove={handleDrag}
              onTouchEnd={stopDragging}
              className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-gray-200 touch-none"
            >
              <Image 
                src={selectedTemplate.url} 
                alt="Template" 
                fill 
                className="object-cover select-none pointer-events-none"
                data-ai-hint={selectedTemplate.hint}
              />

              {/* Logo Overlay */}
              <div 
                onMouseDown={() => setIsDraggingLogo(true)}
                onTouchStart={() => setIsDraggingLogo(true)}
                style={{ left: `${logoPos.x}%`, top: `${logoPos.y}%` }}
                className={`absolute w-16 h-16 bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-lg flex items-center justify-center cursor-move border border-white/50 z-20 transition-transform ${isDraggingLogo ? 'scale-110 shadow-2xl ring-2 ring-accent' : ''}`}
              >
                <Image src={logoImg} alt="Logo" width={50} height={50} className="object-contain pointer-events-none" />
                <div className="absolute -top-2 -right-2 bg-accent text-white rounded-full p-1">
                   <Move className="w-2 h-2" />
                </div>
              </div>

              {/* Info Overlay with Dynamic Styles */}
              <div 
                onMouseDown={() => setIsDraggingInfo(true)}
                onTouchStart={() => setIsDraggingInfo(true)}
                style={{ left: `${infoPos.x}%`, top: `${infoPos.y}%` }}
                className={`absolute max-w-[75%] rounded-2xl p-4 shadow-xl border cursor-move z-10 transition-transform ${selectedStyle.classes} ${isDraggingInfo ? 'scale-105 shadow-2xl ring-2 ring-accent' : ''}`}
              >
                <h4 className="font-black text-[10px] uppercase tracking-tight truncate leading-none">
                  {profile?.displayName || user?.displayName || "Aravalli Steel User"}
                </h4>
                <p className="text-[7px] font-bold uppercase tracking-wider opacity-80 flex items-center gap-1 mt-1 leading-none">
                  <MapPin className="w-2 h-2" /> {profile?.shippingAddress || "Main Workshop Area"}
                </p>
                <p className="text-[7px] font-bold uppercase tracking-wider opacity-80 flex items-center gap-1 mt-0.5 leading-none">
                  <Phone className="w-2 h-2" /> {profile?.phone || "999-999-9999"}
                </p>
              </div>
            </div>
          </div>

          <Card className="p-6 rounded-[2.5rem] border-none shadow-xl bg-white space-y-8">
            <div className="space-y-6">
              {/* Style Selection */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Palette className="w-3 h-3 text-accent" /> Box Ka Design
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {INFO_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={`p-3 rounded-xl border-2 text-[10px] font-black transition-all ${
                        selectedStyle.id === style.id ? "border-accent bg-accent/5 text-accent" : "border-muted text-muted-foreground"
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Position Sliders */}
              <div className="space-y-4 pt-4 border-t">
                <span className="text-[10px] font-black uppercase text-primary/40 tracking-widest flex items-center gap-2">
                  <Move className="w-3 h-3" /> Precision Adjustment
                </span>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[8px] font-black uppercase flex justify-between">
                      <span>Logo Position</span>
                      <span className="text-accent">{logoPos.x.toFixed(0)}% , {logoPos.y.toFixed(0)}%</span>
                    </Label>
                    <div className="space-y-4 pt-2">
                       <Slider value={[logoPos.x]} onValueChange={(val) => setLogoPos({...logoPos, x: val[0]})} max={90} step={1} />
                       <Slider value={[logoPos.y]} onValueChange={(val) => setLogoPos({...logoPos, y: val[0]})} max={90} step={1} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[8px] font-black uppercase flex justify-between">
                      <span>My Info Position</span>
                      <span className="text-accent">{infoPos.x.toFixed(0)}% , {infoPos.y.toFixed(0)}%</span>
                    </Label>
                    <div className="space-y-4 pt-2">
                       <Slider value={[infoPos.x]} onValueChange={(val) => setInfoPos({...infoPos, x: val[0]})} max={90} step={1} />
                       <Slider value={[infoPos.y]} onValueChange={(val) => setInfoPos({...infoPos, y: val[0]})} max={90} step={1} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Camera className="w-3 h-3 text-accent" /> Change Template
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {FESTIVAL_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-4 transition-all ${
                        selectedTemplate.id === tpl.id ? "border-accent scale-105 shadow-xl" : "border-transparent opacity-60"
                      }`}
                    >
                      <Image src={tpl.url} alt={tpl.title} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              onClick={sendWhatsApp}
              className="w-full h-16 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl font-black text-lg flex gap-3 shadow-xl shadow-[#25D366]/20 active:scale-95 transition-all"
            >
              <Send className="w-6 h-6" />
              Share on WhatsApp
            </Button>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
