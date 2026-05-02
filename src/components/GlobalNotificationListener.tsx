"use client"

import * as React from "react"
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase"
import { collection, query, where, orderBy, limit } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function GlobalNotificationListener() {
  const db = useFirestore()
  const { user } = useUser()
  const { toast } = useToast()
  const router = useRouter()
  const isInitialLoad = React.useRef(true)
  const prevCount = React.useRef(0)

  // Real-time query for pending requests. 
  // We only run this if a user is logged in to avoid permission errors.
  const pendingQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(
      collection(db, "quoteRequests"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc"),
      limit(5)
    )
  }, [db, user])

  const { data: pending } = useCollection(pendingQuery)

  React.useEffect(() => {
    if (!pending) return

    // On first load, sync the count and don't show toast
    if (isInitialLoad.current) {
      prevCount.current = pending.length
      isInitialLoad.current = false
      return
    }

    // If a new request arrived
    if (pending.length > prevCount.current) {
      const newInquiry = pending[0]
      
      toast({
        title: "🚨 NEW INQUIRY!",
        description: `${newInquiry.name} wants ${newInquiry.serviceType} help.`,
        action: (
          <Button 
            variant="default" 
            size="sm" 
            className="bg-accent text-white font-bold"
            onClick={() => router.push("/notifications")}
          >
            VIEW
          </Button>
        ),
      })
    }

    prevCount.current = pending.length
  }, [pending, toast, router])

  return null
}