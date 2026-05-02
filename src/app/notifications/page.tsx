"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Bell, Sparkles, User, Clock, MessageCircle, Mail, Phone, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFirestore, useCollection, useUser, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"
import { formatDistanceToNow } from "date-fns"

export default function NotificationsPage() {
  const db = useFirestore()
  const { user, isUserLoading } = useUser()

  // Explicit admin check
  const isAdmin = React.useMemo(() => {
    if (!user) return false;
    return user.email === "aravallisteelpvcfurniture@gmail.com" || user.uid === "Qmcch2NXxmg47Zf28Wh0KTp9Njt1";
  }, [user]);

  // Fetching real-time quote requests - only if user is confirmed admin
  const notificationsQuery = useMemoFirebase(() => {
    if (!db || !user || !isAdmin || isUserLoading) return null
    return query(
      collection(db, "quoteRequests"),
      orderBy("createdAt", "desc"),
      limit(20)
    )
  }, [db, user, isAdmin, isUserLoading])

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
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <Bell className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-black mb-4">Admin Access Required</h2>
        <p className="text-muted-foreground mb-8 text-sm">Please login with the administrator account to view inquiries.</p>
        <Link href="/login">
          <Button className="rounded-xl px-8 h-12 bg-primary">Switch Account</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-6 flex items-center justify-between bg-white border-b sticky top-0 z-50">
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
            <h2 className="text-sm font-black text-muted-foreground uppercase tracking-widest">Recent Activity</h2>
            <span className="bg-accent/10 text-accent text-[10px] font-bold px-3 py-1 rounded-full">
              {requests?.length || 0} Total
            </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-muted-foreground">Checking for new inquiries...</p>
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

                  <div className="flex gap-3 pt-2">
                    <Button 
                      onClick={() => sendEmail(req)}
                      className="flex-1 h-12 rounded-xl bg-primary text-white font-bold flex gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Forward to Email
                    </Button>
                    <a href={`tel:${req.phone}`} className="flex-1">
                      <Button variant="outline" className="w-full h-12 rounded-xl border-accent text-accent font-bold flex gap-2">
                        <Phone className="w-4 h-4" />
                        Call Now
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
              <div className="space-y-2">
                <p className="text-xl font-black">No inquiries found</p>
                <p className="text-sm">When customers fill the form, they will appear here.</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}