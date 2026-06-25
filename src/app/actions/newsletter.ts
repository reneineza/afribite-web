"use server"

import { createClient } from "@/lib/supabase/server"
import { Resend } from "resend"

export async function subscribeToNewsletter(email: string) {
  if (!email) {
    return { error: "Email is required" }
  }

  try {
    const supabase = await createClient()

    // 1. Insert into Supabase
    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email }])

    // If it's a unique constraint violation (they are already subscribed),
    // we can just return success or a specific message.
    if (dbError) {
      if (dbError.code === '23505') { // Postgres unique violation
        return { success: true, message: "Already subscribed!" }
      }
      console.error("Database error:", dbError)
      return { error: "Failed to subscribe" }
    }

    // 2. Send Welcome Email via Resend
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      const { error: emailError } = await resend.emails.send({
        from: 'AfriBite <onboarding@resend.dev>', // Use verified domain here in production
        to: email,
        subject: 'Welcome to the AfriBite Family! 🌍 (+ Your 10% Off)',
        html: `
          <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #2B2B2B; line-height: 1.6;">
            <div style="background-color: #faf7f2; padding: 30px; text-align: center; border-bottom: 4px solid #ed591f;">
              <h1 style="color: #214e3a; margin: 0;">Welcome to AfriBite!</h1>
            </div>
            
            <div style="padding: 30px; background-color: #ffffff;">
              <p>Hi there,</p>
              <p>Thank you for subscribing to the AfriBite newsletter! We are thrilled to have you in our community.</p>
              
              <p>As promised, here is your 10% discount code for your first order. Use it at checkout to enjoy authentic African groceries delivered right to your door:</p>
              
              <div style="background-color: #f4f4f5; border: 1px dashed #ed591f; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
                <span style="font-size: 24px; font-weight: bold; color: #ed591f; letter-spacing: 2px;">WELCOME10</span>
              </div>
              
              <p>We'll be sending you our latest arrivals, exclusive deals, and authentic recipes. Stay tuned!</p>
              
              <div style="text-align: center; margin-top: 40px;">
                <a href="https://afribite.com" style="background-color: #214e3a; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; display: inline-block;">Start Shopping</a>
              </div>
            </div>
            
            <div style="text-align: center; padding: 20px; font-size: 12px; color: #737373; background-color: #faf7f2;">
              <p>© ${new Date().getFullYear()} AfriBite Canada. All rights reserved.</p>
              <p>206 Rue Antoinette-Robidoux, Longueuil, QC J4J 2V3</p>
            </div>
          </div>
        `
      })

      if (emailError) {
        console.error("Resend error:", emailError)
        // We still return success because the db insert worked
      }
    } else {
      console.warn("RESEND_API_KEY is not set. Skipping welcome email.")
    }

    return { success: true }
  } catch (error) {
    console.error("Subscription error:", error)
    return { error: "Something went wrong" }
  }
}
