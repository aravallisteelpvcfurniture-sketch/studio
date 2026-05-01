
"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Sparkles, Send, Loader2, Lightbulb, CheckCircle2 } from "lucide-react"
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
    spaceType: "modular kitchen",
    roomSize: "medium",
    stylePreference: "modern",
    colorPalette: ["white", "grey"],
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
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          AI Designer
        </h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {!result ? (
            <Card className="p-6 border-none shadow-xl bg-white rounded-3xl space-y-6 animate-in slide-in-from-bottom-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Space Type</Label>
                  <Select value={formData.spaceType} onValueChange={(val) => setFormData({...formData, spaceType: val})}>
                    <SelectTrigger className="rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modular kitchen">Modular Kitchen</SelectItem>
                      <SelectItem value="wardrobe system">Wardrobe System</SelectItem>
                      <SelectItem value="wall paneling">Wall Paneling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Style Preference</Label>
                  <Select value={formData.stylePreference} onValueChange={(val) => setFormData({...formData, stylePreference: val})}>
                    <SelectTrigger className="rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern Minimalist</SelectItem>
                      <SelectItem value="industrial">Industrial Chic</SelectItem>
                      <SelectItem value="traditional">Traditional Classic</SelectItem>
                      <SelectItem value="bohemian">Bohemian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Specific Requirements</Label>
                  <Input 
                    value={formData.specificRequirements}
                    onChange={(e) => setFormData({...formData, specificRequirements: e.target.value})}
                    placeholder="e.g. Maximize storage, add island" 
                    className="rounded-xl h-12"
                  />
                </div>
              </div>

              <Button 
                onClick={handleSubmit} 
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-white rounded-2xl h-14 font-bold flex gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Generate My Design
              </Button>
            </Card>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500 pb-20">
              <div className="space-y-2">
                <span className="text-accent text-xs font-black uppercase tracking-widest">Concept Generated</span>
                <h2 className="text-3xl font-black text-primary leading-tight">{result.designConceptTitle}</h2>
                <p className="text-muted-foreground leading-relaxed">{result.designOverview}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2 text-primary">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  Key Design Ideas
                </h3>
                <div className="grid gap-3">
                  {result.designIdeas.map((idea, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-accent/10 flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                      <span className="text-sm text-primary/80">{idea}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2 text-primary">
                  <Sparkles className="w-4 h-4 text-accent" />
                  Pro Implementation Tips
                </h3>
                <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                  <ul className="space-y-4">
                    {result.designTips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-primary/70 flex gap-2">
                        <span className="text-accent">•</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-14 rounded-2xl border-accent text-accent hover:bg-accent hover:text-white font-bold"
                onClick={() => setResult(null)}
              >
                Start New Consultation
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
