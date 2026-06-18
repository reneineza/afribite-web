'use server'

import { redirect } from 'next/navigation'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

// Initialize Stripe with placeholder key for MVP development
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string || 'sk_test_placeholder', {
  apiVersion: '2026-05-27.dahlia',
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
  if (cartItems.length === 0) redirect('/cart')

  // 1. Fetch real product data from Supabase to prevent price tampering
  const productIds = cartItems.map((item: { product: { id: string } }) => item.product.id)
  const { data: dbProducts, error: dbError } = await supabase
    .from('products')
    .select('id, name, price, images')
    .in('id', productIds)

  if (dbError || !dbProducts) {
    console.error('Failed to fetch products for checkout:', dbError)
    redirect('/checkout?error=Validation_Failed')
  }

  let subtotal = 0
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
  const orderItemsData: { product_id: string, quantity: number, price_at_purchase: number }[] = []

  // 2. Calculate true totals
  for (const item of cartItems) {
    const dbProduct = dbProducts.find((p) => p.id === item.product.id)
    if (!dbProduct) continue

    const itemTotal = dbProduct.price * item.quantity
    subtotal += itemTotal

    lineItems.push({
      price_data: {
        currency: 'cad',
        product_data: {
          name: dbProduct.name,
          images: dbProduct.images && dbProduct.images.length > 0 ? [dbProduct.images[0]] : [],
        },
        unit_amount: Math.round(dbProduct.price * 100),
      },
      quantity: item.quantity,
    })

    orderItemsData.push({
      product_id: dbProduct.id,
      quantity: item.quantity,
      price_at_purchase: dbProduct.price,
    })
  }

  // 3. Shipping
  const shippingCost = country === 'CA' ? 0 : (country === 'US' ? 19.99 : 39.99)
  if (shippingCost > 0) {
    lineItems.push({
      price_data: {
        currency: 'cad',
        product_data: { name: 'Flat Rate Shipping' },
        unit_amount: Math.round(shippingCost * 100),
      },
      quantity: 1,
    })
  }

  const total = subtotal + shippingCost

  // 4. Create Pending Order in Supabase
  const shippingAddress = { full_name: fullName, line1, city, province, postal_code, country }
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      profile_id: user?.id || null,
      status: 'pending',
      shipping_address: shippingAddress,
      shipping_rate: shippingCost,
      subtotal,
      total
    })
    .select('id')
    .single()

  if (orderError || !orderData) {
    console.error('Failed to create pending order:', orderError)
    redirect('/checkout?error=Order_Creation_Failed')
  }

  // Insert Order Items
  const orderItemsToInsert = orderItemsData.map(oi => ({ ...oi, order_id: orderData.id }))
  await supabase.from('order_items').insert(orderItemsToInsert)

  // 5. Create Stripe Session
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cart`,
      customer_email: email,
      metadata: {
        order_id: orderData.id,
        customer_email: email,
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
