
"use client"

import * as React from "react"
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore"
import { useFirestore, useUser } from "@/firebase"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

/**
 * GlobalNotificationListener
 * Background listener that alerts the admin of new events.
 * Handles System Tray (Slider Bar) notifications for mobile/desktop.
 */
export function GlobalNotificationListener() {
  const db = useFirestore()
  const { user, isUserLoading } = useUser()
  const { toast } = useToast()
  const router = useRouter()
  
  const isInitialLoadQuote = React.useRef(true)
  const isInitialLoadVisit = React.useRef(true)
  const [lastQuoteId, setLastQuoteId] = React.useState<string | null>(null)
  const [lastVisitId, setLastVisitId] = React.useState<string | null>(null)

  const isAdmin = React.useMemo(() => {
    if (!user || isUserLoading) return false;
    return user.email === "aravallisteelpvcfurniture@gmail.com" || user.uid === "Qmcch2NXxmg47Zf28Wh0KTp9Njt1";
  }, [user, isUserLoading]);

  // Request Permission
  React.useEffect(() => {
    if (isAdmin && typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, [isAdmin]);

  // 1. Listener for Quote Requests (Inquiries)
  React.useEffect(() => {
    if (!db || !isAdmin || !user) return;

    const q = query(
      collection(db, "quoteRequests"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        isInitialLoadQuote.current = false;
        return;
      }
      const latestDoc = snapshot.docs[0];
      const data = latestDoc.data();

      if (isInitialLoadQuote.current) {
        setLastQuoteId(latestDoc.id);
        isInitialLoadQuote.current = false;
        return;
      }

      if (latestDoc.id !== lastQuoteId) {
        setLastQuoteId(latestDoc.id);
        triggerSystemNotification(
          "New Inquiry Received! 🚨",
          `${data.name} wants ${data.serviceType}.`,
          "/notifications"
        );
      }
    });
    return () => unsubscribe();
  }, [db, isAdmin, user, lastQuoteId]);

  // 2. Listener for Site Visits (New Parties)
  React.useEffect(() => {
    if (!db || !isAdmin || !user) return;

    const q = query(
      collection(db, "siteVisits"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        isInitialLoadVisit.current = false;
        return;
      }
      const latestDoc = snapshot.docs[0];
      const data = latestDoc.data();

      if (isInitialLoadVisit.current) {
        setLastVisitId(latestDoc.id);
        isInitialLoadVisit.current = false;
        return;
      }

      if (latestDoc.id !== lastVisitId) {
        setLastVisitId(latestDoc.id);
        triggerSystemNotification(
          "New Party Added! 👷",
          `${data.customerName} registered for ${data.serviceType}.`,
          "/site-visits"
        );
      }
    });
    return () => unsubscribe();
  }, [db, isAdmin, user, lastVisitId]);

  const triggerSystemNotification = (title: string, body: string, path: string) => {
    // Visual Toast
    toast({
      title: `🚨 ${title}`,
      description: body,
      action: (
        <Button 
          variant="default" 
          size="sm" 
          className="bg-accent text-white font-bold"
          onClick={() => router.push(path)}
        >
          DEKHO
        </Button>
      ),
    });

    // Slider Bar Notification
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      const systemNotification = new Notification(title, {
        body: body,
        icon: "https://picsum.photos/seed/aravalli-logo/192/192",
        tag: "aravalli-alert",
      });

      systemNotification.onclick = () => {
        window.focus();
        router.push(path);
        systemNotification.close();
      };
    }
  };

  return null;
}
