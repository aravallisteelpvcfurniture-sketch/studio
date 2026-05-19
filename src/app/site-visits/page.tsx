
"use client"

import * as React from "react"
import Link from "next/link"
import { 
  ChevronLeft, 
  Ruler, 
  Phone, 
  Trash2, 
  Loader2, 
  Settings2, 
  UserPlus, 
  X, 
  Save, 
  Briefcase, 
  Edit3, 
  Camera,
  CheckCircle2,
  Calendar,
  PenTool,
  Box,
  Layers,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useFirestore, useCollection, useUser, useMemoFirebase } from "@/firebase"
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateDesignIdeas } from "@/ai/flows/ai-design-idea-generator"

const STATUS_COLORS: Record<string, string> = {
  "New": "bg-blue-100 text-blue-700",
  "Scheduled": "bg-yellow-100 text-yellow-700",
  "Visited": "bg-purple-100 text-purple-700",
  "Measured": "bg-orange-100 text-orange-700",
  "Quoted": "bg-indigo-100 text-indigo-700",
  "Started": "bg-cyan-100 text-cyan-700",
  "Completed": "bg-green-100 text-green-700"
}

export default function SiteVisitManager() {
  const db = useFirestore()
  const { user, isUserLoading } = useUser()
  const { toast } = useToast()
  
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [selectedVisit, setSelectedVisit] = React.useState<any>(null)
  
  const [tempMeasurements, setTempMeasurements] = React.useState("")
  const [editFormData, setEditFormData] = React.useState<any>(null)
  const [designLoading, setDesignLoading] = React.useState(false)
  const [generatedDesign, setGeneratedDesign] = React.useState<any>(null)

  const isAdmin = React.useMemo(() => {
    if (!user || isUserLoading) return false;
    return user.email === "aravallisteelpvcfurniture@gmail.com" || user.uid === "Qmcch2NXxmg47Zf28Wh0KTp9Njt1";
  }, [user, isUserLoading]);

  const visitsQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null;
    return query(collection(db, "siteVisits"), orderBy("createdAt", "desc"));
  }, [db, isAdmin]);

  const { data: visits, isLoading } = useCollection(visitsQuery);

  const [formData, setFormData] = React.useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    serviceType: "Modular Kitchen",
    status: "New",
    notes: "",
    measurements: "",
    estimatedBudget: 0
  })

  const handleCreate = async () => {
    if (!db) return
    if (!formData.customerName || !formData.phone) {
      toast({ variant: "destructive", title: "Naam aur Phone zaroori hai" })
      return
    }
    setLoading(true)
    try {
      await addDoc(collection(db, "siteVisits"), {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      toast({ title: "Party details save ho gayi!" })
      setIsModalOpen(false)
      setFormData({ 
        customerName: "", 
        phone: "", 
        email: "", 
        address: "", 
        serviceType: "Modular Kitchen", 
        status: "New", 
        notes: "", 
        measurements: "", 
        estimatedBudget: 0 
      })
    } catch (e) {
      toast({ variant: "destructive", title: "Save failed" })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateDetails = async () => {
    if (!db || !selectedVisit || !editFormData) return
    setLoading(true)
    try {
      await updateDoc(doc(db, "siteVisits", selectedVisit.id), {
        ...editFormData,
        updatedAt: serverTimestamp()
      })
      toast({ title: "Details update ho gayi!" })
      setSelectedVisit((prev: any) => ({ ...prev, ...editFormData }))
    } catch (e) {
      toast({ variant: "destructive", title: "Update failed" })
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (visitId: string, newStatus: string) => {
    if (!db) return
    await updateDoc(doc(db, "siteVisits", visitId), {
      status: newStatus,
      updatedAt: serverTimestamp()
    })
    toast({ title: `Status updated: ${newStatus}` })
    setSelectedVisit((prev: any) => ({ ...prev, status: newStatus }))
  }

  const handleSaveNaap = async () => {
    if (!db || !selectedVisit) return
    setLoading(true)
    try {
      await updateDoc(doc(db, "siteVisits", selectedVisit.id), {
        measurements: tempMeasurements,
        status: "Measured",
        updatedAt: serverTimestamp()
      })
      toast({ title: "Naap save ho gaya!" })
      setSelectedVisit((prev: any) => ({ ...prev, measurements: tempMeasurements, status: "Measured" }))
    } catch (e) {
      toast({ variant: "destructive", title: "Save failed" })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateAIDesign = async (type: '2D' | '3D', category: string) => {
    if (!selectedVisit) return
    setDesignLoading(true)
    try {
      const result = await generateDesignIdeas({
        spaceType: category,
        roomSize: "Custom Site Size",
        stylePreference: "Modern " + type,
        colorPalette: ["Steel Grey", "Natural Wood"],
        specificRequirements: `Create a ${type} drawing for ${category}. Focus on ${selectedVisit.measurements || 'site specifications'}.`
      })
      setGeneratedDesign(result)
      toast({ title: `${type} Design Concept Ready!` })
    } catch (error) {
      toast({ variant: "destructive", title: "AI Design failed" })
    } finally {
      setDesignLoading(false)
    }
  }

  const deleteVisit = async (visitId: string) => {
    if (!db) return
    if(!confirm("Bhai, record delete kar dein?")) return
    await deleteDoc(doc(db, "siteVisits", visitId))
    toast({ title: "Record deleted" })
    setSelectedVisit(null)
  }

  React.useEffect(() => {
    if (selectedVisit) {
      setTempMeasurements(selectedVisit.measurements || "")
      setEditFormData({
        customerName: selectedVisit.customerName,
        phone: selectedVisit.phone,
        email: selectedVisit.email,
        serviceType: selectedVisit.serviceType
      })
      setGeneratedDesign(null)
    }
  }, [selectedVisit])

  if (isUserLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-accent" /></div>
  if (!isAdmin) return <div className="p-20 text-center font-bold">Admin Access Only</div>

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-body pb-24">
      <div className="p-6 flex items-center justify-between bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-black text-primary uppercase tracking-tight">Visitor Manager</h1>
        </div>
        
        <Button onClick={() => setIsModalOpen(true)} size="icon" className="rounded-full bg-accent text-white shadow-lg">
          <UserPlus className="w-6 h-6" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" /></div>
          ) : visits && visits.length > 0 ? (
            visits.map((visit: any) => (
              <Card 
                key={visit.id} 
                onClick={() => setSelectedVisit(visit)}
                className="p-6 border-none shadow-sm bg-white rounded-[2rem] active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-12 -mt-12 group-hover:bg-accent/10 transition-colors" />
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-primary leading-none uppercase tracking-tight">{visit.customerName}</h3>
                    <div className="flex flex-col gap-1 mt-2">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                        <Phone className="w-3 h-3 text-accent" /> {visit.phone}
                      </p>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-accent" /> {visit.serviceType}
                      </p>
                    </div>
                  </div>
                  <Badge className={`rounded-full border-none px-3 py-1 text-[8px] font-black ${STATUS_COLORS[visit.status] || "bg-gray-100"}`}>
                    {visit.status.toUpperCase()}
                  </Badge>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center opacity-30">
              <UserPlus className="w-20 h-20 mb-4" />
              <p className="font-black uppercase tracking-widest text-xs">No visitors found</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* NEW PARTY MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="rounded-[2.5rem] w-[95%] max-w-md p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-primary uppercase tracking-tighter">Nayi Party Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Party Name</Label>
              <Input placeholder="Bhai ka Naam..." value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="h-12 rounded-xl bg-muted/30 border-none px-4 font-bold" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Mobile Number</Label>
              <Input placeholder="9999999999" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-12 rounded-xl bg-muted/30 border-none px-4 font-bold" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Email Address</Label>
              <Input placeholder="party@email.com" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="h-12 rounded-xl bg-muted/30 border-none px-4 font-bold" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Kis kaam se aaye?</Label>
              <Select value={formData.serviceType} onValueChange={(val) => setFormData({...formData, serviceType: val})}>
                <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-none px-4 font-bold">
                  <SelectValue placeholder="Select Purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Modular Kitchen">Modular Kitchen</SelectItem>
                  <SelectItem value="Wardrobe System">Wardrobe System</SelectItem>
                  <SelectItem value="Wall Paneling">Wall Paneling</SelectItem>
                  <SelectItem value="Railing Design">Railing Design</SelectItem>
                  <SelectItem value="Stairs Drawing">Stairs Drawing</SelectItem>
                  <SelectItem value="Full Interior">Full Interior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreate} disabled={loading} className="w-full h-14 rounded-2xl bg-accent font-black text-white shadow-xl shadow-accent/20">
              {loading ? <Loader2 className="animate-spin" /> : "Party Save Karein"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PARTY MANAGEMENT TOOLS (5 ICONS) */}
      {selectedVisit && (
        <div className="fixed inset-0 z-[100] bg-white animate-in slide-in-from-bottom duration-300 flex flex-col">
          <div className="p-6 flex items-center justify-between border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Management Tools</span>
              <h2 className="text-xl font-black text-primary uppercase">{selectedVisit.customerName}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => deleteVisit(selectedVisit.id)} className="rounded-full text-destructive">
                <Trash2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setSelectedVisit(null)} className="rounded-full bg-gray-50">
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-8 grid grid-cols-2 gap-6 pb-24">
              {/* Tool 1: Edit Details */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="aspect-square bg-blue-50 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 border-2 border-blue-100 active:scale-95 transition-all shadow-sm">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-md">
                      <Edit3 className="w-8 h-8 text-blue-500" />
                    </div>
                    <span className="font-black text-blue-700 text-[10px] uppercase">Edit Details</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] w-[95%]">
                  <DialogHeader>
                    <DialogTitle className="font-black uppercase">Update Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-1">
                      <Label className="text-xs font-bold uppercase">Name</Label>
                      <Input value={editFormData?.customerName} onChange={e => setEditFormData({...editFormData, customerName: e.target.value})} className="h-12 rounded-xl bg-muted/30 border-none font-bold" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-bold uppercase">Phone</Label>
                      <Input value={editFormData?.phone} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} className="h-12 rounded-xl bg-muted/30 border-none font-bold" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-bold uppercase">Service</Label>
                      <Select value={editFormData?.serviceType} onValueChange={(val) => setEditFormData({...editFormData, serviceType: val})}>
                        <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-none font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Modular Kitchen">Modular Kitchen</SelectItem>
                          <SelectItem value="Wardrobe System">Wardrobe System</SelectItem>
                          <SelectItem value="Wall Paneling">Wall Paneling</SelectItem>
                          <SelectItem value="Railing Design">Railing Design</SelectItem>
                          <SelectItem value="Stairs Drawing">Stairs Drawing</SelectItem>
                          <SelectItem value="Full Interior">Full Interior</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleUpdateDetails} disabled={loading} className="w-full h-14 bg-blue-600 text-white font-bold rounded-2xl shadow-lg">Save Changes</Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Tool 2: Naap (Measurement) */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="aspect-square bg-orange-50 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 border-2 border-orange-100 active:scale-95 transition-all shadow-sm">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-md">
                      <Ruler className="w-8 h-8 text-orange-500" />
                    </div>
                    <span className="font-black text-orange-700 text-[10px] uppercase">Naap / Size</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] w-[95%]">
                  <DialogHeader>
                    <DialogTitle className="font-black uppercase">Measurement Data</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea 
                      value={tempMeasurements}
                      onChange={(e) => setTempMeasurements(e.target.value)}
                      placeholder="Kitchen L-Shape: 10x8ft, PVC 18mm..."
                      className="min-h-[200px] rounded-2xl bg-muted/30 border-none p-4 font-bold"
                    />
                    <Button onClick={handleSaveNaap} disabled={loading} className="w-full h-14 bg-accent text-white font-bold rounded-2xl flex gap-2 shadow-lg">
                      <Save className="w-4 h-4" /> Save Naap
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Tool 3: Status */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="aspect-square bg-green-50 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 border-2 border-green-100 active:scale-95 transition-all shadow-sm">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-md">
                      <Settings2 className="w-8 h-8 text-green-500" />
                    </div>
                    <span className="font-black text-green-700 text-[10px] uppercase">Kaam Status</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] w-[95%]">
                  <DialogHeader>
                    <DialogTitle className="font-black uppercase">Update Status</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-3 py-4">
                    {Object.keys(STATUS_COLORS).map(s => (
                      <Button 
                        key={s} 
                        onClick={() => updateStatus(selectedVisit.id, s)}
                        variant={selectedVisit.status === s ? "default" : "outline"}
                        className="h-12 rounded-xl font-black uppercase text-xs"
                      >
                        {selectedVisit.status === s && <CheckCircle2 className="w-4 h-4 mr-2" />}
                        {s}
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Tool 4: Photos */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="aspect-square bg-purple-50 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 border-2 border-purple-100 active:scale-95 transition-all shadow-sm">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-md">
                      <Camera className="w-8 h-8 text-purple-500" />
                    </div>
                    <span className="font-black text-purple-700 text-[10px] uppercase">Site Photos</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] w-[95%]">
                  <DialogHeader>
                    <DialogTitle className="font-black uppercase">Site Photos</DialogTitle>
                  </DialogHeader>
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                      <Camera className="w-10 h-10" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest">Coming Soon!</p>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Tool 5: AI Design Drawing (2D/3D) */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="aspect-square bg-primary/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 border-2 border-primary/10 active:scale-95 transition-all shadow-sm group">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-md">
                      <PenTool className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
                    </div>
                    <span className="font-black text-primary text-[10px] uppercase">Design Studio</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-[3rem] w-[95%] max-h-[85vh] overflow-y-auto no-scrollbar">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-primary flex items-center gap-2 uppercase tracking-tight">
                      <Sparkles className="w-6 h-6 text-accent" />
                      Design Studio
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6 py-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        onClick={() => handleGenerateAIDesign('2D', selectedVisit.serviceType)} 
                        disabled={designLoading}
                        variant="outline" 
                        className="h-24 rounded-3xl flex flex-col gap-2 border-2 border-accent/20 bg-accent/5"
                      >
                        <Layers className="w-6 h-6 text-accent" />
                        <span className="font-black text-[10px] uppercase">2D Drawing</span>
                      </Button>
                      <Button 
                        onClick={() => handleGenerateAIDesign('3D', selectedVisit.serviceType)} 
                        disabled={designLoading}
                        variant="outline" 
                        className="h-24 rounded-3xl flex flex-col gap-2 border-2 border-blue-200 bg-blue-50"
                      >
                        <Box className="w-6 h-6 text-blue-600" />
                        <span className="font-black text-[10px] uppercase">3D Realistic</span>
                      </Button>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-2xl border border-dashed border-muted">
                      <h4 className="text-[10px] font-black uppercase text-muted-foreground mb-3 tracking-widest">Drawing Subject</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Stairs', 'Railing', 'Kitchen', 'Wardrobe', 'Ceiling'].map(cat => (
                          <Badge key={cat} variant="secondary" className="px-3 py-1 font-bold text-[9px] uppercase">{cat}</Badge>
                        ))}
                      </div>
                    </div>

                    {designLoading && (
                      <div className="flex flex-col items-center py-12 gap-4 animate-pulse">
                        <div className="w-16 h-16 rounded-full border-4 border-accent border-t-transparent animate-spin" />
                        <p className="font-black text-sm uppercase tracking-widest text-accent">Generating Drawing...</p>
                      </div>
                    )}

                    {generatedDesign && (
                      <div className="space-y-4 animate-in zoom-in-95 duration-500">
                        <div className="bg-primary p-6 rounded-[2.5rem] text-white">
                          <h4 className="text-lg font-black uppercase mb-2">{generatedDesign.designConceptTitle}</h4>
                          <p className="text-white/70 text-xs leading-relaxed">{generatedDesign.designOverview}</p>
                        </div>
                        <div className="grid gap-2">
                          {generatedDesign.designIdeas.slice(0, 3).map((idea: string, i: number) => (
                            <div key={i} className="flex gap-2 text-[10px] font-bold text-primary/80 bg-muted/50 p-3 rounded-xl border border-muted">
                              <span className="text-accent">•</span> {idea}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </ScrollArea>

          <div className="p-8 bg-gray-50 border-t space-y-4 sticky bottom-0 z-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-primary/60">
                <Phone className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">{selectedVisit.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-primary/60">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">{selectedVisit.createdAt?.toDate ? format(selectedVisit.createdAt.toDate(), "dd MMM") : "Recent"}</span>
              </div>
            </div>
            <a href={`tel:${selectedVisit.phone}`} className="block">
              <Button className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-tight shadow-xl shadow-primary/10 active:scale-95 transition-all">
                Call Party Now
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

