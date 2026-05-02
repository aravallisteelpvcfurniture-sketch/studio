
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
  const { user, isUserLoading } = useUser()
  const { toast } = useToast()
  const router = useRouter()
  const isInitialLoad = React.useRef(true)
  const prevCount = React.useRef(0)

  // Strict Admin Check
  const isAdmin = React.useMemo(() => {
    if (!user || isUserLoading) return false;
    return user.email === "aravallisteelpvcfurniture@gmail.com" || user.uid === "Qmcch2NXxmg47Zf28Wh0KTp9Njt1";
  }, [user, isUserLoading]);

  // Query is created for admins only to monitor new requests
  const pendingQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null
    
    return query(
      collection(db, "quoteRequests"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc"),
      limit(5)
    )
  }, [db, isAdmin])

  const { data: pending } = useCollection(pendingQuery)

  React.useEffect(() => {
    if (!pending || !isAdmin || pending.length === 0) return

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
