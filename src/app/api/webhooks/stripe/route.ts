import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Initialize Stripe with placeholder key for build to pass
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string || 'sk_test_placeholder', {
  apiVersion: '2026-05-27.dahlia',
})

// Webhooks require the raw body
export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch (err: unknown) {
    const error = err as Error
    console.error(`Webhook Error: ${error.message}`)
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      console.log('Payment successful for session:', session.id)
      
      const orderId = session.metadata?.order_id
      if (orderId) {
        // Initialize Supabase Admin client to bypass RLS in the webhook
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        
        const { error } = await supabaseAdmin.from('orders').update({
          status: 'paid',
          stripe_payment_intent_id: session.payment_intent as string
        }).eq('id', orderId)

        if (error) {
          console.error('Failed to update order status:', error)
        } else {
          console.log(`Successfully marked order ${orderId} as paid.`)
        }
      }
      
      // In a real app, you would also:
      // - Clear the user's cart
      // - Send confirmation email (e.g. via Resend)
      break
    
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
