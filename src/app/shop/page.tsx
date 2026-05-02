
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ShoppingCart, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFirestore, useCollection, useUser, useMemoFirebase } from "@/firebase"
import { collection, query, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"

export default function ShopPage() {
  const db = useFirestore()
  const { user } = useUser()
  const { toast } = useToast()
  
  const productsQuery = useMemoFirebase(() => db ? collection(db, "products") : null, [db])
  const { data: products, isLoading: loading } = useCollection(productsQuery)

  const addToCart = (product: any) => {
    if (!db || !user) {
      toast({ title: "Please login", description: "You need to be logged in to add items to cart." })
      return
    }

    const cartItemRef = doc(db, "carts", user.uid, "items", product.id)
    setDoc(cartItemRef, {
      productId: product.id,
      quantity: 1,
      priceAtAddition: product.price,
      updatedAt: serverTimestamp()
    }, { merge: true })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-6 flex items-center justify-between bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-primary">Shop Modular</h1>
        </div>
        <Link href="/cart">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="w-6 h-6" />
          </Button>
        </Link>
      </div>

      <div className="p-6 grid grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : products && products.length > 0 ? (
          products.map((product: any) => (
            <Card key={product.id} className="overflow-hidden border-none shadow-md bg-white rounded-2xl flex flex-col">
              <div className="relative aspect-square">
                <Image 
                  src={product.imageUrl || `https://picsum.photos/seed/${product.id}/400/400`} 
                  alt={product.name} 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-primary truncate">{product.name}</h3>
                <span className="text-accent font-black text-lg mt-1">₹{product.price}</span>
                <Button 
                  size="sm" 
                  className="mt-3 w-full rounded-xl bg-primary text-white text-[10px] font-bold h-8"
                  onClick={() => addToCart(product)}
                >
                  <Plus className="w-3 h-3 mr-1" /> Add to Cart
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-2 text-center py-20 opacity-50">
            <p>No products available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
