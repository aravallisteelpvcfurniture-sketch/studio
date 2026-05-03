
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
 * Only runs if the user is confirmed as Admin to avoid permission errors.
 */
export function GlobalNotificationListener() {
  const db = useFirestore()
  const { user, isUserLoading } = useUser()
  const { toast } = useToast()
  const router = useRouter()
  const isInitialLoad = React.useRef(true)
  const [lastId, setLastId] = React.useState<string | null>(null)

  // Verify Admin status before even thinking about querying
  const isAdmin = React.useMemo(() => {
    if (!user || isUserLoading) return false;
    return user.email === "aravallisteelpvcfurniture@gmail.com" || user.uid === "Qmcch2NXxmg47Zf28Wh0KTp9Njt1";
  }, [user, isUserLoading]);

  React.useEffect(() => {
    // CRITICAL: Only proceed if db is ready AND user is confirmed Admin
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
          // If a permission error still happens, we catch it silently here
          // instead of letting it bubble up to a red screen.
          console.log("Notification listener is waiting for sync...");
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.log("Listener setup paused...");
    }
  }, [db, isAdmin, user, toast, router, lastId]);

  return null;
}
