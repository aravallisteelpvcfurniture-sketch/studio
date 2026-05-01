
"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ShieldCheck, Droplet, Zap, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlaceHolderImages } from "@/lib/placeholder-images"

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [activeColor, setActiveColor] = React.useState(0)
  const colors = ["#4A4A4D", "#26B2D9", "#F7F7F8", "#D1D5DB"]
  
  const productImg = PlaceHolderImages.find(i => i.id === params.id)?.imageUrl || "https://picsum.photos/seed/p1/800/1200"

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Main Image Section (60%) */}
      <div className="h-[60vh] relative">
        <Image
          src={productImg}
          alt="Product detail"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-6 left-6">
          <Link href="/categories">
            <Button variant="outline" size="icon" className="rounded-full bg-white/20 backdrop-blur-md border-white/30 text-white">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
        </div>
        <div className="absolute bottom-10 left-6">
          <Badge className="bg-accent text-white mb-2 border-none">BESTSELLER</Badge>
          <h1 className="text-3xl font-bold text-white shadow-sm">Premium Modular Setup</h1>
        </div>
      </div>

      {/* Floating Info Panel */}
      <div className="flex-1 bg-white -mt-8 rounded-t-[40px] relative z-20 shadow-2xl p-8 flex flex-col overflow-y-auto no-scrollbar">
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-8" />
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl mb-2">
              <Droplet size={20} />
            </div>
            <span className="text-[10px] font-bold text-primary">WATERPROOF</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl mb-2">
              <Zap size={20} />
            </div>
            <span className="text-[10px] font-bold text-primary">FIRE RETARDANT</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-green-50 text-green-500 rounded-2xl mb-2">
              <ShieldCheck size={20} />
            </div>
            <span className="text-[10px] font-bold text-primary">TERMITE PROOF</span>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Color Options</h3>
          <div className="flex gap-4">
            {colors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => setActiveColor(idx)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${activeColor === idx ? 'border-accent scale-110 shadow-lg' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl mb-12 flex justify-between items-center">
          <div>
            <h4 className="text-sm font-bold text-primary">Warranty</h4>
            <p className="text-xs text-muted-foreground">Comprehensive Manufacturer coverage</p>
          </div>
          <span className="text-xl font-bold text-accent">10 Years</span>
        </div>

        {/* Sticky Action Button Container - Spacer */}
        <div className="h-20" />
      </div>

      {/* Primary Action Button (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
        <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl h-14 text-lg font-bold flex gap-2">
          <MessageSquare className="w-6 h-6 fill-white" />
          Enquire on WhatsApp
        </Button>
      </div>
    </div>
  )
}
