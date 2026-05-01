
"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PlaceHolderImages } from "@/lib/placeholder-images"

const CATEGORIES = [
  {
    id: "cat-kitchen",
    title: "Modular Kitchens",
    subtitle: "PVC & Acrylic Premium Finishes",
    image: PlaceHolderImages.find(i => i.id === "cat-kitchen")?.imageUrl,
    hint: "modular kitchen"
  },
  {
    id: "cat-wardrobe",
    title: "Wardrobe Systems",
    subtitle: "Ergonomic & Space Saving",
    image: PlaceHolderImages.find(i => i.id === "cat-wardrobe")?.imageUrl,
    hint: "luxury wardrobe"
  },
  {
    id: "cat-paneling",
    title: "Wall Paneling",
    subtitle: "Modern & Aesthetic Ceilings",
    image: PlaceHolderImages.find(i => i.id === "cat-paneling")?.imageUrl,
    hint: "wall paneling"
  },
  {
    id: "cat-hardware",
    title: "Hardware",
    subtitle: "High Grade Stainless Steel",
    image: PlaceHolderImages.find(i => i.id === "cat-hardware")?.imageUrl,
    hint: "kitchen hardware"
  }
]

export default function CategoryExplorer() {
  return (
    <div className="h-screen bg-background relative overflow-hidden flex flex-col">
      <div className="absolute top-6 left-6 z-50">
        <Link href="/">
          <Button variant="outline" size="icon" className="rounded-full bg-white/20 backdrop-blur-md border-white/30 text-white hover:text-primary">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
      </div>

      <div className="h-full snap-y snap-mandatory overflow-y-scroll no-scrollbar">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="h-screen w-full snap-start relative flex flex-col justify-end p-8 pb-12">
            <Image
              src={cat.image || ""}
              alt={cat.title}
              fill
              className="object-cover -z-10"
              data-ai-hint={cat.hint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent -z-10" />
            
            <div className="max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
              <span className="text-accent font-bold uppercase tracking-widest text-xs mb-2 block">{cat.subtitle}</span>
              <h2 className="text-4xl font-bold text-white mb-6">{cat.title}</h2>
              <Link href={`/product/${cat.id}`}>
                <Button className="w-full bg-accent hover:bg-accent/90 text-white rounded-2xl h-14 text-lg font-bold">
                  View Collection
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
