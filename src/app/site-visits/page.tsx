
"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Plus, Ruler, MapPin, Phone, Calendar, Trash2, Loader2, CheckCircle2, MoreVertical, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFirestore, useCollection, useUser, useMemoFirebase } from "@/firebase"
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

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
    address: "",
    serviceType: "Kitchen",
    status: "New",
    notes: "",
    measurements: ""
  })

  const handleCreate = async () => {
    if (!db) return
    setLoading(true)
    try {
      await addDoc(collection(db, "siteVisits"), {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      toast({ title: "Visitor added successfully" })
      setIsModalOpen(false)
      setFormData({ customerName: "", phone: "", address: "", serviceType: "Kitchen", status: "New", notes: "", measurements: "" })
    } catch (e) {
      toast({ variant: "destructive", title: "Failed to add visitor" })
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
    toast({ title: `Status updated to ${newStatus}` })
  }

  const deleteVisit = async (visitId: string) => {
    if (!db) return
    if (!confirm("Are you sure you want to delete this record?")) return
    await deleteDoc(doc(db, "siteVisits", visitId))
    toast({ title: "Record deleted" })
  }

  if (isUserLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>
  if (!isAdmin) return <div className="p-20 text-center font-bold">Admin Access Only</div>

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-body">
      <div className="p-6 flex items-center justify-between bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-black text-primary">Visitor Manager</h1>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="rounded-full bg-accent text-white shadow-lg">
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2.5rem] w-[95%] max-w-md p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-primary">Add New Visitor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Name</Label>
                <Input value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="h-12 rounded-xl bg-muted/30 border-none" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Phone</Label>
                <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-12 rounded-xl bg-muted/30 border-none" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Address</Label>
                <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="h-12 rounded-xl bg-muted/30 border-none" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Service</Label>
                <Select value={formData.serviceType} onValueChange={v => setFormData({...formData, serviceType: v})}>
                  <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kitchen">Modular Kitchen</SelectItem>
                    <SelectItem value="Wardrobe">Wardrobe</SelectItem>
                    <SelectItem value="Paneling">Paneling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} disabled={loading} className="w-full h-14 rounded-2xl bg-accent font-black text-white">
                {loading ? <Loader2 className="animate-spin" /> : "Save Visitor"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" /></div>
          ) : visits && visits.length > 0 ? (
            visits.map((visit: any) => (
              <Card key={visit.id} className="p-0 border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-primary leading-none">{visit.customerName}</h3>
                      <p className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {visit.phone}
                      </p>
                    </div>
                    <Badge className={`rounded-full border-none px-3 py-1 text-[10px] font-black ${STATUS_COLORS[visit.status] || "bg-gray-100"}`}>
                      {visit.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-2xl">
                    <MapPin className="w-4 h-4 text-accent mt-0.5" />
                    <p className="text-xs font-medium text-primary/80">{visit.address || "No address added"}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="h-12 rounded-xl border-accent/20 text-accent font-bold flex gap-2">
                          <Ruler className="w-4 h-4" /> naap (Scale)
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-[2.5rem] w-[95%]">
                        <DialogHeader>
                          <DialogTitle className="font-black">Measurements for {visit.customerName}</DialogTitle>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                          <Textarea 
                            defaultValue={visit.measurements}
                            placeholder="Enter sizes (e.g. L: 10ft, H: 8ft...)"
                            className="min-h-[150px] rounded-2xl bg-muted/20 border-none"
                            onBlur={async (e) => {
                              await updateDoc(doc(db!, "siteVisits", visit.id), {
                                measurements: e.target.value,
                                status: "Measured"
                              })
                              toast({ title: "Measurements saved" })
                            }}
                          />
                          <p className="text-[10px] text-muted-foreground font-bold">Auto-saves on leave. Status will update to MEASURED.</p>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Select defaultValue={visit.status} onValueChange={(v) => updateStatus(visit.id, v)}>
                      <SelectTrigger className="h-12 rounded-xl bg-primary text-white font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(STATUS_COLORS).map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                      {visit.createdAt?.toDate() ? format(visit.createdAt.toDate(), "MMM dd, yyyy") : "Recent"}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => deleteVisit(visit.id)} className="text-destructive h-8 w-8 hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center opacity-30">
              <ClipboardList className="w-20 h-20 mb-4" />
              <p className="font-black">No visitors tracked yet</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
