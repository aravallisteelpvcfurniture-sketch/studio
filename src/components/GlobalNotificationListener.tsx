
"use client"

import * as React from "react"
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore"
import { useFirestore, useUser } from "@/firebase"
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
  const [lastId, setLastId] = React.useState<string | null>(null)

  // Verify Admin status
  const isAdmin = React.useMemo(() => {
    if (!user || isUserLoading) return false;
    return user.email === "aravallisteelpvcfurniture@gmail.com" || user.uid === "Qmcch2NXxmg47Zf28Wh0KTp9Njt1";
  }, [user, isUserLoading]);

  React.useEffect(() => {
    // Only run if database is ready and user is confirmed Admin
    if (!db || !isAdmin || !user) return;

    try {
      const q = query(
        collection(db, "quoteRequests"),
        where("status", "==", "pending"),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          if (snapshot.empty) {
            isInitialLoad.current = false;
            return;
          }

          const latestDoc = snapshot.docs[0];
          const data = latestDoc.data();

          if (isInitialLoad.current) {
            setLastId(latestDoc.id);
            isInitialLoad.current = false;
            return;
          }

          if (latestDoc.id !== lastId) {
            setLastId(latestDoc.id);
            toast({
              title: "🚨 NEW INQUIRY!",
              description: `${data.name} is asking for ${data.serviceType}.`,
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
            });
          }
        },
        (error) => {
          // Catch silently to avoid red screen during auth sync
          console.log("Waiting for database permissions...");
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.log("Notification setup paused...");
    }
  }, [db, isAdmin, user, toast, router, lastId]);

  return null;
}
