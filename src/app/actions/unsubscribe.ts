"use server"

import { createClient } from "@supabase/supabase-js"
import { redirect } from "next/navigation"

export async function unsubscribe(formData: FormData) {
  const email = formData.get("email") as string
  if (!email) return { error: "Email is required" }

  // Use the service role key to securely bypass RLS for deletion
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  const { error } = await supabaseAdmin
    .from("newsletter_subscribers")
    .delete()
    .eq("email", email)

  if (error) {
    console.error("Unsubscribe error:", error)
    return { error: "Failed to unsubscribe" }
  }

  redirect("/unsubscribe/success")
}
