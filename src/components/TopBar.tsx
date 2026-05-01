
"use client"

import { Bell, Menu } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
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

      <Button variant="ghost" size="icon">
        <Bell className="w-6 h-6 text-primary" />
      </Button>
    </div>
  )
}
