
"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, PenTool, Send, Loader2, Lightbulb, CheckCircle2, Layout, Ruler, Box } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { generateDesignIdeas, type DesignIdeaGeneratorOutput } from "@/ai/flows/ai-design-idea-generator"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DrawingToolPage() {
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<DesignIdeaGeneratorOutput | null>(null)
  
  const [formData, setFormData] = React.useState({
    spaceType: "Railing Design",
    roomSize: "Custom",
    stylePreference: "2D Technical Drawing",
    colorPalette: ["Steel Grey", "Black"],
    specificRequirements: ""
  })

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Reusing the design flow but with drawing context
      const output = await generateDesignIdeas({
        ...formData,
        specificRequirements: `GENERATE A ${formData.stylePreference.toUpperCase()} FOR: ${formData.specificRequirements}. Focus on technical specs.`
      })
      setResult(output)
    } catch (error) {
      console.error("Drawing generation failed", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-6 flex items-center gap-4 bg-white/50 backdrop-blur-md sticky top-0 z-50 border-b">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-black text-primary flex items-center gap-2 uppercase tracking-tight">
          <PenTool className="w-5 h-5 text-accent" />
          Drawing Tool
        </h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {!result ? (
            <Card className="p-8 border-none shadow-2xl bg-white rounded-[3rem] space-y-8 animate-in slide-in-from-bottom-4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Drawing Subject</Label>
                  <Select value={formData.spaceType} onValueChange={(val) => setFormData({...formData, spaceType: val})}>
                    <SelectTrigger className="rounded-2xl h-14 bg-muted/30 border-none px-4 font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Railing Design">Railing Design</SelectItem>
                      <SelectItem value="Stairs Drawing">Stairs Drawing</SelectItem>
                      <SelectItem value="Modular Kitchen Plan">Modular Kitchen Plan</SelectItem>
                      <SelectItem value="Wall Paneling Plan">Wall Paneling Plan</SelectItem>
                      <SelectItem value="Full Interior Layout">Full Interior Layout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Output Format</Label>
                  <Select value={formData.stylePreference} onValueChange={(val) => setFormData({...formData, stylePreference: val})}>
                    <SelectTrigger className="rounded-2xl h-14 bg-muted/30 border-none px-4 font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2D Technical Drawing">2D Technical Drawing</SelectItem>
                      <SelectItem value="3D Realistic View">3D Realistic View</SelectItem>
                      <SelectItem value="Hand-Drawn Sketch">Hand-Drawn Sketch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Specifications</Label>
                  <Input 
                    value={formData.specificRequirements}
                    onChange={(e) => setFormData({...formData, specificRequirements: e.target.value})}
                    placeholder="e.g. Spiral stairs, SS 304 Railing" 
                    className="rounded-2xl h-14 bg-muted/30 border-none px-4 font-bold"
                  />
                </div>
              </div>

              <Button 
                onClick={handleSubmit} 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-[2rem] h-16 font-black text-lg flex gap-3 shadow-xl active:scale-95 transition-all"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <PenTool className="w-6 h-6" />}
                Generate Drawing
              </Button>
            </Card>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500 pb-20">
              <div className="space-y-2 text-center">
                <span className="text-accent text-[10px] font-black uppercase tracking-widest">Technical Drawing Generated</span>
                <h2 className="text-3xl font-black text-primary leading-tight uppercase tracking-tighter">{result.designConceptTitle}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{result.designOverview}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black flex items-center gap-2 text-primary uppercase tracking-widest">
                  <Ruler className="w-4 h-4 text-accent" />
                  Technical Specifications
                </h3>
                <div className="grid gap-3">
                  {result.designIdeas.map((idea, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-accent/10 flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                      <span className="text-sm font-medium text-primary/80">{idea}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black flex items-center gap-2 text-primary uppercase tracking-widest">
                  <Box className="w-4 h-4 text-accent" />
                  Visual Insight
                </h3>
                <div className="bg-primary p-6 rounded-[2.5rem] border border-primary/10 text-white shadow-xl shadow-primary/10">
                   <p className="text-xs text-white/80 leading-relaxed font-medium">
                     {result.visualDescription}
                   </p>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-16 rounded-[2rem] border-2 border-accent text-accent hover:bg-accent hover:text-white font-black text-lg"
                onClick={() => setResult(null)}
              >
                Create New Drawing
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
