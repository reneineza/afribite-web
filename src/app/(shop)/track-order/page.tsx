import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, Truck, CheckCircle2, Search, PackageOpen, Clock } from 'lucide-react'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export const metadata = {
  title: 'Track Your Order - Afribite',
  description: 'Track the status of your Afribite order using your order ID.',
}

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const orderIdParam = resolvedParams.order_id
  const orderId = Array.isArray(orderIdParam) ? orderIdParam[0] : orderIdParam

  let order = null
  let orderItems: any[] = []
  let errorMsg = ''

  if (orderId) {
    const supabase = await createClient()

    const { data: orderData, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (error || !orderData) {
      errorMsg = "We couldn't find an order with that ID. Please check and try again."
    } else {
      order = orderData

      // Fetch order items with products
      const { data: itemsData } = await supabase
        .from('order_items')
        .select(`
          quantity,
          price_at_purchase,
          product:products (
            name,
            images
          )
        `)
        .eq('order_id', orderId)
      
      if (itemsData) {
        orderItems = itemsData
      }
    }
  }

  async function searchOrder(formData: FormData) {
    'use server'
    const id = formData.get('order_id')
    if (id) {
      redirect(`/track-order?order_id=${id}`)
    }
  }

  // Determine status steps
  const statusOrder = ['pending', 'paid', 'shipped', 'delivered']
  const currentStatusIndex = order ? statusOrder.indexOf(order.status) : -1

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl min-h-[70vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Track Your Order</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Enter your Order ID below to check the current status of your shipment. You can find this ID in your confirmation email.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-12">
        <Card className="border-primary/20 shadow-md">
          <CardContent className="pt-6">
            <form action={searchOrder} className="flex gap-4">
              <div className="flex-1">
                <Input 
                  name="order_id" 
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000" 
                  defaultValue={orderId || ''}
                  className="h-12 text-base"
                  required
                />
              </div>
              <Button type="submit" size="lg" className="h-12 bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                <Search className="mr-2 h-5 w-5" />
                Track
              </Button>
            </form>
            {errorMsg && (
              <p className="text-destructive mt-3 text-sm font-medium">{errorMsg}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {order && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="border-border shadow-sm overflow-hidden">
            <div className="bg-muted/30 border-b border-border px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Order #{order.id.split('-')[0].toUpperCase()}</p>
                <p className="text-sm text-foreground">Placed on {new Date(order.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <Badge variant={order.status === 'paid' ? 'default' : (order.status === 'pending' ? 'secondary' : 'outline')} className="text-sm px-3 py-1">
                {order.status.toUpperCase()}
              </Badge>
            </div>
            <CardContent className="p-8">
              
              {/* Status Timeline */}
              <div className="relative flex justify-between items-center mb-12 mt-4 max-w-2xl mx-auto">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full" />
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.max(0, (currentStatusIndex / (statusOrder.length - 1)) * 100)}%` }}
                />

                {[
                  { id: 'pending', label: 'Order Placed', icon: Clock },
                  { id: 'paid', label: 'Processing', icon: PackageOpen },
                  { id: 'shipped', label: 'Shipped', icon: Truck },
                  { id: 'delivered', label: 'Delivered', icon: CheckCircle2 }
                ].map((step, idx) => {
                  const Icon = step.icon
                  const isCompleted = currentStatusIndex >= idx
                  const isCurrent = currentStatusIndex === idx

                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-background transition-colors duration-500 ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className={`absolute -bottom-8 text-xs sm:text-sm font-medium whitespace-nowrap ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-foreground border-b pb-2">Shipping Details</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">{order.shipping_address?.full_name}</p>
                    <p>{order.shipping_address?.line1}</p>
                    <p>{order.shipping_address?.city}, {order.shipping_address?.province} {order.shipping_address?.postal_code}</p>
                    <p>{order.shipping_address?.country}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-foreground border-b pb-2">Order Items</h3>
                  <div className="space-y-4">
                    {orderItems.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-muted rounded overflow-hidden shrink-0 border border-border relative">
                          {item.product?.images?.[0] ? (
                            <Image 
                              src={item.product.images[0]} 
                              alt={item.product?.name || 'Product'} 
                              fill 
                              sizes="64px" 
                              className="object-cover" 
                            />
                          ) : (
                            <Package className="w-6 h-6 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          )}
                          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.product?.name || 'Unknown Product'}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          ${(item.price_at_purchase * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-border space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>${order.shipping_rate.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-foreground pt-2">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
