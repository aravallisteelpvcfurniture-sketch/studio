
"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Download, RefreshCcw, Calculator, Zap, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const RATES: Record<string, number> = {
  "PVC Premium": 1200,
  "PVC Standard": 950,
  "Acrylic High Gloss": 1800,
  "Textured Laminate": 1050,
  "Stainless Steel": 2200,
  "WPC Wall Panel": 450,
}

export default function PriceEstimator() {
  const [area, setArea] = React.useState("100")
  const [material, setMaterial] = React.useState("PVC Premium")
  const [estimate, setEstimate] = React.useState(0)

  React.useEffect(() => {
    const calculated = parseInt(area || "0") * (RATES[material] || 0)
    setEstimate(calculated)
  }, [area, material])

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-body">
      <div className="p-6 flex items-center gap-4 bg-white border-b sticky top-0 z-50">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-black text-primary flex items-center gap-2 uppercase tracking-tight">
          <Calculator className="w-5 h-5 text-accent" />
          Estimate Tool
        </h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          <Card className="p-8 border-none shadow-2xl bg-white rounded-[3rem] space-y-8 animate-in slide-in-from-bottom-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1 flex items-center gap-2">
                  <Ruler className="w-3 h-3 text-accent" /> Area (Square Feet)
                </Label>
                <Input 
                  type="number" 
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="h-14 rounded-2xl bg-muted/30 border-none px-6 font-bold text-lg"
                  placeholder="e.g. 150"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-accent" /> Material Quality
                </Label>
                <Select value={material} onValueChange={setMaterial}>
                  <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none px-6 font-bold">
                    <SelectValue placeholder="Select Material" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {Object.keys(RATES).map((m) => (
                      <SelectItem key={m} value={m} className="font-bold">{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-[2.5rem] border border-primary/10 flex flex-col items-center text-center">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Tentative Budget</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-accent">₹</span>
                <span className="text-6xl font-black text-primary tracking-tighter">
                  {estimate.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-4 font-bold uppercase leading-tight max-w-[200px]">
                *Actual price may vary based on customization and fittings.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button className="h-14 rounded-2xl bg-accent text-white font-black text-lg flex gap-2 shadow-xl shadow-accent/20 active:scale-95 transition-all">
                <Download className="w-5 h-5" />
                Get PDF Quote
              </Button>
              <Button 
                variant="ghost" 
                className="h-12 rounded-2xl text-muted-foreground font-black uppercase tracking-widest text-xs flex gap-2" 
                onClick={() => {setArea("100"); setMaterial("PVC Premium")}}
              >
                <RefreshCcw className="w-4 h-4" />
                Reset Calculation
              </Button>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
