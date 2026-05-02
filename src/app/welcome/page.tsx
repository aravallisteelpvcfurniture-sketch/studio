
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck, Sparkles, Star } from "lucide-react"
import Image from "next/image"

export default function WelcomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-primary flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-20%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-20%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-12 relative z-10">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl rotate-3">
            <span className="text-primary text-4xl font-black tracking-tighter">AS</span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white leading-tight tracking-tighter">
              ARAVALLI<br />
              <span className="text-accent underline decoration-white/20 underline-offset-8">STEEL</span>
            </h1>
            <p className="text-white/60 text-lg font-medium max-w-[280px] mx-auto">
              Excellence in Modular Steel Solutions Since 1998.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 w-full max-w-xs animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <ShieldCheck className="text-accent w-6 h-6" />
            <span className="text-white text-xs font-bold uppercase tracking-widest text-left">10 Years Warranty</span>
          </div>
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <Sparkles className="text-accent w-6 h-6" />
            <span className="text-white text-xs font-bold uppercase tracking-widest text-left">Premium Quality Steel</span>
          </div>
        </div>
      </div>

      <div className="p-8 pb-16 relative z-10 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
        <Button 
          onClick={() => router.push("/login")}
          className="w-full h-18 bg-accent hover:bg-accent/90 text-white rounded-[2rem] text-xl font-black flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(241,90,36,0.5)] transition-all active:scale-95"
        >
          Get Started
          <ArrowRight className="w-6 h-6" />
        </Button>
        <p className="text-center text-white/30 text-[10px] mt-8 font-bold tracking-[0.2em] uppercase">
          Trusted by 10,000+ Happy Customers
        </p>
      </div>
    </div>
  )
}
