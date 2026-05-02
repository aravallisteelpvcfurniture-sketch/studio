
"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Bell, User, Clock, MessageCircle, Phone, Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFirestore, useCollection, useUser, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"
import { formatDistanceToNow } from "date-fns"

export default function NotificationsPage() {
  const db = useFirestore()
  const { user, isUserLoading } = useUser()

  // Strict Admin Check
  const isAdmin = React.useMemo(() => {
    if (!user || isUserLoading) return false;
    return user.email === "aravallisteelpvcfurniture@gmail.com" || user.uid === "Qmcch2NXxmg47Zf28Wh0KTp9Njt1";
  }, [user, isUserLoading]);

  // Simplified query for inquiries
  const notificationsQuery = useMemoFirebase(() => {
    if (!db) return null
    // We only load this for the admin to keep the list clean
    if (!isAdmin && !isUserLoading) return null
    
    return query(
      collection(db, "quoteRequests"),
      orderBy("createdAt", "desc"),
      limit(30)
    )
  }, [db, isAdmin, isUserLoading])

  const { data: requests, isLoading } = useCollection(notificationsQuery)

  const sendEmail = (req: any) => {
    const subject = encodeURIComponent(`New Inquiry: ${req.serviceType} from ${req.name}`)
    const body = encodeURIComponent(
      `Hello Admin,\n\nA new inquiry has been received:\n\n` +
      `Customer Name: ${req.name}\n` +
      `Service: ${req.serviceType}\n` +
      `Phone: ${req.phone}\n` +
      `Email: ${req.email}\n` +
      `Message: ${req.message || "No message provided"}\n\n` +
      `Please contact the customer as soon as possible.`
    )
    window.location.href = `mailto:aravallisteelpvcfurniture@gmail.com?subject=${subject}&body=${body}`
  }

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    )
  }

  // If not admin, show unauthorized but don't crash
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <Bell className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-black mb-4">Admin Access Only</h2>
        <p className="text-muted-foreground mb-8 text-sm">Please login with the administrator account to manage inquiries.</p>
        <Link href="/login">
          <Button className="rounded-xl px-8 h-12 bg-primary">Go to Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-6 flex items-center justify-between bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-primary">Inquiry Manager</h1>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-muted-foreground uppercase tracking-widest">Customer Requests</h2>
            <span className="bg-accent/10 text-accent text-[10px] font-bold px-3 py-1 rounded-full">
              {requests?.length || 0} Total
            </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-accent" />
              <p className="text-sm font-bold text-muted-foreground">Fetching latest data...</p>
            </div>
          ) : requests && requests.length > 0 ? (
            requests.map((req: any) => (
              <Card key={req.id} className="p-0 border-none shadow-xl bg-white rounded-[2rem] overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="p-4 bg-accent/10 rounded-2xl shrink-0">
                        <User className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-primary">{req.name}</h3>
                        <p className="text-xs text-muted-foreground font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {req.createdAt?.toDate ? formatDistanceToNow(req.createdAt.toDate(), { addSuffix: true }) : "Just now"}
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                      {req.status || "Pending"}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 py-4 border-y border-dashed">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Service</span>
                      <p className="text-sm font-bold text-primary flex items-center gap-2">
                        <MessageCircle className="w-3 h-3 text-accent" /> {req.serviceType}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Contact</span>
                      <p className="text-sm font-bold text-primary flex items-center gap-2">
                        <Phone className="w-3 h-3 text-accent" /> {req.phone}
                      </p>
                    </div>
                  </div>

                  {req.message && (
                    <div className="p-4 bg-muted/30 rounded-xl">
                       <p className="text-xs text-primary/70 leading-relaxed italic">"{req.message}"</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button 
                      onClick={() => sendEmail(req)}
                      className="flex-1 h-12 rounded-xl bg-primary text-white font-bold flex gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </Button>
                    <a href={`tel:${req.phone}`} className="flex-1">
                      <Button variant="outline" className="w-full h-12 rounded-xl border-accent text-accent font-bold flex gap-2">
                        <Phone className="w-4 h-4" />
                        Call
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 opacity-40">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                <Bell className="w-12 h-12" />
              </div>
              <p className="text-xl font-black">No inquiries yet</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
