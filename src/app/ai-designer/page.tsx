
"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Sparkles, Send, Loader2, Lightbulb, CheckCircle2, Box, Layers, Layout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { generateDesignIdeas, type DesignIdeaGeneratorOutput } from "@/ai/flows/ai-design-idea-generator"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AIDesigner() {
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<DesignIdeaGeneratorOutput | null>(null)
  
  const [formData, setFormData] = React.useState({
    spaceType: "Modular Kitchen",
    roomSize: "Medium",
    stylePreference: "Modern 3D Realistic",
    colorPalette: ["Steel Grey", "Natural Wood"],
    specificRequirements: ""
  })

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const output = await generateDesignIdeas(formData)
      setResult(output)
    } catch (error) {
      console.error("AI Generation failed", error)
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
          <Sparkles className="w-5 h-5 text-accent" />
          Design Studio
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
                      <SelectItem value="Modular Kitchen">Modular Kitchen</SelectItem>
                      <SelectItem value="Wardrobe System">Wardrobe System</SelectItem>
                      <SelectItem value="Wall Paneling">Wall Paneling</SelectItem>
                      <SelectItem value="Railing Design">Railing Design</SelectItem>
                      <SelectItem value="Stairs Drawing">Stairs Drawing</SelectItem>
                      <SelectItem value="Full Interior">Home Interior</SelectItem>
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
                      <SelectItem value="Modern 3D Realistic">3D Realistic View</SelectItem>
                      <SelectItem value="Minimalist Sketch">Minimalist Sketch</SelectItem>
                      <SelectItem value="Luxury Concept">Premium Luxury View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Specific Requirements</Label>
                  <Input 
                    value={formData.specificRequirements}
                    onChange={(e) => setFormData({...formData, specificRequirements: e.target.value})}
                    placeholder="e.g. Spiral stairs, Glass railing" 
                    className="rounded-2xl h-14 bg-muted/30 border-none px-4 font-bold"
                  />
                </div>
              </div>

              <Button 
                onClick={handleSubmit} 
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-white rounded-[2rem] h-16 font-black text-lg flex gap-3 shadow-xl shadow-accent/20 active:scale-95 transition-all"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                Generate Design
              </Button>
            </Card>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500 pb-20">
              <div className="space-y-2 text-center">
                <span className="text-accent text-[10px] font-black uppercase tracking-widest">Concept Generated</span>
                <h2 className="text-3xl font-black text-primary leading-tight uppercase tracking-tighter">{result.designConceptTitle}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{result.designOverview}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black flex items-center gap-2 text-primary uppercase tracking-widest">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  Drawing Specifications
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
                  <Sparkles className="w-4 h-4 text-accent" />
                  Implementation Tips
                </h3>
                <div className="bg-primary p-6 rounded-[2.5rem] border border-primary/10 text-white shadow-xl shadow-primary/10">
                  <ul className="space-y-4">
                    {result.designTips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-white/80 font-medium flex gap-2">
                        <span className="text-accent font-black">•</span> {tip}
                      </li>
                    ))}
                  </ul>
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
