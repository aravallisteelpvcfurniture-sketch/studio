"use client"

import * as React from "react"
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase"
import { collection, query, where, orderBy, limit } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

/**
 * GlobalNotificationListener
 * Background listener that alerts the admin of new pending quote requests.
 */
export function GlobalNotificationListener() {
  const db = useFirestore()
  const { user } = useUser()
  const { toast } = useToast()
  const router = useRouter()
  const isInitialLoad = React.useRef(true)
  const prevCount = React.useRef(0)

  // Only run query for the admin user to prevent permission errors for regular customers
  const isAdmin = user?.email === "aravallisteelpvcfurniture@gmail.com" || user?.uid === "Qmcch2NXxmg47Zf28Wh0KTp9Njt1";

  const pendingQuery = useMemoFirebase(() => {
    if (!db || !user || !isAdmin) return null
    return query(
      collection(db, "quoteRequests"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc"),
      limit(5)
    )
  }, [db, user, isAdmin])

  const { data: pending } = useCollection(pendingQuery)

  React.useEffect(() => {
    if (!pending || !isAdmin) return

    if (isInitialLoad.current) {
      prevCount.current = pending.length
      isInitialLoad.current = false
      return
    }

    if (pending.length > prevCount.current) {
      const newInquiry = pending[0]
      
      toast({
        title: "🚨 NEW INQUIRY!",
        description: `${newInquiry.name} requested ${newInquiry.serviceType}.`,
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
  }, [pending, toast, router, isAdmin])

  return null
}