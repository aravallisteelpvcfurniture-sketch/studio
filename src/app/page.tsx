
"use client"

import * as React from "react"
import { useUser } from "@/firebase"
import { useRouter } from "next/navigation"
import { 
  Bell, 
  Loader2, 
  Calculator, 
  Users, 
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem 
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { PlaceHolderImages } from "@/lib/placeholder-images"

export default function Home() {
  const { user, isUserLoading } = useUser()
  const router = useRouter()
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  )

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login")
    }
  }, [user, isUserLoading, router])

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    )
  }

  if (!user) return null

  const isAdmin = user.email === "aravallisteelpvcfurniture@gmail.com" || user.uid === "Qmcch2NXxmg47Zf28Wh0KTp9Njt1";

  const sliders = [
    { id: "slider-1", hint: "modern kitchen" },
    { id: "slider-2", hint: "luxury wardrobe" },
    { id: "slider-3", hint: "steel railing" },
    { id: "slider-4", hint: "wall paneling" },
    { id: "slider-5", hint: "home interior" },
  ]

  const launchers = [
    {
      title: "Estimate",
      icon: Calculator,
      href: "/estimator",
      color: "bg-blue-600"
    },
    {
      title: "Visitors",
      icon: Users,
      href: isAdmin ? "/site-visits" : "/book-consultation",
      color: "bg-green-600"
    },
    {
      title: "Greetings",
      icon: Sparkles,
      href: "/greetings",
      color: "bg-orange-600"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white font-body overflow-x-hidden pb-20">
      {/* Header Area */}
      <div className="p-8 pb-4 flex justify-between items-center animate-in fade-in duration-700">
        <h1 className="text-3xl font-black tracking-tighter uppercase text-white">Welcome</h1>
        
        <Link href={isAdmin ? "/notifications" : "/more"}>
          <Button variant="ghost" size="icon" className="rounded-2xl bg-white/5 border border-white/10 relative">
            <Bell className="w-5 h-5 text-white" />
            {isAdmin && <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full border border-black shadow-sm" />}
          </Button>
        </Link>
      </div>

      {/* Main Slider (Sticker Card Style) */}
      <div className="px-6 py-4">
        <Carousel 
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="-ml-4">
            {sliders.map((slide, idx) => {
              const img = PlaceHolderImages.find(i => i.id === slide.id)?.imageUrl || `https://picsum.photos/seed/${slide.id}/800/600`;
              return (
                <CarouselItem key={idx} className="pl-4 basis-[85%] md:basis-[60%]">
                  <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-white/5">
                    <Image 
                      src={img} 
                      alt="Interior Design" 
                      fill 
                      className="object-cover"
                      data-ai-hint={slide.hint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Horizontal Aadi Line Launchers */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-4 px-2">
          {launchers.map((item, idx) => (
            <Link key={idx} href={item.href} className="flex flex-col items-center gap-3 group shrink-0 active:scale-95 transition-all">
              <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center text-white shadow-xl ${item.color} group-hover:shadow-accent/20 border border-white/10`}>
                <item.icon className="w-7 h-7" />
              </div>
              <span className="text-[9px] font-black text-white/70 uppercase tracking-widest text-center">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Branding Footer */}
      <div className="mt-auto py-10 opacity-20 text-center">
        <p className="text-[7px] font-black uppercase tracking-[0.4em]">Aravalli Steel Industry</p>
      </div>
    </div>
  )
}
