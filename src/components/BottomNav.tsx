
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, Sparkles, Calendar, MoreHorizontal, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@/firebase"

export function BottomNav() {
  const pathname = usePathname()
  const { user } = useUser()

  if (pathname === "/login" || pathname === "/welcome") return null

  const isAdmin = React.useMemo(() => {
    if (!user) return false;
    return user.email === "aravallisteelpvcfurniture@gmail.com" || user.uid === "Qmcch2NXxmg47Zf28Wh0KTp9Njt1";
  }, [user]);

  const navItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Shop", icon: ShoppingBag, href: "/shop" },
    { label: "AI Design", icon: Sparkles, href: "/ai-designer" },
  ]

  // Add Visitor Manager directly to bar if Admin
  if (isAdmin) {
    navItems.push({ label: "Visits", icon: ClipboardList, href: "/site-visits" })
  } else {
    navItems.push({ label: "Book", icon: Calendar, href: "/book-consultation" })
  }

  navItems.push({ label: "More", icon: MoreHorizontal, href: "/more" })

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t px-6 py-3 flex justify-between items-center pb-8 lg:pb-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className="flex flex-col items-center gap-1 group transition-all"
          >
            <div className={cn(
              "p-2 rounded-2xl transition-all",
              isActive ? "bg-accent text-white shadow-lg shadow-accent/20 scale-110" : "text-muted-foreground group-active:scale-90"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest",
              isActive ? "text-accent" : "text-muted-foreground/50"
            )}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
