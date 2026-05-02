
"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Bell, Star, Percent, Settings, Sparkles, User, Clock, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFirestore, useCollection, useUser, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"
import { formatDistanceToNow } from "date-fns"

export default function NotificationsPage() {
  const db = useFirestore()
  const { user } = useUser()

  // Fetching real-time quote requests to act as notifications for the owner/staff
  const notificationsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(
      collection(db, "quoteRequests"),
      orderBy("createdAt", "desc"),
      limit(20)
    )
  }, [db])

  const { data: requests, isLoading } = useCollection(notificationsQuery)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-6 flex items-center justify-between bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-primary">Notifications</h1>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : requests && requests.length > 0 ? (
            requests.map((req: any) => (
              <Card key={req.id} className="p-5 border-none shadow-sm bg-white rounded-3xl flex gap-4 items-start animate-in fade-in slide-in-from-right-4">
                <div className={`p-3 rounded-2xl bg-accent/10 shrink-0`}>
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-black text-primary">New Consultation Request</h3>
                      <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {req.createdAt?.toDate ? formatDistanceToNow(req.createdAt.toDate(), { addSuffix: true }) : "Just now"}
                      </p>
                    </div>
                    <div className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-1 rounded-lg uppercase">
                      {req.status || "Pending"}
                    </div>
                  </div>
                  
                  <div className="space-y-1 py-2 border-y border-dashed my-2">
                    <p className="text-xs font-bold text-primary/80 flex items-center gap-2">
                      <User className="w-3 h-3" /> {req.name}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <MessageCircle className="w-3 h-3" /> {req.serviceType}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" size="sm" className="rounded-xl h-8 text-[10px] font-bold border-accent text-accent hover:bg-accent hover:text-white transition-all">
                      View Details
                    </Button>
                    <a href={`tel:${req.phone}`} className="flex-1">
                      <Button className="w-full h-8 rounded-xl bg-primary text-white text-[10px] font-bold">
                        Call Customer
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
              <Bell className="w-16 h-16" />
              <p className="text-lg font-bold">No new notifications</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
