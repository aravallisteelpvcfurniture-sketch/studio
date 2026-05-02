
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { collection, serverTimestamp, addDoc } from "firebase/firestore"
import { useFirestore, useUser, errorEmitter, FirestorePermissionError } from "@/firebase"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Send, CheckCircle2, Loader2, MessageSquare, Mail } from "lucide-react"
import Link from "next/link"

const formSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Enter a valid phone number"),
  serviceType: z.enum(["Kitchen", "Wardrobe", "Wall Paneling", "Full Interior"]),
  message: z.string().optional(),
})

export default function BookConsultation() {
  const db = useFirestore()
  const { user } = useUser()
  const [loading, setLoading] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [formData, setFormData] = React.useState<any>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      phone: "",
      serviceType: "Kitchen",
      message: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!db) return
    setLoading(true)
    
    const colRef = collection(db, "quoteRequests")
    const submissionData = {
      ...values,
      customerUid: user?.uid || "anonymous",
      status: "pending",
      createdAt: serverTimestamp(),
    }

    addDoc(colRef, submissionData)
      .then(() => {
        setFormData(values)
        setSubmitted(true)
        setLoading(false)
      })
      .catch(async (error) => {
        setLoading(false)
        const permissionError = new FirestorePermissionError({
          path: colRef.path,
          operation: 'create',
          requestResourceData: submissionData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  }

  const sendWhatsApp = () => {
    if (!formData) return
    const adminPhone = "919999999999" // TODO: Change to your actual WhatsApp number
    const text = `*New Inquiry Received!*\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Service:* ${formData.serviceType}\n*Email:* ${formData.email}\n*Message:* ${formData.message || "No message"}`
    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`, "_blank")
  }

  const sendEmail = () => {
    if (!formData) return
    const adminEmail = "aravallisteelpvcfurniture@gmail.com"
    const subject = `New Inquiry from ${formData.name}`
    const body = `Hello Admin,\n\nYou have a new inquiry:\n\nName: ${formData.name}\nPhone: ${formData.phone}\nService: ${formData.serviceType}\nEmail: ${formData.email}\nMessage: ${formData.message || "No message"}`
    window.location.href = `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-black text-primary mb-2">Request Saved!</h1>
        <p className="text-muted-foreground mb-8 text-sm max-w-[300px]">Ab Admin ko turant alert bhejne ke liye niche diye gaye button par click karein:</p>
        
        <div className="w-full max-w-xs space-y-4 mb-8">
          <Button 
            onClick={sendWhatsApp}
            className="w-full h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl font-bold flex gap-2 shadow-lg"
          >
            <MessageSquare className="w-5 h-5 fill-white" />
            WhatsApp Admin
          </Button>
          
          <Button 
            onClick={sendEmail}
            variant="outline"
            className="w-full h-14 border-primary text-primary rounded-2xl font-bold flex gap-2"
          >
            <Mail className="w-5 h-5" />
            Email Admin
          </Button>
        </div>

        <Link href="/">
          <Button variant="ghost" className="text-muted-foreground font-bold">Back to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-6 flex items-center gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-50 border-b">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-primary">Book Consultation</h1>
      </div>

      <div className="p-6 max-w-lg mx-auto w-full">
        <Card className="p-8 border-none shadow-xl bg-white rounded-[2.5rem]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="h-12 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="9999999999" {...field} className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Service Required</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Kitchen">Modular Kitchen</SelectItem>
                        <SelectItem value="Wardrobe">Wardrobe System</SelectItem>
                        <SelectItem value="Wall Paneling">Wall Paneling</SelectItem>
                        <SelectItem value="Full Interior">Full Interior Design</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about your space..." 
                        {...field} 
                        className="min-h-[100px] rounded-xl resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-accent hover:bg-accent/90 text-white rounded-2xl font-bold text-lg flex gap-2 transition-all shadow-lg shadow-accent/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Submit Request
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  )
}
