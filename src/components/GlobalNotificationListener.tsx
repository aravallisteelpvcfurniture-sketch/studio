
"use client"

import * as React from "react"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, where, orderBy, limit } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { BellRing } from "lucide-react"

export function GlobalNotificationListener() {
  const db = useFirestore()
  const { toast } = useToast()
  const router = useRouter()
  const isInitialLoad = React.useRef(true)
  const prevCount = React.useRef(0)

  // Real-time query for pending requests
  const pendingQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(
      collection(db, "quoteRequests"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc"),
      limit(1)
    )
  }, [db])

  const { data: pending } = useCollection(pendingQuery)

  React.useEffect(() => {
    if (!pending) return

    // On first load, we just sync the count, don't show toast for old ones
    if (isInitialLoad.current) {
      prevCount.current = pending.length
      isInitialLoad.current = false
      return
    }

    // If new request arrived
    if (pending.length > 0 && pending.length > prevCount.current) {
      const newInquiry = pending[0]
      
      toast({
        title: "🚨 NEW CUSTOMER INQUIRY!",
        description: `${newInquiry.name} is looking for ${newInquiry.serviceType} solutions.`,
        action: (
          <Button 
            variant="default" 
            size="sm" 
            className="bg-accent text-white font-bold"
            onClick={() => router.push("/notifications")}
          >
            VIEW NOW
          </Button>
        ),
      })

      // Optional: Play a subtle notification sound here if needed
    }

    prevCount.current = pending.length
  }, [pending, toast, router])

  return null // This component only listens in the background
}
