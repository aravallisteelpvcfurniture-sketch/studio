
"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Bell, Star, Percent, Settings, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const NOTIFICATIONS = [
  {
    id: 1,
    title: "New Design Tip!",
    message: "Maximize your small kitchen space with our new PVC modular cabinets.",
    time: "2h ago",
    icon: <Sparkles className="text-accent" />,
    color: "bg-accent/10"
  },
  {
    id: 2,
    title: "Exclusive Offer",
    message: "Get 20% off on all Wardrobe Systems this festive season. Book now!",
    time: "5h ago",
    icon: <Percent className="text-orange-500" />,
    color: "bg-orange-50"
  },
  {
    id: 3,
    title: "Request Updated",
    message: "Your consultation request for 'Modular Kitchen' is now being processed.",
    time: "1d ago",
    icon: <Star className="text-yellow-500" />,
    color: "bg-yellow-50"
  }
]

export default function NotificationsPage() {
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
          {NOTIFICATIONS.length > 0 ? (
            NOTIFICATIONS.map((notif) => (
              <Card key={notif.id} className="p-4 border-none shadow-sm bg-white rounded-2xl flex gap-4 items-start animate-in fade-in slide-in-from-right-4">
                <div className={`p-3 rounded-xl ${notif.color} shrink-0`}>
                  {React.cloneElement(notif.icon as React.ReactElement, { size: 20 })}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-primary">{notif.title}</h3>
                    <span className="text-[10px] text-muted-foreground font-medium">{notif.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {notif.message}
                  </p>
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
