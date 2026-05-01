
"use client"

import * as React from "react"
import Link from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react"
import Image from "next/image"

export default function WelcomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-primary flex flex-col relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://picsum.photos/seed/welcome/1200/1800" 
          alt="Luxury Interior" 
          fill 
          className="object-cover opacity-40 scale-110 animate-pulse-slow"
          data-ai-hint="luxury interior"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/60 to-primary" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-end p-8 pb-16">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="w-16 h-16 bg-accent rounded-3xl flex items-center justify-center shadow-2xl rotate-3">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tighter">
              DESIGN YOUR <br />
              <span className="text-accent">DREAM SPACE</span>
            </h1>
            <p className="text-white/70 text-lg font-medium max-w-[280px]">
              Premium modular kitchens and wardrobes tailored for your lifestyle.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 text-white/90">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <span className="text-sm font-bold">10 Years Warranty</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <span className="text-sm font-bold">AI Powered Design Suggestions</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <span className="text-sm font-bold">Certified High-Grade Steel</span>
            </div>
          </div>

          <div className="pt-8">
            <Button 
              onClick={() => router.push("/login")}
              className="w-full h-16 bg-accent hover:bg-accent/90 text-white rounded-[2rem] text-xl font-black flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95"
            >
              Get Started
              <ArrowRight className="w-6 h-6" />
            </Button>
            <p className="text-center text-white/40 text-xs mt-6 font-bold tracking-widest uppercase">
              Experience Excellence since 1998
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1.1); }
          50% { transform: scale(1.15); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 20s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}
