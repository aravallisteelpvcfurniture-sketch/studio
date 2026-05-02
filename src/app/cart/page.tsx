
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Trash2, ShoppingBag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useFirestore, useCollection, useUser, useMemoFirebase } from "@/firebase"
import { collection, doc, deleteDoc, updateDoc } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const db = useFirestore()
  const { user } = useUser()
  const { toast } = useToast()

  const cartQuery = useMemoFirebase(() => 
    (db && user) ? collection(db, "carts", user.uid, "items") : null, 
  [db, user])
  
  const { data: items, isLoading: loading } = useCollection(cartQuery)

  const total = (items || []).reduce((acc, item: any) => acc + (item.priceAtAddition * item.quantity), 0)

  const removeItem = async (itemId: string) => {
    if (!db || !user) return
    await deleteDoc(doc(db, "carts", user.uid, "items", itemId))
    toast({ title: "Item removed" })
  }

  const updateQty = async (itemId: string, newQty: number) => {
    if (!db || !user || newQty < 1) return
    await updateDoc(doc(db, "carts", user.uid, "items", itemId), {
      quantity: newQty
    })
  }

  if (!user) return <div className="p-20 text-center font-bold text-primary">Please login to view cart</div>

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-6 flex items-center gap-4 bg-white border-b sticky top-0 z-50">
        <Link href="/shop">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-primary">Your Cart</h1>
      </div>

      <div className="flex-1 p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : items && items.length > 0 ? (
          items.map((item: any) => (
            <Card key={item.id} className="p-4 border-none shadow-sm bg-white rounded-2xl flex gap-4">
              <div className="w-20 h-20 relative rounded-xl overflow-hidden shrink-0">
                <Image src={`https://picsum.photos/seed/${item.productId}/200/200`} alt="Product" fill className="object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-primary">Product ID: {item.productId}</h3>
                  <span className="text-accent font-bold text-sm">₹{item.priceAtAddition}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-6 h-6 rounded-full border flex items-center justify-center text-primary font-bold hover:bg-accent/10">-</button>
                    <span className="text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-6 h-6 rounded-full border flex items-center justify-center text-primary font-bold hover:bg-accent/10">+</button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive h-8 w-8">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 opacity-50 flex flex-col items-center gap-4">
            <ShoppingBag className="w-16 h-16 text-muted-foreground" />
            <p className="text-lg font-bold text-primary">Your cart is empty</p>
            <Link href="/shop">
              <Button variant="outline" className="rounded-xl border-accent text-accent font-bold">Go Shopping</Button>
            </Link>
          </div>
        )}
      </div>

      {items && items.length > 0 && (
        <div className="p-6 bg-white border-t space-y-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-bold">Total Amount</span>
            <span className="text-2xl font-black text-primary">₹{total.toLocaleString('en-IN')}</span>
          </div>
          <Button className="w-full h-14 bg-accent hover:bg-accent/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-accent/20 transition-all active:scale-95">
            Checkout Now
          </Button>
        </div>
      )}
    </div>
  )
}
