'use server'

import { redirect } from 'next/navigation'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

// Initialize Stripe with placeholder key for MVP development
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
})

export async function createCheckoutSession(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const email = formData.get('email') as string || user?.email
  const fullName = formData.get('full_name') as string
  const line1 = formData.get('line1') as string
  const city = formData.get('city') as string
  const province = formData.get('province') as string
  const postal_code = formData.get('postal_code') as string
  const country = formData.get('country') as string || 'CA'

  const cartDataString = formData.get('cartData') as string
  if (!cartDataString) {
    redirect('/cart')
  }

  const cartItems = JSON.parse(cartDataString)

  const lineItems = cartItems.map((item: { product: { name: string; images: string[]; price: number }, quantity: number }) => ({
    price_data: {
      currency: 'cad',
      product_data: {
        name: item.product.name,
        images: [item.product.images[0]],
      },
      unit_amount: Math.round(item.product.price * 100), // convert to cents
    },
    quantity: item.quantity,
  }))

  // Add Shipping (Mock logic based on country)
  const shippingCost = country === 'CA' ? 0 : (country === 'US' ? 1999 : 3999)
  if (shippingCost > 0) {
    lineItems.push({
      price_data: {
        currency: 'cad',
        product_data: { name: 'Flat Rate Shipping' },
        unit_amount: shippingCost,
      },
      quantity: 1,
    })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cart`,
      customer_email: email,
      metadata: {
        shipping_name: fullName,
        shipping_line1: line1,
        shipping_city: city,
        shipping_province: province,
        shipping_postal_code: postal_code,
        shipping_country: country,
        // user_id: user?.id || 'guest',
      }
    })

    if (session.url) {
      redirect(session.url)
    }
  } catch (err) {
    console.error('Stripe Checkout Error:', err)
    redirect('/checkout?error=Payment_Failed')
  }
}
