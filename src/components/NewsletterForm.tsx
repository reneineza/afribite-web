"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { subscribeToNewsletter } from "@/app/actions/newsletter"

interface NewsletterFormProps {
  variant?: "footer" | "home"
}

export function NewsletterForm({ variant = "footer" }: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus("loading")

    try {
      const result = await subscribeToNewsletter(email)

      if (result.error) {
        throw new Error(result.error)
      }
      
      setStatus("success")
      setEmail("")
    } catch (error) {
      console.error(error)
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className={`p-4 rounded-lg text-sm text-center font-medium ${variant === "home" ? "bg-white/10 text-white" : "bg-green-50 text-green-800 border border-green-200"}`}>
        Thanks for subscribing! We&apos;ll be in touch.
      </div>
    )
  }

  if (variant === "home") {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address" 
            required
            className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
          />
          <button 
            type="submit" 
            disabled={status === "loading"}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-foreground text-background hover:bg-foreground/90 h-12 px-8 py-2 whitespace-nowrap"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </div>
        {status === "error" && (
          <p className="text-destructive text-sm mt-2 font-medium">Something went wrong. Please try again.</p>
        )}
      </form>
    )
  }

  // Footer variant
  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <div className="flex max-w-md relative group shadow-sm rounded-lg hover:shadow-md transition-shadow duration-300 w-full">
        <div className="relative flex w-full">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address" 
            required
            className="flex-1 w-full min-w-0 bg-white border border-primary/10 border-r-0 rounded-l-lg px-5 py-3 text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary/30 transition-all"
          />
          <button 
            type="submit" 
            disabled={status === "loading"}
            className="bg-secondary text-primary-foreground px-6 py-3 rounded-r-lg text-sm font-bold hover:bg-secondary/90 transition-colors flex items-center gap-2 group/btn disabled:opacity-70 whitespace-nowrap"
          >
            {status === "loading" ? "..." : "Subscribe"}
            {status !== "loading" && <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />}
          </button>
        </div>
      </div>
      {status === "error" && (
        <p className="text-destructive text-xs mt-2 font-medium">Something went wrong. Please try again.</p>
      )}
    </form>
  )
}
