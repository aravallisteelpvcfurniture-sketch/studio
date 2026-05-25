
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ChevronLeft, 
  MessageSquareHeart, 
  Send, 
  Camera,
  RotateCcw,
  MapPin,
  Phone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { PlaceHolderImages } from "@/lib/placeholder-images"

const FESTIVAL_TEMPLATES = [
  { id: "diwali", title: "Diwali Special", url: "https://picsum.photos/seed/diwali/800/800", hint: "diwali festival" },
  { id: "holi", title: "Holi Greetings", url: "https://picsum.photos/seed/holi/800/800", hint: "holi festival" },
  { id: "rakhi", title: "Raksha Bandhan", url: "https://picsum.photos/seed/rakhi/800/800", hint: "rakhi festival" },
  { id: "ganesh", title: "Ganesh Chaturthi", url: "https://picsum.photos/seed/ganesh/800/800", hint: "ganesh festival" },
  { id: "independence", title: "Independence Day", url: "https://picsum.photos/seed/india/800/800", hint: "india flag" },
  { id: "republic", title: "Republic Day", url: "https://picsum.photos/seed/republic/800/800", hint: "india celebration" },
  { id: "ramnavami", title: "Ram Navami", url: "https://picsum.photos/seed/rama/800/800", hint: "lord rama" },
  { id: "janmashtami", title: "Janmashtami", url: "https://picsum.photos/seed/krishna/800/800", hint: "lord krishna" },
]

export default function GreetingsTool() {
  const db = useFirestore()
  const { user } = useUser()
  const [selectedTemplate, setSelectedTemplate] = React.useState(FESTIVAL_TEMPLATES[0])
  
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
    <div className="min-h-screen bg-background flex flex-col font-body pb-24 select-none">
      <div className="p-6 flex items-center gap-4 bg-white border-b sticky top-0 z-50">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-black text-primary uppercase tracking-tight flex items-center gap-2">
          <MessageSquareHeart className="w-5 h-5 text-accent" />
          Live Greetings
        </h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Poster par ungli se drag karein
              </Label>
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
              className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-gray-100 touch-none"
            >
              <Image 
                src={selectedTemplate.url} 
                alt="Template" 
                fill 
                className="object-cover select-none pointer-events-none"
                data-ai-hint={selectedTemplate.hint}
              />

              <div 
                onMouseDown={() => setIsDraggingLogo(true)}
                onTouchStart={() => setIsDraggingLogo(true)}
                style={{ left: `${logoPos.x}%`, top: `${logoPos.y}%` }}
                className={`absolute w-16 h-16 bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-lg flex items-center justify-center cursor-move border border-white/50 z-20 transition-transform ${isDraggingLogo ? 'scale-110' : ''}`}
              >
                <Image src={logoImg} alt="Logo" width={50} height={50} className="object-contain pointer-events-none" />
              </div>

              <div 
                onMouseDown={() => setIsDraggingInfo(true)}
                onTouchStart={() => setIsDraggingInfo(true)}
                style={{ left: `${infoPos.x}%`, top: `${infoPos.y}%` }}
                className={`absolute max-w-[80%] rounded-2xl p-4 shadow-xl border cursor-move z-10 transition-transform bg-black/40 backdrop-blur-md text-white border-white/20 ${isDraggingInfo ? 'scale-105' : ''}`}
              >
                <h4 className="font-black text-[11px] uppercase tracking-tight truncate leading-none">
                  {profile?.displayName || user?.displayName || "Aravalli Steel User"}
                </h4>
                <p className="text-[8px] font-bold uppercase tracking-wider opacity-80 flex items-center gap-1 mt-1.5 leading-none">
                  <MapPin className="w-2.5 h-2.5" /> {profile?.shippingAddress || "Main Workshop"}
                </p>
                <p className="text-[8px] font-bold uppercase tracking-wider opacity-80 flex items-center gap-1 mt-1 leading-none">
                  <Phone className="w-2.5 h-2.5" /> {profile?.phone || "999-999-9999"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 ml-2">
              <Camera className="w-3 h-3 text-accent" /> Select Indian Festival Template
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {FESTIVAL_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`relative aspect-square rounded-[2rem] overflow-hidden border-4 transition-all active:scale-95 ${
                    selectedTemplate.id === tpl.id ? "border-accent shadow-xl" : "border-transparent opacity-80"
                  }`}
                >
                  <Image src={tpl.url} alt={tpl.title} fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 text-left">
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">{tpl.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={sendWhatsApp}
            className="w-full h-16 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-[2rem] font-black text-lg flex gap-3 shadow-xl shadow-[#25D366]/20 active:scale-95 transition-all"
          >
            <Send className="w-6 h-6" />
            WhatsApp Par Bhejein
          </Button>
        </div>
      </ScrollArea>
    </div>
  )
}
