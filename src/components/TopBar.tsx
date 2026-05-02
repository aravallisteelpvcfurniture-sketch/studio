
"use client"

import * as React from "react"
import { Bell, Menu, User, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { useUser, useAuth, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { collection, query, where, limit, orderBy } from "firebase/firestore"

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useUser()
  const { auth } = useAuth()
  const db = useFirestore()
  const router = useRouter()

  // Checking for any pending requests to show the red dot
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
  const hasNotifications = pending && pending.length > 0

  const handleSignOut = () => {
    if (auth) signOut(auth)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-md border-b flex items-center justify-between px-6">
      <Button variant="ghost" size="icon" onClick={onMenuClick}>
        <Menu className="w-6 h-6 text-primary" />
      </Button>
      
      <Link href="/" className="absolute left-1/2 -translate-x-1/2">
        <span className="text-xl font-bold tracking-tighter text-primary">
          ARAVALLI<span className="text-accent">STEEL</span>
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-6 h-6 text-primary" />
            {hasNotifications && (
              <span className="absolute top-2 right-2 w-3 h-3 bg-accent rounded-full border-2 border-white animate-pulse" />
            )}
          </Button>
        </Link>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10 border-2 border-accent/20">
                  <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                  <AvatarFallback className="bg-accent/10 text-accent">
                    {user.displayName?.charAt(0) || <User className="w-5 h-5" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2 rounded-2xl" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none">{user.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                <Link href="/notifications">Inquiry Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl cursor-pointer text-destructive focus:text-destructive" onClick={handleSignOut}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="w-6 h-6 text-muted-foreground" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
