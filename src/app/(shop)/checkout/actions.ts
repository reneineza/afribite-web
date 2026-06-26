'use server'

import { redirect } from 'next/navigation'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { sendOrderConfirmation, sendAdminOrderNotification } from '@/lib/email'

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
  const discountCode = formData.get('discountCode') as string
  const paymentMethod = formData.get('paymentMethod') as string || 'stripe'

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
    .select('id, name, price, images, stock_quantity')
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
  const { data: shippingZone, error: zoneError } = await supabase
    .from('shipping_zones')
    .select('*')
    .eq('country_code', country)
    .eq('active', true)
    .single()

  if (zoneError || !shippingZone) {
    redirect('/checkout?error=Shipping_not_available_for_this_country')
  }

  const shippingCost = shippingZone.is_free ? 0 : shippingZone.flat_rate
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

  // 4. Discount Logic
  let discountAmount = 0
  let appliedDiscountCode = null
  let appliedDiscountType = 'percentage'
  let appliedDiscountValue = 0

  if (discountCode) {
    const { data: dbCoupon, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', discountCode)
      .eq('active', true)
      .single()

    if (couponError || !dbCoupon) {
      redirect('/checkout?error=Invalid_discount_code')
    }

    if (dbCoupon.expires_at && new Date(dbCoupon.expires_at) < new Date()) {
      redirect('/checkout?error=Discount_code_expired')
    }

    if (dbCoupon.max_uses && dbCoupon.uses_count >= dbCoupon.max_uses) {
      redirect('/checkout?error=Discount_code_usage_limit_reached')
    }

    // Special logic for WELCOME10
    if (discountCode === 'WELCOME10') {
      if (!email) redirect('/checkout?error=Email_required_for_discount')
      
      const { data: subscriber, error: subError } = await supabase
        .from('newsletter_subscribers')
        .select('used_welcome_discount')
        .eq('email', email)
        .single()

      if (subError || !subscriber) {
        redirect('/checkout?error=Discount_only_valid_for_newsletter_subscribers')
      }

      if (subscriber.used_welcome_discount) {
        redirect('/checkout?error=Welcome_discount_has_already_been_used')
      }
    }

    appliedDiscountType = dbCoupon.discount_type
    appliedDiscountValue = dbCoupon.discount_value

    if (appliedDiscountType === 'percentage') {
      discountAmount = subtotal * (dbCoupon.discount_value / 100)
    } else {
      discountAmount = dbCoupon.discount_value
    }
    
    discountAmount = Math.min(subtotal, discountAmount)
    appliedDiscountCode = discountCode
  }

  const total = subtotal - discountAmount + shippingCost

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
      discount: discountAmount,
      total,
      payment_method: paymentMethod
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

  // 5. Interac vs Stripe Flow
  if (paymentMethod === 'interac') {
    // Send email immediately
    await sendOrderConfirmation(email || '', orderData.id, total, 'interac')
    await sendAdminOrderNotification(orderData.id, total, email || '')

    // Mark discount as used since we bypass Stripe webhook
    if (appliedDiscountCode) {
      if (appliedDiscountCode === 'WELCOME10') {
        await supabase
          .from('newsletter_subscribers')
          .update({ used_welcome_discount: true })
          .eq('email', email)
      }
      
      // Increment coupon uses
      const { data: c } = await supabase.from('coupons').select('uses_count').eq('code', appliedDiscountCode).single()
      if (c) {
        await supabase.from('coupons').update({ uses_count: c.uses_count + 1 }).eq('code', appliedDiscountCode)
      }
    }

    // Deduct stock immediately for Interac orders to reserve inventory
    for (const item of orderItemsData) {
      const product = dbProducts.find(p => p.id === item.product_id)
      if (product) {
        await supabase
          .from('products')
          .update({ stock_quantity: Math.max(0, product.stock_quantity - item.quantity) })
          .eq('id', item.product_id)
      }
    }

    redirect(`/checkout/success?order_id=${orderData.id}&method=interac`)
  }

  // 6. Create Stripe Session
  let stripeCouponId = undefined
  if (appliedDiscountCode) {
    try {
      const couponPayload: any = {
        duration: 'once',
      }
      if (appliedDiscountType === 'percentage') {
        couponPayload.percent_off = appliedDiscountValue
      } else {
        couponPayload.amount_off = Math.round(appliedDiscountValue * 100)
        couponPayload.currency = 'cad'
      }
      const stripeCoupon = await stripe.coupons.create(couponPayload)
      stripeCouponId = stripeCoupon.id
    } catch (e) {
      console.error('Failed to create stripe coupon', e)
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      discounts: stripeCouponId ? [{ coupon: stripeCouponId }] : undefined,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?order_id=${orderData.id}&method=stripe`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cart`,
      customer_email: email,
      metadata: {
        order_id: orderData.id,
        customer_email: email || '',
        discount_code_used: appliedDiscountCode || ''
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
