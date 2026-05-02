
"use client"

import * as React from "react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
      <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mb-8 shadow-xl">
        <span className="text-white text-2xl font-black">AS</span>
      </div>
      <h1 className="text-4xl font-black text-primary mb-4 tracking-tighter">
        ARAVALLI <span className="text-accent">STEEL</span>
      </h1>
      <p className="text-muted-foreground text-lg max-w-md">
        App ab bilkul saaf hai. Aap apna naya idea batayiye, hum milkar shuruat karenge!
      </p>
      <div className="mt-12 grid grid-cols-1 gap-4 w-full max-w-xs">
        <div className="p-4 border-2 border-dashed border-muted rounded-2xl text-muted-foreground text-sm">
          Aapke naye instructions ka intezar hai...
        </div>
      </div>
    </div>
  )
}
