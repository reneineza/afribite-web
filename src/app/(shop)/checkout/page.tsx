'use client'

import { useCartStore } from '@/store/useCartStore'
import { createCheckoutSession } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState, useEffect } from 'react'

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false)
  const cart = useCartStore()
  const [country, setCountry] = useState('CA')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const shippingCost = country === 'CA' ? 0 : (country === 'US' ? 19.99 : 39.99)
  const total = cart.getTotal() + shippingCost

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Checkout</h1>
      
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

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required placeholder="you@example.com" />
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" name="full_name" required />
                </div>

                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="line1">Address Line 1</Label>
                  <Input id="line1" name="line1" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Province / State</Label>
                    <Input id="province" name="province" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input id="postal_code" name="postal_code" required />
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
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
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

              <div className="flex justify-between text-xl font-bold text-foreground">
                <span>Total</span>
                <span>${total.toFixed(2)} CAD</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" form="checkout-form" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg h-12">
                Pay Securely with Stripe
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
