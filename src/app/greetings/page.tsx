
"use client"

import * as React from "react"
import Link from "next/link"
import { 
  ChevronLeft, 
  MessageSquareHeart, 
  Send, 
  User, 
  Phone, 
  Sparkles, 
  Heart, 
  Calendar, 
  Loader2 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFirestore, useCollection, useUser, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TEMPLATES = [
  {
    id: "welcome",
    title: "Welcome Greeting",
    icon: Sparkles,
    content: (name: string) => `Namaste ${name} ji, Aravalli Steel PVC Furniture mein aapka swagat hai! Hum aapke sapno ke ghar ko sajane ke liye taiyaar hain. Best Modular Kitchen aur Wardrobes ke liye humein call karein.`
  },
  {
    id: "followup",
    title: "Site Visit Follow-up",
    icon: Calendar,
    content: (name: string) => `Hello ${name} ji, Aravalli Steel se baat kar rahe hain. Aapke site visit ke bare mein kya update hai? Humne aapke liye kuch special designs taiyaar kiye hain.`
  },
  {
    id: "festival",
    title: "Festival Wishes",
    icon: Heart,
    content: (name: string) => `Namaste ${name} ji, Aravalli Steel ki taraf se aapko aur aapke parivaar ko tyohaar ki hardik shubhkamnayein! Khush rahiye, swasth rahiye.`
  }
]

export default function GreetingsTool() {
  const db = useFirestore()
  const { user } = useUser()
  const [selectedParty, setSelectedParty] = React.useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = React.useState(TEMPLATES[0])

  const visitsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "siteVisits"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: parties, isLoading } = useCollection(visitsQuery);

  const sendWhatsApp = () => {
    if (!selectedParty) return;
    const message = selectedTemplate.content(selectedParty.customerName);
    const url = `https://wa.me/${selectedParty.phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-body pb-24">
      <div className="p-6 flex items-center gap-4 bg-white border-b sticky top-0 z-50">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-black text-primary uppercase tracking-tight flex items-center gap-2">
          <MessageSquareHeart className="w-5 h-5 text-accent" />
          Greetings Tool
        </h1>
      </div>

      <div className="flex-1 p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">1. Select Party (Customer)</h3>
          <ScrollArea className="h-48 rounded-[2rem] border bg-white shadow-sm">
            <div className="p-4 space-y-2">
              {isLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-accent" /></div>
              ) : parties && parties.length > 0 ? (
                parties.map((party: any) => (
                  <button
                    key={party.id}
                    onClick={() => setSelectedParty(party)}
                    className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all border ${
                      selectedParty?.id === party.id 
                      ? "bg-accent/10 border-accent shadow-sm" 
                      : "bg-white border-transparent hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedParty?.id === party.id ? "bg-accent text-white" : "bg-gray-100 text-gray-400"}`}>
                        <User className="w-4 h-4" />
                      </div>
                      <span className={`font-bold text-xs uppercase ${selectedParty?.id === party.id ? "text-accent" : "text-primary"}`}>
                        {party.customerName}
                      </span>
                    </div>
                    <Phone className="w-3 h-3 text-muted-foreground opacity-50" />
                  </button>
                ))
              ) : (
                <p className="text-center text-[10px] text-muted-foreground py-8 font-bold uppercase tracking-widest">No Parties Found</p>
              )}
            </div>
          </ScrollArea>
        </div>

        {selectedParty && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">2. Choose Template</h3>
              <div className="grid grid-cols-3 gap-2">
                {TEMPLATES.map((tpl) => {
                  const Icon = tpl.icon;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl)}
                      className={`p-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${
                        selectedTemplate.id === tpl.id
                        ? "bg-primary text-white border-primary shadow-lg"
                        : "bg-white text-muted-foreground border-transparent shadow-sm"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[8px] font-black uppercase text-center">{tpl.title}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <Card className="p-6 rounded-[2.5rem] bg-white border-none shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-accent tracking-widest">Message Preview</span>
              </div>
              <div className="bg-muted/30 p-6 rounded-2xl border border-dashed border-accent/20">
                <p className="text-sm font-medium text-primary leading-relaxed italic">
                  "{selectedTemplate.content(selectedParty.customerName)}"
                </p>
              </div>
              <Button 
                onClick={sendWhatsApp}
                className="w-full h-16 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-[1.5rem] font-black text-lg flex gap-3 shadow-xl shadow-[#25D366]/20 active:scale-95 transition-all"
              >
                <Send className="w-6 h-6" />
                Send via WhatsApp
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
