'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCartStore } from '@/store/useCartStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, Info } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const method = searchParams.get('method')
  const clearCart = useCartStore((state) => state.clearCart)
  const [mounted, setMounted] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [orderItems, setOrderItems] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
    clearCart()

    if (orderId) {
      const fetchOrder = async () => {
        const supabase = createClient()
        const { data: o } = await supabase.from('orders').select('*').eq('id', orderId).single()
        if (o) setOrder(o)
        
        const { data: items } = await supabase.from('order_items').select('*, products(name, images)').eq('order_id', orderId)
        if (items) setOrderItems(items)
      }
      fetchOrder()
    }
  }, [clearCart, orderId])

  if (!mounted) return null

  const isInterac = method === 'interac'

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="text-center">
        <CardHeader className="pt-8 pb-4">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Order Received!</CardTitle>
          <CardDescription className="text-lg mt-2">
            Thank you for your purchase. Your order #{orderId || 'is confirmed'}.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pb-8">
          {isInterac ? (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-left mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Info className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-lg text-primary">Payment Required</h3>
              </div>
              <p className="mb-4">
                Your order is currently <strong>pending</strong>. To complete your order, please send an Interac e-Transfer to:
              </p>
              <div className="bg-white p-4 rounded border font-mono text-lg text-center mb-4">
                payments@afribite.com
              </div>
              <p className="text-sm text-muted-foreground">
                Please include your Order ID (<strong>#{orderId}</strong>) in the message/memo of the e-Transfer. 
                Your order will be processed and shipped as soon as the payment is received.
              </p>
            </div>
          ) : (
            <div className="mb-8">
              <p className="text-muted-foreground">
                We've received your payment securely via Stripe. We are now processing your order and will send you a tracking email once it ships.
              </p>
            </div>
          )}

          {order && (
            <div className="text-left bg-muted/20 border border-border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-4 max-h-[300px] overflow-auto pr-2">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-16 w-16 bg-background rounded overflow-hidden shrink-0 border relative">
                      {item.products?.images?.[0] && (
                        <Image src={item.products.images[0]} alt={item.products.name || 'Product'} fill sizes="64px" className="object-cover" />
                      )}
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-medium text-sm line-clamp-2">{item.products?.name}</span>
                      <span className="text-muted-foreground text-sm">${item.price_at_purchase.toFixed(2)}</span>
                    </div>
                    <span className="font-medium">${(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{order.shipping_rate === 0 ? 'Free' : `$${order.shipping_rate.toFixed(2)}`}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${order.total.toFixed(2)} CAD</span>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-semibold mb-2">Shipping Address</h4>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {order.shipping_address?.full_name}<br />
                  {order.shipping_address?.line1}<br />
                  {order.shipping_address?.city}, {order.shipping_address?.province} {order.shipping_address?.postal_code}<br />
                  {order.shipping_address?.country}
                </div>
              </div>
            </div>
          )}

          <div className="pt-6">
            <Link href="/shop">
              <Button size="lg" className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center">Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  )
}
