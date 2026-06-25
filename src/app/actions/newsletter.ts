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

    let isAlreadySubscribed = false

    // If it's a unique constraint violation (they are already subscribed),
    if (dbError) {
      if (dbError.code !== '23505') { // Postgres unique violation
        console.error("Database error:", dbError)
        return { error: "Failed to subscribe" }
      }
      isAlreadySubscribed = true
    }

    // 2. Send Email via Resend
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      const subject = isAlreadySubscribed 
        ? 'You are already subscribed to AfriBite! 🌍'
        : 'Welcome to the AfriBite Family! 🌍 (+ Your 10% Off)'
        
      const emailContent = isAlreadySubscribed
        ? `
            <h2 style="color: #2b2b2b; font-size: 24px; margin: 0 0 20px 0; font-weight: bold;">You're already on the list! 😊</h2>
            
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
              Thank you for checking in! We just wanted to let you know that your email is already safely on our VIP newsletter list.
            </p>
            
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 40px 0;">
              You're all set to continue receiving our latest arrivals, exclusive member deals, and traditional recipes directly to your inbox.
            </p>
          `
        : `
            <h2 style="color: #2b2b2b; font-size: 24px; margin: 0 0 20px 0; font-weight: bold;">Welcome to the family! 👋</h2>
            
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
              Thank you for subscribing to the AfriBite newsletter. We are incredibly excited to share our passion for authentic African groceries, spices, and specialty ingredients with you.
            </p>
            
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 35px 0;">
              As a token of our appreciation, please enjoy <strong>10% off</strong> your first order. Simply apply the code below at checkout:
            </p>
            
            <!-- Discount Code Box -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 35px 0;">
              <tr>
                <td align="center">
                  <div style="display: inline-block; background-color: #fffaf7; border: 2px dashed #ed591f; border-radius: 8px; padding: 20px 40px;">
                    <span class="discount-code" style="font-size: 28px; font-weight: 800; color: #ed591f; letter-spacing: 3px;">WELCOME10</span>
                  </div>
                </td>
              </tr>
            </table>
            
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 40px 0;">
              Get ready to discover premium quality ingredients delivered straight to your door across Canada. Keep an eye on your inbox for our latest arrivals, exclusive member deals, and traditional recipes.
            </p>
          `

      const { error: emailError } = await resend.emails.send({
        from: 'AfriBite <onboarding@resend.dev>', // Use verified domain here in production
        to: email,
        subject: subject,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AfriBite</title>
            <style>
              /* Responsive styles */
              @media only screen and (max-width: 600px) {
                .email-container {
                  width: 100% !important;
                  margin: auto !important;
                }
                .content-box {
                  padding: 30px 20px !important;
                }
                .header-box {
                  padding: 30px 20px !important;
                }
                h1 {
                  font-size: 26px !important;
                }
                h2 {
                  font-size: 20px !important;
                }
                .discount-code {
                  font-size: 24px !important;
                }
              }
            </style>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; -webkit-font-smoothing: antialiased;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9f9f9; padding: 40px 0;">
              <tr>
                <td align="center">
                  <!-- Main Container -->
                  <table class="email-container" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <!-- Header -->
                    <tr>
                      <td class="header-box" align="center" style="background-color: #ffffff; padding: 40px 20px;">
                        <img src="${process.env.NEXT_PUBLIC_APP_URL || 'https://afribite.com'}/logo.png" alt="AfriBite" width="180" style="display: block; margin: 0 auto; max-width: 100%; height: auto;">
                        <p style="color: #214e3a; margin: 15px 0 0 0; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 3px;">Authentic African Flavors</p>
                      </td>
                    </tr>
                    
                    <!-- Orange Accent Line -->
                    <tr>
                      <td style="background-color: #ed591f; height: 6px; line-height: 6px; font-size: 6px;">&nbsp;</td>
                    </tr>
                    
                    <!-- Main Body -->
                    <tr>
                      <td class="content-box" style="padding: 50px 40px;">
                        ${emailContent}
                        
                        <!-- CTA Button -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td align="center">
                              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://afribite.com'}" target="_blank" style="display: inline-block; background-color: #214e3a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; padding: 18px 40px; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px;">Start Shopping Now</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Footer with Brand-Colored Social Icons -->
                    <tr>
                      <td style="background-color: #f4f4f5; padding: 40px; text-align: center; border-top: 1px solid #e5e5e5;">
                        <!-- Social Icons (colored using Icons8) -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                          <tr>
                            <td align="center">
                              <table border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                  <td style="padding: 0 12px;">
                                    <a href="https://facebook.com" target="_blank" style="text-decoration: none;">
                                      <img src="https://img.icons8.com/ios-filled/24/ed591f/facebook-new.png" alt="Facebook" width="24" height="24" style="display: block;">
                                    </a>
                                  </td>
                                  <td style="padding: 0 12px;">
                                    <a href="https://instagram.com" target="_blank" style="text-decoration: none;">
                                      <img src="https://img.icons8.com/ios-filled/24/ed591f/instagram-new.png" alt="Instagram" width="24" height="24" style="display: block;">
                                    </a>
                                  </td>
                                  <td style="padding: 0 12px;">
                                    <a href="https://twitter.com" target="_blank" style="text-decoration: none;">
                                      <img src="https://img.icons8.com/ios-filled/24/ed591f/twitterx--v1.png" alt="Twitter" width="24" height="24" style="display: block;">
                                    </a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="color: #737373; font-size: 14px; margin: 0 0 10px 0; font-weight: 500;">
                          © ${new Date().getFullYear()} AfriBite Canada. All rights reserved.
                        </p>
                        <p style="color: #8c8c8c; font-size: 13px; line-height: 1.5; margin: 0;">
                          206 Rue Antoinette-Robidoux<br>
                          Longueuil, QC J4J 2V3
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Unsubscribe Link -->
                  <table class="email-container" width="600" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
                    <tr>
                      <td align="center">
                        <p style="color: #a3a3a3; font-size: 12px; margin: 0; line-height: 1.5;">
                          You received this email because you subscribed to updates from AfriBite.<br>
                          Don't want these emails anymore? <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://afribite.com'}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #ed591f; text-decoration: underline;">Unsubscribe here</a>.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
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
