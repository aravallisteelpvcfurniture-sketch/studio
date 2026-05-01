
"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Download, 
  Calculator, 
  View, 
  MapPin, 
  ChevronRight,
  Sparkles,
  MoreVertical,
  X,
  Phone,
  Info,
  Images,
  Award,
  ArrowRight
} from "lucide-react"
import { TopBar } from "@/components/TopBar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem 
} from "@/components/ui/carousel"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import Autoplay from "embla-carousel-autoplay"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const quickActions = [
    { icon: <Download />, label: "Catalog", color: "bg-blue-50 text-blue-600", href: "#" },
    { icon: <Calculator />, label: "Price Est.", color: "bg-cyan-50 text-accent", href: "/estimator" },
    { icon: <View />, label: "360 Tour", color: "bg-purple-50 text-purple-600", href: "#" },
    { icon: <MapPin />, label: "Dealers", color: "bg-green-50 text-green-600", href: "#" },
  ]

  const heroImages = PlaceHolderImages.filter(img => img.id.startsWith('hero'))

  return (
    <main className="relative min-h-screen bg-background pt-16 flex flex-col">
      <TopBar onMenuClick={() => setIsMenuOpen(true)} />

      {/* Hero Slider */}
      <section className="flex-1 max-h-[45vh] relative overflow-hidden">
        <Carousel 
          plugins={[Autoplay({ delay: 4000 })]} 
          className="w-full h-full"
          opts={{ loop: true }}
        >
          <CarouselContent>
            {heroImages.map((img) => (
              <CarouselItem key={img.id} className="relative h-[45vh]">
                <Image
                  src={img.imageUrl}
                  alt={img.description}
                  fill
                  className="object-cover"
                  priority
                  data-ai-hint={img.imageHint}
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-10 left-6 text-white max-w-[80%]">
                  <h2 className="text-3xl font-bold mb-2">{img.description}</h2>
                  <p className="text-white/80 text-sm">Experience the premium modular lifestyle.</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Quick Actions */}
      <section className="px-6 -mt-6 relative z-10 grid grid-cols-4 gap-4">
        {quickActions.map((action, idx) => (
          <Link key={idx} href={action.href}>
            <Card className="flex flex-col items-center justify-center p-4 h-24 hover:shadow-lg transition-shadow bg-white border-none">
              <div className={`p-3 rounded-full ${action.color} mb-2`}>
                {React.cloneElement(action.icon as React.ReactElement, { size: 20 })}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{action.label}</span>
            </Card>
          </Link>
        ))}
      </section>

      {/* Explore Section */}
      <section className="px-6 py-8 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-primary">Discover Design</h3>
          <Link href="/categories" className="text-accent text-sm font-bold flex items-center">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <Link href="/ai-designer">
          <div className="bg-primary p-6 rounded-3xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-20 h-20" />
            </div>
            <h4 className="text-lg font-bold mb-2">AI Design Assistant</h4>
            <p className="text-white/70 text-sm mb-4">Get personalized design ideas for your space in seconds.</p>
            <Button className="bg-accent hover:bg-accent/90 text-white rounded-full px-6 border-none">
              Try GenAI
            </Button>
          </div>
        </Link>
      </section>

      {/* Navigation Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-primary text-white p-8 flex flex-col animate-in fade-in slide-in-from-right duration-300">
          <div className="flex justify-between items-center mb-12">
            <span className="text-xl font-bold">Menu</span>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} className="text-white">
              <X className="w-8 h-8" />
            </Button>
          </div>
          <nav className="flex flex-col gap-8 text-2xl font-light">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between group">
              <span>Home</span> <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/categories" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between group">
              <span>Categories</span> <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/estimator" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between group">
              <span>Price Estimator</span> <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/ai-designer" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between group">
              <span>AI Design Ideas</span> <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </nav>

          <div className="mt-auto grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4 text-white/70 text-sm p-3 border border-white/10 rounded-xl">
              <Award className="w-5 h-5 text-accent" />
              <span>ISO 9001:2015 Certified</span>
            </div>
            <div className="flex items-center gap-4 text-white/70 text-sm p-3 border border-white/10 rounded-xl">
              <Phone className="w-5 h-5 text-accent" />
              <span>Support: +91 99999 00000</span>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
