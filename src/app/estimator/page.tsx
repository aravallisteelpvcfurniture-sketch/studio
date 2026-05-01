
"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Download, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

export default function PriceEstimator() {
  const [area, setArea] = React.useState("100")
  const [material, setMaterial] = React.useState("pvc")
  const [estimate, setEstimate] = React.useState(0)

  const rates: Record<string, number> = {
    pvc: 1200,
    acrylic: 1800,
    laminate: 1000,
    metal: 2200
  }

  React.useEffect(() => {
    const calculated = parseInt(area || "0") * (rates[material] || 0)
    setEstimate(calculated)
  }, [area, material])

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-primary">Price Estimator</h1>
      </div>

      <div className="flex-1 space-y-8">
        <Card className="p-6 border-none shadow-xl bg-white rounded-3xl space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Area (Square Feet)</Label>
            <Input 
              type="number" 
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="h-12 text-lg rounded-xl"
              placeholder="e.g. 150"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Material Type</Label>
            <Select value={material} onValueChange={setMaterial}>
              <SelectTrigger className="h-12 rounded-xl text-lg">
                <SelectValue placeholder="Select Material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pvc">Premium PVC</SelectItem>
                <SelectItem value="acrylic">High Gloss Acrylic</SelectItem>
                <SelectItem value="laminate">Textured Laminate</SelectItem>
                <SelectItem value="metal">Stainless Steel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <div className="flex flex-col items-center justify-center py-12">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Tentative Budget</span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-accent">₹</span>
            <span className="text-6xl font-black text-primary tracking-tighter animate-in zoom-in-50 duration-500">
              {estimate.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-4 text-center max-w-[200px]">
            *Prices are tentative and may vary based on customization and site conditions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Button className="h-14 rounded-2xl bg-primary text-white font-bold text-lg flex gap-2">
          <Download className="w-5 h-5" />
          Download Estimate PDF
        </Button>
        <Button variant="ghost" className="h-14 rounded-2xl text-muted-foreground flex gap-2" onClick={() => {setArea("100"); setMaterial("pvc")}}>
          <RefreshCcw className="w-4 h-4" />
          Reset Calculator
        </Button>
      </div>
    </div>
  )
}
