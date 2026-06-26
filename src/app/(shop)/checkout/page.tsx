'use client'

import { useCartStore } from '@/store/useCartStore'
import { createCheckoutSession } from './actions'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function CheckoutContent() {
  const [mounted, setMounted] = useState(false)
  const cart = useCartStore()
  const [country, setCountry] = useState('CA')
  const [shippingZones, setShippingZones] = useState<any[]>([])
  const [discountCode, setDiscountCode] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('stripe')
  
  // Form state for autofill
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [line1, setLine1] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')

  const searchParams = useSearchParams()
  const errorMsg = searchParams.get('error')

  useEffect(() => {
    setMounted(true)
    const fetchZonesAndUser = async () => {
      const supabase = createClient()
      
      // Fetch Shipping Zones
      const { data: zones } = await supabase.from('shipping_zones').select('*').eq('active', true)
      if (zones) setShippingZones(zones)

      // Fetch User & Last Order for Autofill
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || '')
        const { data: lastOrder } = await supabase
          .from('orders')
          .select('shipping_address')
          .eq('profile_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
          
        if (lastOrder && lastOrder.shipping_address) {
          const addr = lastOrder.shipping_address as any
          setFullName(addr.full_name || '')
          setLine1(addr.line1 || '')
          setCity(addr.city || '')
          setProvince(addr.province || '')
          setPostalCode(addr.postal_code || '')
          if (addr.country) setCountry(addr.country)
        }
      }
    }
    fetchZonesAndUser()
  }, [])

  if (!mounted) return null

  const currentZone = shippingZones.find(z => z.country_code === country)
  const shippingCost = currentZone ? (currentZone.is_free ? 0 : currentZone.flat_rate) : 0
  const total = cart.getTotal() + shippingCost

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Checkout</h1>
      
      {errorMsg && (
        <div className="mb-8 p-4 bg-destructive/10 text-destructive border border-destructive rounded-md font-medium">
          {errorMsg.replace(/_/g, ' ')}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact & Shipping</CardTitle>
              <CardDescription>Enter your delivery details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createCheckoutSession} className="space-y-4" id="checkout-form">
                
                {/* Hidden Cart Data */}
                <input type="hidden" name="cartData" value={JSON.stringify(cart.items)} />
                <input type="hidden" name="country" value={country} />
                <input type="hidden" name="discountCode" value={discountCode} />

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" name="full_name" required value={fullName} onChange={e => setFullName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select value={country} onValueChange={(val) => val && setCountry(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {shippingZones.length > 0 ? shippingZones.map(zone => (
                        <SelectItem key={zone.id} value={zone.country_code}>{zone.zone_name}</SelectItem>
                      )) : (
                        <SelectItem value="CA">Canada</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="line1">Address Line 1</Label>
                  <Input id="line1" name="line1" required value={line1} onChange={e => setLine1(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" required value={city} onChange={e => setCity(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Province / State</Label>
                    <Input id="province" name="province" required value={province} onChange={e => setProvince(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input id="postal_code" name="postal_code" required value={postalCode} onChange={e => setPostalCode(e.target.value)} />
                </div>

                <div className="space-y-4 pt-4 mt-6 border-t border-border">
                  <h3 className="font-semibold text-lg">Payment Method</h3>
                  <div className="space-y-3">
                    <div 
                      className={`flex items-center space-x-3 border rounded-md p-4 cursor-pointer transition-colors ${paymentMethod === 'stripe' ? 'border-primary bg-primary/5' : 'bg-muted/20 hover:bg-muted/50'}`}
                      onClick={() => setPaymentMethod('stripe')}
                    >
                      <input 
                        type="radio" 
                        id="stripe" 
                        name="paymentMethod" 
                        value="stripe" 
                        checked={paymentMethod === 'stripe'} 
                        onChange={() => setPaymentMethod('stripe')} 
                        className="w-4 h-4 text-primary"
                      />
                      <Label htmlFor="stripe" className="flex-1 cursor-pointer font-medium">Credit Card (Stripe)</Label>
                    </div>
                    <div 
                      className={`flex items-center space-x-3 border rounded-md p-4 cursor-pointer transition-colors ${paymentMethod === 'interac' ? 'border-primary bg-primary/5' : 'bg-muted/20 hover:bg-muted/50'}`}
                      onClick={() => setPaymentMethod('interac')}
                    >
                      <input 
                        type="radio" 
                        id="interac" 
                        name="paymentMethod" 
                        value="interac" 
                        checked={paymentMethod === 'interac'} 
                        onChange={() => setPaymentMethod('interac')} 
                        className="w-4 h-4 text-primary"
                      />
                      <div className="flex-1 cursor-pointer">
                        <Label htmlFor="interac" className="font-medium">Interac e-Transfer</Label>
                        <p className="text-sm text-muted-foreground mt-1">Send payment manually via your bank app after checkout.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-8 bg-muted/30">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 max-h-[300px] overflow-auto pr-2">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="h-16 w-16 bg-muted rounded overflow-hidden shrink-0 border border-border relative">
                      <Image src={item.product.images[0]} alt={item.product.name} fill sizes="64px" className="object-cover" />
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-medium text-sm text-foreground line-clamp-2">{item.product.name}</span>
                      <span className="text-muted-foreground text-sm">${item.product.price.toFixed(2)}</span>
                    </div>
                    <span className="font-medium text-foreground">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${cart.getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="discountCode">Discount Code</Label>
                <Input 
                  id="discountCode" 
                  placeholder="Enter code (e.g. WELCOME10)" 
                  value={discountCode} 
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                />
              </div>

              <Separator />

              <div className="flex justify-between text-xl font-bold text-foreground">
                <span>Total</span>
                <span>${total.toFixed(2)} CAD</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" form="checkout-form" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg h-12">
                {paymentMethod === 'interac' ? 'Place Order (e-Transfer)' : 'Pay Securely with Stripe'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
